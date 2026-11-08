# CardGGANG!! Development Instructions

Project guidance, not an installable agent skill. Apply when working on CardGGANG.

## Scope

- Build a browser photo booth: capture/upload, crop, edit text, create three cards, open a pack, export PNGs.
- Planned stack: React, TypeScript, Vite, Canvas 2D. Confirm actual dependencies and commands in package.json and the lockfile.
- No backend, auth, payments, AI, video export, or multiplayer unless requested.
- Treat README plans as requirements, not evidence of implementation.

## Context Budget

- Read applicable repository instructions; check git status before editing. Preserve unrelated user changes.
- Use rg --files and scoped rg -n searches. Read relevant ranges, types, and callers; expand only when needed.
- Reuse verified context. Reread only after changes or when evidence is missing.
- Exclude generated files, binaries, dependencies, and full lockfiles from context. Inspect only relevant entries.
- Batch independent reads/searches; sequence dependent edits and checks.
- Prefer local code/types/docs. Consult official docs when API behavior or compatibility is uncertain.
- Keep product requirements in README and workflow rules here; avoid duplicate documentation.

## Workflow

1. Define 1–3 acceptance criteria; skip lengthy plans for small tasks.
2. Inspect relevant entry points and existing patterns.
3. Make the smallest complete change. Avoid unrelated refactors and speculative abstractions.
4. Run focused checks, fix failures, and review the diff.
5. Stop when criteria pass. Briefly report changes, checks, and remaining limitations.

Resolve routine choices autonomously. Ask only when missing information materially affects scope, privacy, licensing, or correctness.

## Implementation

- Reuse existing components, helpers, and styles. Add dependencies only with a concrete need.
- Avoid duplicate derived state; do not hide type errors with any or unsafe assertions.
- Separate card generation from UI; reference photo Blobs by photoId.
- Snapshot draft data, rarity, and decoration seed at pack creation. Never reroll on rendering or reopening.
- Centralize rarity probabilities; verify totals and boundaries. Stats are editable entertainment values, not face-based assessments.
- Share card data and layout definitions between preview and PNG rendering.
- Await fonts/images before export. Render static PNG effects explicitly; CSS animation does not export automatically.
- Handle Korean text, emoji, long input, portrait photos, and consistent preview/export mirroring.

## Privacy and Access

- Process photos and user text locally. Do not add external upload, analytics, or logging of this content.
- Request camera access in the capture screen; provide upload fallback for denial or missing hardware.
- Stop media tracks on exit. Release unused Object URLs and event listeners.
- Downsample large photos to bound memory; show actionable export errors.
- Support button/keyboard alternatives to dragging and respect prefers-reduced-motion.

## Licensing

- Preserve the policy requiring prior written permission for commercial use. Do not switch to MIT, Apache, GPL, or AGPL without authorization.
- LICENSE is not finalized. PolyForm Noncommercial is a candidate with institutional exceptions; do not claim a blanket commercial-use ban.
- Do not bundle existing franchises' characters, logos, or card frames. Public API access does not grant asset rights.
- Record third-party asset sources and redistribution terms; secure separate commercial relicensing rights for contributed assets where needed.

## Verification

- Use actual repository scripts; never invent commands or claim unrun checks passed.
- For type/logic changes, run relevant type checks and existing tests. Build app changes when feasible.
- Add tests for meaningful rules: rarity boundaries, pack immutability, crop transforms. Avoid tests that merely repeat implementation or low-impact copy/style edits.
- Inspect affected UI when tools permit. State unverified behavior.
- Do not repeat passing checks without changes or new evidence. Mark features complete only after implementation and verification.

## Communication

- Use Korean for replies and code comments. Comments explain reasons or constraints.
- Write all commit messages in English for an international audience.
- Summarize relevant errors and locations; do not dump full files, logs, or diffs.
- Suggest commit checkpoints at completed feature boundaries. Do not commit, push, or publish without authorization.
- Keep handoffs short: changed files, decisions, next step, blockers.

## Solo Development and Work Records

- Keep `main` as the stable branch. Create a short-lived branch from `main` for each focused feature, fix, documentation change, or maintenance task; do not add a permanent `develop` branch.
- Use lowercase kebab-case branch names with these prefixes: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, or `chore/<slug>`. Examples: `feat/photo-upload`, `fix/camera-cleanup`, `docs/readme-languages`.
- Keep each branch focused on one reviewable outcome. Integrate it back into `main` before starting unrelated work, then remove the finished branch.
- Write concise English commit messages with conventional prefixes such as `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, or `style:`. Use imperative phrasing and describe one change per commit.
- Keep commits small and aligned with the work record; do not combine unrelated changes just to reduce commit count.
- For each proposed commit unit, add a matching work record under `docs/worklog/` before committing. Include intent, files or behavior changed, checks run and their results, and follow-up work.
- Keep planning and work records local under `docs/`, which is gitignored. Do not force-add them to Git unless the user changes that policy.
- Do not create commits or push unless the user explicitly asks. Use task branches for future isolated work, and avoid switching away from a branch with unrelated uncommitted changes.
