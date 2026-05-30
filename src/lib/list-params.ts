export type AdminListParams = {
  limit?: number;
  search?: string;
  status?: string;
  orderBy?: "ASC" | "DESC";
};

export type AdminListQueryState = AdminListParams & {
  page: number;
};

export function buildAdminListSearchParams(
  page: number,
  params: AdminListParams,
) {
  const queryParams = new URLSearchParams({ page: String(page) });

  if (params.limit !== undefined && params.limit !== null) {
    queryParams.set("limit", String(parseInt(String(params.limit), 10)));
  }

  if (params.search) {
    queryParams.set("search", String(params.search));
  }

  if (params.status) {
    queryParams.set("status", String(params.status));
  }

  if (params.orderBy) {
    queryParams.set("orderBy", String(params.orderBy));
  }

  return queryParams;
}

export function normalizeAdminListQueryState(
  state: AdminListQueryState,
): AdminListQueryState {
  return {
    page: state.page,
    limit: state.limit,
    search: state.search || "",
    status: state.status || "all",
    orderBy: state.orderBy || "ASC",
  };
}
