# Use generic workflow notifications for Sandcastle

## Context

We want to add a flexible notification hook to `.sandcastle/main.ts` so the host Sandcastle orchestration loop can send workflow updates to Telegram through a bot.

The initial implementation should be notification-only, but the design should leave room for future live workflow integrations and control surfaces.

## Decisions

1. **Start with outbound notifications only**
   - Telegram will receive status notifications.
   - Telegram replies/commands such as stop, continue, rerun, or approve merge are out of scope for V1.
   - The event model should not block a future inbound control channel.

2. **Plan for live notifications later**
   - The system should support per-issue live notifications.
   - V1 can make live issue notifications configurable.

3. **Use `.sandcastle/.env` for Sandcastle-specific notification config**
   - Credentials and notification settings belong in `.sandcastle/.env`.
   - `.sandcastle/.env` is already gitignored.
   - Suggested variables:
     - `TELEGRAM_BOT_TOKEN`
     - `TELEGRAM_CHAT_ID`
     - `TELEGRAM_NOTIFICATIONS`
     - `TELEGRAM_NOTIFY_ISSUE_LIVE`

4. **Do not expose Telegram secrets to agent sandboxes**
   - Telegram notifications should run in the host orchestration process.
   - Planner, implementer, reviewer, and merger agents do not need Telegram credentials.

5. **Notification failures must not stop the Sandcastle loop**
   - Telegram errors, invalid credentials, network failures, or timeouts should be logged as warnings.
   - Sandcastle should continue planning, executing, reviewing, and merging.

6. **Await notifications with a short timeout**
   - Avoid pure fire-and-forget so final notifications are not lost when Node exits.
   - Avoid unbounded waits so notifications cannot hang the workflow.
   - Recommended timeout: 5 seconds.

7. **Use a generic workflow notifier interface**
   - `.sandcastle/main.ts` should emit generic workflow events.
   - Telegram should be one adapter, not hardcoded throughout the loop.
   - This keeps the door open for other notification targets later.

8. **Use explicit workflow event calls in `.sandcastle/main.ts`**
   - Prefer clear event emission at major workflow points over magical wrappers.
   - Proposed event boundaries:
     - `workflow.started`
     - `iteration.started`
     - `planning.completed`
     - `planning.failed`
     - `issue.started`
     - `issue.completed`
     - `issue.noop`
     - `issue.failed`
     - `execution.completed`
     - `merge.started`
     - `merge.completed`
     - `merge.failed`
     - `workflow.completed`
     - `workflow.failed`

9. **Self-load `.sandcastle/.env` in the Sandcastle script**
   - `npm run sandcastle` should work without manually sourcing `.sandcastle/.env`.
   - If the env file is missing, continue silently.
   - If malformed, warn and continue.

10. **Use concise operational Telegram messages**
    - Include workflow/iteration number, issue id/title, branch, commit count, merge branch list, and short error summaries.
    - Do not send full agent stdout, prompts, diffs, or logs in V1.

11. **Represent no-commit runs as `issue.noop`**
    - A successful run with zero commits is not a failure.
    - It should be modeled as a first-class event.
    - It should only notify Telegram when live issue notifications are enabled.

12. **Use one message per workflow event**
    - Each event produces at most one Telegram message.
    - Do not combine multiple event types into digest messages in V1.
    - Individual messages may still truncate long lists for Telegram readability and message length limits.

13. **Keep live issue notifications off by default**
    - `issue.started`, `issue.completed`, and `issue.noop` should only notify when explicitly enabled.
    - Use `TELEGRAM_NOTIFY_ISSUE_LIVE=1` to enable them.
    - Omitted or falsey values should keep them off.
    - Higher-signal lifecycle and failure events should still notify when Telegram notifications are enabled.

14. **Avoid granular event filtering in V1**
    - `TELEGRAM_NOTIFICATIONS=1` enables the default Telegram event policy.
    - Default lifecycle and failure events are sent when Telegram is enabled.
    - `TELEGRAM_NOTIFY_ISSUE_LIVE=1` additionally enables `issue.started`, `issue.completed`, and `issue.noop`.
    - Do not add `TELEGRAM_EVENTS` or similar per-event filters until there is a real need.

15. **Use one workflow notification module for V1**
    - Put event types, notifier interface, env-based factory, Telegram formatter, and Telegram sender in `.sandcastle/workflow-notifications.ts`.
    - Keep `.sandcastle/main.ts` focused on workflow orchestration and explicit event emission.
    - If a second notifier, richer routing, or inbound control is added later, split this module into separate event and adapter files.

16. **Use a tiny local `.sandcastle/.env` parser**
    - Avoid adding a dependency for V1.
    - Keep `npm run sandcastle` and `npx tsx .sandcastle/main.ts` self-loading.
    - Support simple `KEY=value` lines, blank lines, and comment lines.
    - Strip surrounding single or double quotes.
    - Do not overwrite existing `process.env` values.
    - Warn and continue on malformed lines.
    - Replace with `dotenv` later if more complete `.env` syntax becomes necessary.

17. **Keep notification code under `.sandcastle/`**
    - This is host-side orchestration tooling, not Pocket Dev product code.
    - It uses Node APIs and Telegram secrets that should never be bundled into the Vite/browser app.
    - If it becomes reusable across projects later, extract it then.

18. **Represent fatal orchestration errors as `workflow.failed`**
    - Use `workflow.completed` for normal endings such as no unblocked issues or reaching the maximum iteration count.
    - Use `workflow.failed` for fatal unhandled failures such as planner output parsing errors or unexpected exceptions.
    - Include the final iteration number and a short error summary.

19. **Send per-issue failure notifications immediately**
    - Emit `issue.failed` from inside each issue pipeline catch block.
    - Rethrow after notifying so `Promise.allSettled()` still records the failure.
    - This avoids waiting for all parallel issue pipelines to finish before learning that one failed.

20. **Represent merge failures as `merge.failed`**
    - Emit `merge.failed` when the merge phase throws.
    - Include the branches being merged and a short error summary.
    - A fatal merge failure should also result in `workflow.failed` for the overall orchestration.

21. **Represent planning failures as `planning.failed`**
    - Emit `planning.failed` when the planning agent throws, omits the `<plan>` block, or returns invalid plan JSON.
    - Include the iteration number and a short error summary.
    - A fatal planning failure should also result in `workflow.failed` for the overall orchestration.

22. **Emit an execution summary after issue pipelines settle**
    - Emit `execution.completed` after `Promise.allSettled()` finishes.
    - Include total planned issues, fulfilled count, failed count, no-commit count, and branches with commits.
    - This provides useful progress visibility even when live issue notifications are off.

## Open questions

1. Should “no commits produced, nothing to merge” continue to the next iteration or end the workflow?
   - Current code continues to the next iteration.
   - Current recommendation: keep the existing behavior for now.

2. Should skipped merge phases be represented as `merge.skipped`?
   - This would make “no completed branches” explicit without changing workflow semantics.
   - Current recommendation: add `merge.skipped` with a reason such as `no_completed_branches`.

3. Should Telegram messages use Markdown/HTML formatting or plain text?

4. Should Telegram messages include the project/repo name to distinguish multiple Sandcastle runs?

5. Should there be a single run identifier included in every message?

6. Should the notifier expose only `notify(event)` or also helper methods for common events?

7. Should event payloads include raw errors, preformatted error summaries, or both?

8. Should notification timeout be configurable or hardcoded to 5 seconds for V1?

9. Should missing `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` warn once, or stay completely silent?

10. Should `TELEGRAM_NOTIFICATIONS=1` be required, or should presence of token/chat id enable Telegram automatically?

11. Should the implementation include tests for event formatting/env parsing, or is manual verification enough for this Sandcastle script?

12. Should `.sandcastle/.env.example` be added with Telegram variable names but no secrets?

13. Should completed workflow messages include elapsed duration?

14. Should issue live notifications include implementer/reviewer phase detail, or just issue-level started/completed/noop?

15. Should the workflow emit a notification before closing each sandbox if close fails, or treat sandbox close failures as issue failures?
