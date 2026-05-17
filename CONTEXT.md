# Andrew Smith Resume Site

Andrew Smith's personal portfolio and resume site, presented as an interactive retro handheld device named Pocket Dev. Its primary purpose is to be fun and interesting rather than a conventional recruiter-optimized resume page.

## Language

**Pocket Dev**:
The named site experience and device-themed presentation for Andrew Smith's portfolio and resume.
_Avoid_: App name for Andrew himself, generic portfolio theme

**Device**:
The visual handheld shell that frames and controls the site experience.
_Avoid_: Console, Game Boy, hardware emulator

**LCD**:
The in-device screen where all site content is rendered.
_Avoid_: Browser page, modal, viewport

**Page**:
A single LCD-rendered content state such as Home, About, Work, Projects, Resume, Contact, Secret, or Rotate.
_Avoid_: Route, modal, overlay

**Work**:
The Page that summarizes Andrew's professional experience, skills, and related resume-derived qualifications.
_Avoid_: Experience as a separate top-level page, skills as a separate top-level page

**About**:
The Page that explains who Andrew is through identity, location, short bio, and personal details.
_Avoid_: Resume dump, full work history

**Projects**:
The Page that shows selected resume-derived examples of what Andrew has built or contributed to professionally.
_Avoid_: Complete work history, generic skill list, personal projects not intended for showcase

**Resume**:
Andrew Smith's downloadable PDF resume plus a compact pixel-styled preview inside the LCD, used as the source of truth for career facts.
_Avoid_: CV, full duplicate work-history page, fictionalized career content

**Career Content**:
Factual information about Andrew's identity, experience, projects, skills, education, contact details, and work history.
_Avoid_: Invented stats, fictional project outcomes, placeholder resume facts

**Software Engineer**:
Andrew's canonical short professional identity for the site.
_Avoid_: Senior Consultant as the primary public identity, frontend-only label

**Senior Consultant**:
Andrew's factual role title within Work history and resume-derived employment details.
_Avoid_: Primary identity label on Home or About

**Resume Data**:
The extracted factual resume content stored in `docs/design/resume-data.md`.
_Avoid_: Placeholder career content, manually invented facts

**Curated Resume Data**:
Structured site content pulled from Resume Data and adapted to the LCD's limited space.
_Avoid_: Automatically extracted PDF text as runtime content, placeholder project data

**Device Controls**:
The D-pad and buttons that provide the canonical in-world interaction model for Pocket Dev.
_Avoid_: The only way to interact with links or downloads

**Sound**:
Optional quiet interaction effects that are muted by default and can be enabled by the visitor.
_Avoid_: Background music, surprise audio

**Route**:
A real URL path that opens a corresponding Page inside the Device.
_Avoid_: Hash-only navigation, route content outside the LCD

**Secret**:
A deferred easter-egg Page or state triggered by a hidden interaction such as the Konami code.
_Avoid_: Core v1 content, visible navigation item

**Audience**:
The mixed set of people who may view the site: recruiters, hiring managers, friends, family, teammates, other developers, and Andrew himself.
_Avoid_: Recruiters as the only audience

## Relationships

- **Pocket Dev** is for a mixed **Audience**, not a single hiring funnel.
- **Pocket Dev** is the complete resume site experience.
- **Pocket Dev** presents all site content through one **Device**.
- The **Device** contains one **LCD**.
- The **LCD** renders exactly one **Page** at a time.
- Home is a **Page** inside the **LCD**, not an external landing page.
- Outside the **Device**, the visible UI is limited to the background and a small keyboard/control hint.
- `docs/design/design.md` is the visual source of truth; `docs/design/prototype.html` is a reference implementation only.
- Firebase Hosting is the intended deployment target, but deployment configuration is deferred until after the app is created.
- A **Route** maps to a **Page** while preserving the **Device** frame.
- Top-level routes are `/`, `/about`, `/work`, `/projects`, `/resume`, and `/contact`.
- Secret and Rotate are not top-level routes for the first complete version.
- **Device Controls** define the primary interaction metaphor, while normal web click and tap behavior remains available for menu navigation and actionable content.
- The B control returns from any top-level **Page** to Home instead of replaying browser history.
- **Sound** supports the handheld feel but is never required to use **Pocket Dev**.
- **Secret** is aligned with the playful product direction but is not required for the first complete version.
- Home lists top-level **Pages** in this order: About, Work, Projects, Resume, Contact.
- Home and **About** introduce Andrew as a **Software Engineer**.
- **Senior Consultant** appears in Work history where job titles are shown.
- **About** answers who Andrew is.
- **Work** answers what professional experience and skills Andrew has.
- **Projects** answers what Andrew has built or contributed to.
- The **Work** Page contains **Curated Resume Data** about experience, skills, and qualifications.
- The **Resume** Page focuses on a compact pixel preview plus a clear Open PDF action.
- The **Resume** is available to open in a browser tab from the Resume **Page**.
- **Career Content** is factual even when presented through the playful **Pocket Dev** style.
- **Resume Data** is the working text source for site content.
- **Curated Resume Data** comes from **Resume Data** but may be shortened, reorganized, and rewritten in Pocket Dev's plain factual voice for the **LCD**.
- Formal resume wording belongs in the PDF; LCD copy should preserve facts without preserving corporate phrasing.

## Example dialogue

> **Dev:** "Should the About content render outside the handheld on desktop?"
> **Domain expert:** "No — every **Page** renders inside the **LCD** because **Pocket Dev** is the handheld experience."

## Flagged ambiguities

- "Pocket Dev" was used as both repository name and product identity — resolved: **Pocket Dev** is the named site/device experience; the repository happens to share that name.
- "resume site" and "portfolio" both appear — resolved: this is a personal portfolio and resume site, with the **Resume** as a downloadable artifact.
- "resume site" might imply conventional recruiter optimization — resolved: **Pocket Dev** prioritizes a fun, interesting presentation over maximum hiring-funnel efficiency.
- AI assistance is part of Andrew's private learning process, not part of the public **Pocket Dev** experience.
