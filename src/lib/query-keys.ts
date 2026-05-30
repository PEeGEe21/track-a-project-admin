import {
  AdminListParams,
  AdminListQueryState,
  normalizeAdminListQueryState,
} from "@/lib/list-params";

export const adminQueryKeys = {
  dashboard: {
    root: ["dashboard"] as const,
    stats: () => ["dashboard", "stats"] as const,
  },
  menus: {
    root: ["menus"] as const,
    scoped: () => ["menus", "scoped"] as const,
    global: () => ["menus", "global"] as const,
  },
  organizations: {
    root: ["organizations"] as const,
    list: (state: AdminListQueryState) =>
      ["organizations", "list", normalizeAdminListQueryState(state)] as const,
    detail: (id: string) => ["organizations", "detail", id] as const,
    team: (id: string) => ["organizations", "team", id] as const,
    menus: (id: string) => ["organizations", "menus", id] as const,
  },
  users: {
    root: ["users"] as const,
    list: (state: AdminListQueryState) =>
      ["users", "list", normalizeAdminListQueryState(state)] as const,
    detail: (id: number | string) => ["users", "detail", String(id)] as const,
    organizations: (id: number | string) =>
      ["users", "organizations", String(id)] as const,
    projects: (id: number | string) =>
      ["users", "projects", String(id)] as const,
    activity: (id: number | string) =>
      ["users", "activity", String(id)] as const,
  },
} as const;

export function getListState(
  page: number,
  params: AdminListParams,
): AdminListQueryState {
  return {
    page,
    limit: params.limit,
    search: params.search,
    status: params.status,
    orderBy: params.orderBy,
  };
}
