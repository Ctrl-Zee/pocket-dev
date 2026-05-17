# Use real routes inside the device shell

Pocket Dev uses TanStack Router real routes (`/`, `/about`, `/work`, `/projects`, `/resume`, `/contact`) while preserving the retro handheld Device as the constant site frame. We chose real routes over hash routes or a single state-only screen so visitors can use normal browser URLs, refresh, and direct links, while the product still feels like one device whose LCD content changes.

## Consequences

- Routing changes the LCD Page, not the outer Device shell.
- The B control returns from any top-level Page to Home instead of replaying browser history.
- Static hosting must support fallback to `index.html` for real routes; Firebase Hosting is the intended target, with deployment configuration deferred until after the app is created.
