# Admin Runbook

## Purpose

This app is the administrative console for platform-wide operations:

- user review and suspension/activation
- organization review
- dashboard reporting
- global menu management

## Local Startup

1. Use Node `20.11.1`
2. Install dependencies with `npm install`
3. Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
4. Start the app with `npm run dev`

## Verification

- `npm run typecheck`
- `npm run test:smoke`
- `npm run build`

Notes:

- `npm run build` uses the Webpack production path.
- `npm run lint` still reflects older repo lint debt and is not yet the clean verification baseline.

## Common Failure Modes

- Missing `NEXT_PUBLIC_API_BASE_URL`
  The app now fails fast rather than building broken fetch URLs.
- Expired admin cookie
  Protected routes redirect to `/auth/login`.
- Backend contract drift
  List pages and detail pages may render empty/error states if backend payload shapes change.
- Turbopack production instability
  The project currently uses `next build --webpack` as the reliable production build path.

## Release Checklist

1. Confirm backend admin endpoints are reachable in the target environment
2. Run `npm run typecheck`
3. Run `npm run test:smoke`
4. Run `npm run build`
5. Sanity check login, dashboard, users, organizations, and menu management
6. Confirm admin cookies are `httpOnly`, `sameSite=strict`, and `secure` in production

## Ownership Notes

- Auth and route protection: `src/proxy.ts`, `src/app/actions/auth.ts`
- Shared API/fetch utilities: `src/lib/fetch-config.ts`, `src/lib/api-config.ts`
- Shared query conventions: `src/lib/query-keys.ts`, `src/lib/query-utils.ts`
- Dashboard/admin screens: `src/app/(dashboard)`
