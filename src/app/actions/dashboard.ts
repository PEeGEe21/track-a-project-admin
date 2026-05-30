"use server";

import {
  ApiRequestError,
  fetchWithAuth,
  parseApiResponse,
} from "@/lib/fetch-config";
const endpoint = "/admin";

export async function getDashboardData() {
  try {
    const response = await fetchWithAuth(`${endpoint}/dashboard/stats`);
    const data = await parseApiResponse<{
      stats: Record<string, unknown>;
      charts: Record<string, unknown>;
    }>(response);

    return { success: true, data: data };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiRequestError ? error.message : "Failed to Accept",
    };
  }
}
