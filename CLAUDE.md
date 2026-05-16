# CLAUDE.md

See **ARCHITECTURE.md** for all stack, folder structure, and pattern decisions.

## Commands

- `npm run dev` — start dev server
- `npm run build` — type-check + production build
- `npm run lint` — ESLint check
- `npm run lint:fix` — ESLint auto-fix
- `npm run format` — Prettier format
- `npm run test` — run all tests
- `npm run test:watch` — run tests in watch mode
- `npm run test:coverage` — run tests with coverage report

## Project Setup

- Copy this boilerplate into a new project folder
- Update `name` in `package.json` and `<title>` in `index.html`
- Copy `.env.example` to `.env` and fill in values
- Write a project-level section below pointing to `docs/spec.md` and `design/`

## Rules

- Run `npm run lint` and `npm run test` before considering any task complete
- Do not install new dependencies without flagging for approval
- Follow all patterns in ARCHITECTURE.md — the `_example` feature demonstrates them
- Delete the `_example` feature once real features are in place

## This Project

<!-- Replace this section per project -->
<!-- Example:
- Spec: /docs/spec.md
- Design: /design/*.png
- Persistence: localStorage (no backend)
- Out of scope: user accounts, drag-to-reorder
-->
