# Tracker Admin

Next.js admin console for the Trackr workspace. This app is intended for administrative workflows such as organizations, users, menus, plans, subscriptions, and top-level dashboard visibility.

## Runtime

- Node.js `20.11.1`
- npm `10+`

Version pins:

- [.nvmrc](/var/www/html/trackr-main/tracker-admin/.nvmrc)
- [.node-version](/var/www/html/trackr-main/tracker-admin/.node-version)

## Environment

Start from `.env.example`.

Required values:

- `NEXT_PUBLIC_API_BASE_URL`

Common local example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NODE_ENV=development
```

`NEXT_PUBLIC_API_BASE_URL` must point at the backend API root, not just the backend host.

## Auth Model

- Admin access token is stored in the `admin_access_token` httpOnly cookie.
- Admin refresh token is stored in the `admin_refresh_token` httpOnly cookie.
- Route protection happens in [src/proxy.ts](/var/www/html/trackr-main/tracker-admin/src/proxy.ts).
- The root page redirects to either `/dashboard` or `/auth/login` based on cookie validity.

## Local Setup

```bash
npm install
cp .env.example .env.local
```

Then run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test:smoke
```

`npm run build` uses the Webpack build path. This is intentional for now because the default Turbopack production build has been unstable in this environment.
`npm run typecheck` generates Next route types before running `tsc`, so it does not depend on leftover `.next` output from a previous build.

## App Shape

- `src/app/actions`
  Server actions for auth, dashboard, users, organizations, and menus.
- `src/lib/fetch-config.ts`
  Shared authenticated/public fetch utilities.
- `src/lib/query-keys.ts`
  Shared query keys for admin lists and detail screens.
- `src/proxy.ts`
  Route protection and token validation.
- `src/hooks`
  Query hooks and UI helpers.
- `src/components`
  Shared UI and form components.

## Docs

- [docs/ROLES-AND-CONTRACTS.md](/var/www/html/trackr-main/tracker-admin/docs/ROLES-AND-CONTRACTS.md)
- [docs/RUNBOOK.md](/var/www/html/trackr-main/tracker-admin/docs/RUNBOOK.md)
- [docs/DEPENDENCY-REVIEW.md](/var/www/html/trackr-main/tracker-admin/docs/DEPENDENCY-REVIEW.md)

## Verification Path

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run test:smoke`

Current verification baseline:

- `npm run typecheck` passes
- `npm run build` passes
- `npm run test:smoke` passes
- `npm run lint` still has pre-existing repo lint debt and should be treated as cleanup work, not a release blocker for the foundation pass

## Current Cleanup Notes

- Query keys and invalidation now live in shared utilities instead of being repeated inline.
- The largest admin page-local dialogs/components have started moving into shared admin component files.
- Dependency review is documented; this pass removed dead admin code rather than forcing risky package churn.

## Current Notes

- This app expects a working backend and admin-capable backend credentials.
- API configuration now fails fast if `NEXT_PUBLIC_API_BASE_URL` is missing.
- Admin routes are protected more broadly than before, including plans, projects, reports, and subscriptions.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
