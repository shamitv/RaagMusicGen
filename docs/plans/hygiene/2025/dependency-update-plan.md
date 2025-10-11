# 2025 Frontend Dependency Hygiene Plan

## Goals
- catalog current runtime and build-time dependencies for the web UI
- define upgrade paths that maintain framework compatibility and reduce security debt
- introduce automation to keep dependency status visible through 2025

## Current Inventory

### Node / React toolchain
| Path | Package | Version | Notes |
| --- | --- | --- | --- |
| `/package.json` | `react` / `react-dom` | ^19.1.0 | Matches UI but duplicates the dependency surface; verify need for root package.json. |
| `/package.json` | `@types/react` / `@types/react-dom` | ^19.1.2 | Only needed if the root hosts TS sources; confirm usage. |
| `ui_src/package.json` | `@fortawesome/*` | ^6.5.x | No known issues; check for 6.6.x release and breaking icon metadata changes. |
| `ui_src/package.json` | `audiobuffer-to-wav` | ^1.0.0 | Last published 2017; assess maintenance risk or replacement. |
| `ui_src/package.json` | `js-file-download` | ^0.4.12 | Deprecated in favor of native `fetch` + `Blob`; evaluate removal. |
| `ui_src/package.json` | `react` / `react-dom` | ^19.1.0 | Ensure react 19 features (e.g., Actions) align with current build; verify compatibility with `webmscore`. |
| `ui_src/package.json` | `react-ga4` | ^2.1.0 | Check for GA4 API updates; ensure measurement IDs configurable. |
| `ui_src/package.json` | `webmscore` | ^1.2.1 | Upstream releases infrequent; confirm MIDI API stability. |
| `ui_src/package.json` | `@tailwindcss/postcss` | ^4.1.4 | Newly released Tailwind PostCSS bridge; confirm compatibility with Tailwind 3.4.x. |
| `ui_src/package.json` | `tailwindcss` | ^3.4.17 | Latest 3.4 patch; plan for Tailwind 4 migration once docs available. |
| `ui_src/package.json` | `postcss` | ^8.4.29 | Outdated; 8.4.49 available with CVE patches. |
| `ui_src/package.json` | `autoprefixer` | ^10.4.15 | Update to >=10.4.20 for recent browser data. |
| `ui_src/package.json` | `typescript` | ^5.0.2 | Misaligned with `@typescript-eslint` 8.x (expects >=5.5); update first. |
| `ui_src/package.json` | `@typescript-eslint/*` | ^8.31.0 | Latest series; confirm parser compatibility after TypeScript bump. |
| `ui_src/package.json` | `vite` | ^6.3.3 | Update scripts to call local binary (remove `../../rnd/react-learn/...` indirection). |
| `ui_src/package.json` | `eslint` | ^9.25.1 | Verify shareable config compatibility when TypeScript updates. |

## Update Strategy
- **Node consolidation**: Decide whether the root `package.json` is necessary; if only the UI relies on React, migrate duplicates into `ui_src` and convert the root to a workspace manifest or remove extra dependency copies.
- **TypeScript toolchain**: Upgrade `typescript` to >=5.7 and align `@typescript-eslint` parser/plugin versions; run lint and build to capture breaking type changes.
- **PostCSS stack**: Bump `postcss` and `autoprefixer` to current 8.4/10.4 patches, ensuring Tailwind 3.4 compatibility. If issues, consider Tailwind 4 preview branch later in the year.
- **Legacy browser utilities**: Replace `js-file-download` with native download helpers; evaluate if `file-saver` duplicates functionality. Remove unused packages post-refactor.
- **Audio pipeline**: Review `audiobuffer-to-wav` maintenance status; if unmaintained, fork or replace with `wavefile` or Web Audio API alternative.
- **Analytics**: Confirm `react-ga4` continues to meet GA4 API updates; plan for migration to server-side tagging if needed.
- **Build scripts**: Update npm scripts to use project-local binaries (`vite`, `eslint`, `tsc`) rather than external relative paths; adopt `npm run` or `pnpm` to reduce path coupling.
- **Security monitoring**: Enable Dependabot (npm) or Renovate with monthly batching. Add `npm audit` to CI hygiene workflow.

## Actionable Steps
1. Audit whether the root `package.json` is required and either remove duplicate dependencies or convert the repo into a managed workspace (npm or pnpm).
	- Commit after completion: "chore(deps): consolidate root package.json"
2. Replace the UI `scripts` section with local binary calls (`vite`, `tsc`, `eslint`) and verify they run under `npm run`.
	- Commit after completion: "chore(scripts): use local binaries for vite/tsc/eslint"
3. Upgrade `typescript` to >=5.7 and keep `@typescript-eslint` packages in lockstep; rerun lint/build to capture type regressions.
	- Commit after completion: "chore(deps): upgrade TypeScript and @typescript-eslint"
4. Update `postcss` to 8.4.49+ and `autoprefixer` to 10.4.20+; run the Tailwind build to confirm compatibility.
	- Commit after completion: "chore(deps): upgrade postcss and autoprefixer"
5. Evaluate the necessity of `js-file-download` and `file-saver`; replace with native download logic and remove unused packages.
	- Commit after completion: "refactor: replace js-file-download/file-saver with native download helper"
6. Review `audiobuffer-to-wav` maintenance status; prototype an alternative or fork if upstream remains inactive.
	- Commit after completion: "chore(audio): replace or fork audiobuffer-to-wav"
7. Validate `react-ga4` usage against the latest GA4 API; ensure configuration supports upcoming measurement features.
	- Commit after completion: "chore(analytics): validate react-ga4 configuration"
8. Enable automated dependency monitoring (Dependabot or Renovate for npm) and add `npm audit` to CI to surface vulnerabilities promptly.
	- Commit after completion: "ci(deps): enable dependabot and npm audit in CI"

## Execution Plan 2025
- **Q1**: Inventory validation; add dependency audit CI jobs; refactor npm scripts; migrate to UI-specific lockfiles (`package-lock.json` in `ui_src`).
- **Q2**: Perform TypeScript/PostCSS upgrades; address lint/build fallout; remove deprecated JS packages; ship UI regression tests.
- **Q3**: Review React 19 adoption (or downgrade to 18 LTS if unstable); introduce Tailwind 4 migration spike once release stabilizes.
- **Q4**: Reassess `webmscore` and audio stack; evaluate moving analytics to Measurement Protocol or consent tooling; renew audit baselines.

## Validation & Risk Mitigation
- Expand automated coverage for UI build (`npm run build`, `npm run lint`) prior to upgrades.
- Create staging branch with canary releases; monitor bundle size, Lighthouse scores, and audio rendering performance post-update.
- Track CVEs via GitHub security alerts; schedule monthly triage with engineering owner.
- Maintain changelog entries highlighting dependency updates and any required client migrations.

## Ownership & Next Steps
- Assign UI dependency lead (frontend team).
- File follow-up tasks: `npm scripts cleanup`, `TypeScript upgrade`, `PostCSS upgrade`, `Dependabot setup`.
- Review plan quarterly; update this document with completion notes and new findings.

## Decision — Root manifest consolidation (Option A)
Choice made: Option A — remove the root `package.json` and `package-lock.json`, and treat `ui_src/package.json` as the single source-of-truth for frontend dependencies.

Rationale:
- Scanning the repository showed React and ReactDOM are only imported under `ui_src` (for example `ui_src/src/main.tsx`, `ui_src/src/App.tsx`). No other project code depends on the root manifest.
- The root manifest contained duplicate entries for `react`, `react-dom`, and types which creates maintenance burden and potential confusion for installs and CI.
- The repo is not currently structured as a monorepo; converting to a workspace (Option B) is feasible but adds CI/tooling work that we do not need right now.

Files removed:
- `package.json` (root)
- `package-lock.json` (root)

Commit used: "chore(deps): consolidate root package.json"

If later we adopt multiple top-level packages, we can convert the repo to an npm/pnpm workspace and add back a root manifest with a `workspaces` array.
