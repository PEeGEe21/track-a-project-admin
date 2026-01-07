"use server";

import { fetchWithAuth } from "@/lib/fetch-config";
import { cookies } from "next/headers";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const endpoint = baseUrl + "/organizations";

type GetOrganizationsParams = {
  limit?: number;
  search?: string;
  status?: string;
  orderBy?: "ASC" | "DESC";
};


export async function getOrganizations(
  page: number,
  params: GetOrganizationsParams
) {
  const access_token = (await cookies()).get("access_token")?.value;

  const queryParams = new URLSearchParams({ page: String(page) });

  if (params.limit !== undefined && params.limit !== null) {
    queryParams.set("limit", String(parseInt(String(params.limit))));
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

  try {
    const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();

    console.log(data, "data");

    if (!response.ok) {
      return {
        success: false as const,
        message: data.message || "Something went wrong",
      };
    }

    return {
      success: true as const,
      message: "Success",
      data,
    };
  } catch {
    return {
      success: false as const,
      message: "Failed to fetch users",
    };
  }
}

// Delete global menu
export async function getOrganization(id: string) {
  const response = await fetchWithAuth(`/organizations/${id}`);

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false as const,
      message: data.message || "Something went wrong",
    };
  }

  return data.data;
}

export async function getOrganizationTeam(id: string): Promise<any> {
  const response = await fetchWithAuth(`/organizations/${id}/team`);

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false as const,
      message: data.message || "Something went wrong",
    };
  }

  return data.data;
}

export async function getOrganizationMenus(id: string) {
  const response = await fetchWithAuth(`/organizations/${id}/menus`);

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false as const,
      message: data.message || "Something went wrong",
    };
  }

  return data.data;
}
