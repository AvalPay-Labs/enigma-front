# Repository Guidelines

## Project Structure & Module Organization
- Docs: All user-facing docs live in `docs/` (e.g., `registration.md`, `transfer.md`, `withdraw.md`, `sdk-usage.md`). Keep topics scoped and link related pages.
- App code: Source lives in `src/` (bootstrapped with Vite + React + TS). Group by feature: `src/features/<domain>/components|hooks|services`.
- Assets: Store images for docs under `docs/assets/`; app images under `src/assets/`.

## Build, Test, and Development Commands
- `npm ci` — install deps from lockfile.
- `npm run dev` — start local dev server at `http://localhost:5173`.
- `npm run build` — create production build in `dist/`.
- `npm run preview` — preview the production build locally.
- `npm run typecheck` — run TypeScript checks without emitting files.

## Coding Style & Naming Conventions
- TypeScript first; 2-space indent; semicolons; single quotes.
- Components: PascalCase (e.g., `UserCard.tsx`); hooks: camelCase with `use` prefix (e.g., `useBalance.ts`).
- Feature-first layout: `src/features/<domain>/<Component>.tsx`, `api.ts`, `types.ts`.
- Run format/lint if configured before pushing.

## Testing Guidelines
- Place tests next to code or under `tests/`. Use `*.test.ts(x)` naming.
- Focus on protocol flows (deposit, transfer, withdraw), SDK utilities, serialization, and input validation.
- Aim for meaningful coverage on critical paths; test error cases and edge conditions.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (e.g., `feat: add encrypted balance hook`, `docs: clarify withdraw flow`).
- PRs: Clear description, linked issues, screenshots for UI updates, and updated docs when behavior changes.
- Scope: Keep PRs small and atomic; include migration notes for breaking changes.

## Security & Configuration
- Do not commit secrets; use `.env.local` and a secret manager.
- Validate inputs that affect cryptography or balances; add negative tests for failure modes.
