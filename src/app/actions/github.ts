"use server";
import { fetchWithAuth, parseApiResponse } from "@/lib/fetch-config";
export type GithubHealth = {
  connections: {
    total: number;
    active: number;
    silent: number;
    failing: number;
    pending: number;
  };
  deliveries: Record<string, number>;
};
export async function getGithubHealth(organizationId: string) {
  const response = await fetchWithAuth(
    `/admin/github/health?organizationId=${encodeURIComponent(organizationId)}`,
  );
  return parseApiResponse<GithubHealth>(response);
}
