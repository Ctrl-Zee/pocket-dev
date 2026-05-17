# AGENTS.md

## Project quick context

- **Pocket Dev** is Andrew Smith's personal portfolio/resume site presented as a playful retro handheld **Device**. Prefer that product language over generic "app", "console", or "emulator" wording.
- All visible site content should render inside the Device **LCD**. The background and small hints may sit outside; pages/content should not.
- Use real TanStack Router routes for top-level Pages: `/`, `/about`, `/work`, `/projects`, `/resume`, `/contact`. The route changes the LCD Page while the Device shell remains mounted.
- The B control returns from any top-level Page to Home, not browser-history back. Home remembers its LCD Selection during the mounted Pocket Dev session.
- Career content must stay factual and resume-derived. Use `docs/design/resume-data.md` and the PDF resume as sources of truth; do not invent titles, metrics, projects, or claims.
- `docs/design/design.md` is the visual source of truth. `docs/design/prototype.html` is a reference implementation, not production architecture.
- Tech stack: React 19, TypeScript, Vite, TanStack Router, Vitest, Testing Library. Main feature code lives under `src/features/pocket-dev/`; route files live under `src/routes/`.

## Working commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `Ctrl-Zee/pocket-dev` using the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the default triage label vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain docs layout. See `docs/agents/domain.md`.
