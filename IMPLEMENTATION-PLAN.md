# Tracker Admin Implementation Plan

Status legend:
- `Not started`
- `In progress`
- `Done`
- `Blocked`

## Scope

This plan covers the admin Next.js app in `tracker-admin`.

## P0 - Critical

| ID | Task | Why it matters | Primary files/areas | Status |
| --- | --- | --- | --- | --- |
| ADM-P0-01 | Harden backend URL/config handling | Current fetch helpers can build requests from undefined base URLs | `src/lib/fetch-config.ts`, env files | Done |
| ADM-P0-02 | Remove noisy debugging logs from auth, hooks, and dashboard flows | Keeps admin flows safer and easier to support | `src/hooks`, `src/app/actions`, dashboard pages | Done |
| ADM-P0-03 | Review admin auth, token storage, and permission-sensitive routes | Admin surfaces need stricter confidence than standard user flows | auth pages, actions, middleware, protected routes | Done |

## P1 - High

| ID | Task | Why it matters | Primary files/areas | Status |
| --- | --- | --- | --- | --- |
| ADM-P1-01 | Pin supported Node.js version and declare `engines` | The app depends on a modern Node runtime | `package.json`, repo docs | Done |
| ADM-P1-02 | Replace starter README with app-specific setup and environment docs | Current docs do not explain how to run or connect the admin app | `README.md` | Done |
| ADM-P1-03 | Add build/lint/typecheck verification path for contributors and CI | Avoids “works on my machine” drift | scripts, CI docs | Done |
| ADM-P1-04 | Add smoke tests for login, organizations, users, menus, and plans | These are core admin workflows and currently lack real coverage | auth flow, dashboard routes, test setup | Not started |
| ADM-P1-05 | Review server actions and fetch wrappers for error handling consistency | Prevents brittle admin behavior when APIs fail | `src/app/actions`, shared fetch utilities | Done |

## P2 - Medium

| ID | Task | Why it matters | Primary files/areas | Status |
| --- | --- | --- | --- | --- |
| ADM-P2-01 | Review component reuse and dashboard page size | Some pages are likely doing too much in one file | `src/app/(dashboard)/**`, components | Done |
| ADM-P2-02 | Standardize query invalidation and mutation patterns | Improves predictability of admin data updates | hooks, React Query usage, actions | Done |
| ADM-P2-03 | Document admin roles, permissions, and expected backend contracts | Reduces confusion during backend/admin coordination | `README.md` or docs folder | Done |
| ADM-P2-04 | Review dependency footprint and remove unused packages | Keeps the admin app easier to maintain | `package.json` | Done |

## P3 - Nice to Have

| ID | Task | Why it matters | Primary files/areas | Status |
| --- | --- | --- | --- | --- |
| ADM-P3-01 | Add UI consistency pass after core stability work | Best done once data and auth flows are reliable | shared UI and dashboard screens | Done |
| ADM-P3-02 | Add admin operational runbook notes | Helpful for support, releases, and incident handling | docs/process | Done |

## Completion Tracking

Update the `Status` column as work progresses:
- Move to `In progress` when implementation begins
- Mark `Done` only after code, validation, and docs are finished
- Use `Blocked` if progress depends on backend/API changes or product decisions
