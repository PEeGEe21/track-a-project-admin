# Dependency Review

## Result

The admin app now has a lighter maintenance surface in code, but this pass did not reveal many safely removable runtime packages because most declared dependencies are in active use.

## What Changed

- Removed the unused alternate dashboard implementation at [src/app/(dashboard)/dashboard/page-v2.tsx](/var/www/html/trackr-main/tracker-admin/src/app/(dashboard)/dashboard/page-v2.tsx)
- Removed stray unused imports from [src/components/MainLayout/Sidebar.tsx](/var/www/html/trackr-main/tracker-admin/src/components/MainLayout/Sidebar.tsx)

## Packages Reviewed

- `@tanstack/react-query`
- `@dnd-kit/*`
- `@radix-ui/*`
- `framer-motion`
- `recharts`
- `zustand`
- `zod`
- `react-hook-form`
- `@hookform/resolvers`
- `sonner`
- `tailwind-merge`

## Findings

- `@dnd-kit/*` is required by the menu drag-and-drop screen.
- `recharts` is required by the active dashboard page.
- `framer-motion` is required by the sidebar interactions.
- `react-hook-form`, `zod`, and `@hookform/resolvers` are required by the login form.
- `zustand` is required by the sidebar/user client stores.
- The current dependency overlap is acceptable for the app size, but future additions should be reviewed carefully before expanding the UI stack.

## Recommendation

- Prefer removing dead screens/components before adding new packages.
- Keep shared UI on the existing Radix/Tailwind path rather than introducing another component system.
