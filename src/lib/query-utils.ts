import { QueryClient, QueryKey } from "@tanstack/react-query";

export async function invalidateAdminQueries(
  queryClient: QueryClient,
  keys: readonly QueryKey[],
) {
  await Promise.all(
    keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
}
