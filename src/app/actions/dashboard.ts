"use server";

import { fetchWithAuth } from "@/lib/fetch-config";
const endpoint = "/admin";

export async function getDashboardData() {
  try {
    const response = await fetchWithAuth(`${endpoint}/dashboard/stats`);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Something went wrong",
      };
    }

    return { success: true, data: data };
  } catch {
    return { success: false, message: "Failed to Accept" };
  }
}
