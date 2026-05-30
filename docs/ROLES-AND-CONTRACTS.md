# Admin Roles And Contracts

## Roles

- `super_admin`: full admin console access, menu management, user activation/suspension, org visibility, and impersonation-sensitive flows
- `admin`: operational access within allowed backend scope; should not receive super-admin-only actions in the UI
- `organization_admin` and lower roles: not expected to use this app directly unless backend policy explicitly allows it

## Frontend Assumptions

- The admin app expects the backend to issue `admin_access_token` and `admin_refresh_token` cookies through the admin login flow.
- The root page and [src/proxy.ts](/var/www/html/trackr-main/tracker-admin/src/proxy.ts) decide access based on token presence and expiry.
- Missing or invalid `NEXT_PUBLIC_API_BASE_URL` is treated as a startup/config error, not a silent fallback.

## Backend Contracts

- `POST /auth/login-admin`
  Returns access token, refresh token, and admin user payload.
- `POST /auth/logout`
  Invalidates the refresh token.
- `GET /admin/dashboard/stats`
  Returns dashboard aggregate stats/charts for the admin home screen.
- `GET /admin/users`
  Supports `page`, `limit`, `search`, `status`, `orderBy`.
- `PATCH /admin/users/:id/suspend`
  Suspends a user account.
- `PATCH /admin/users/:id/activate`
  Reactivates a user account.
- `GET /organizations`
  Supports `page`, `limit`, `search`, `status`, `orderBy`.
- `GET /organizations/:id`
  Returns organization details used by the admin detail page.
- `GET /organizations/:id/team`
  Returns organization team members.
- `GET /organizations/:id/menus`
  Returns organization menu visibility/configuration.
- `GET /admin/menus/global`
  Returns the globally managed menu tree.
- `PUT /admin/menus/global/:id`
  Updates a global menu node.
- `POST /admin/menus/global/reorder`
  Persists menu ordering.

## Response Shape Expectations

- Success payloads should stay consistent with the backend standard:
  `success`, `message`, and `data`
- Errors should remain parsable by `parseApiResponse` so server actions can return actionable messages.
- Paginated list responses should include:
  `data.data` and `data.meta`

## Coordination Notes

- New admin screens should only depend on endpoints that are explicitly protected for admin usage.
- Super-admin-only actions should be hidden in UI and guarded again on the backend.
- Any backend response shape change for users, organizations, menus, or dashboard stats should be documented here before the admin UI is updated.
