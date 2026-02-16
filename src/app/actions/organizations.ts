"use server";

import { fetchWithAuth } from "@/lib/fetch-config";
import { cookies } from "next/headers";
const endpoint = "/organizations";

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
  const access_token = (await cookies()).get("admin_access_token")?.value;

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
    const response = await fetchWithAuth(`${endpoint}?${queryParams.toString()}`, {
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

// global menu
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

export async function getOrganizationMenu2(organizationId: string) {
  const response = await fetchWithAuth(`/menus/organization`, {
    organizationId,
  });
  console.log(organizationId, "organizationId");
  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || "Something went wrong",
    };
  }
  console.log(data, "datummm");
  return data;

  // return {
  //   success: true,
  //   message: data.message || "Successfully fetched menus",
  //   data,
  // };
}
