"use server";

import {
  ApiRequestError,
  fetchWithAuth,
  parseApiResponse,
} from "@/lib/fetch-config";
import { AdminListParams, buildAdminListSearchParams } from "@/lib/list-params";
const endpoint = "/organizations";

export async function getOrganizations(
  page: number,
  params: AdminListParams,
) {
  const queryParams = buildAdminListSearchParams(page, params);

  try {
    const response = await fetchWithAuth(`${endpoint}?${queryParams.toString()}`);
    const data = await parseApiResponse<any>(response);

    return {
      success: true as const,
      message: "Success",
      data,
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof ApiRequestError
          ? error.message
          : "Failed to fetch organizations",
    };
  }
}

// global menu
export async function getOrganization(id: string) {
  try {
    const response = await fetchWithAuth(`/organizations/${id}`);
    const data = await parseApiResponse<any>(response);

    return data.data;
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof ApiRequestError
          ? error.message
          : "Failed to fetch organization",
    };
  }
}

export async function getOrganizationTeam(id: string): Promise<any> {
  try {
    const response = await fetchWithAuth(`/organizations/${id}/team`);
    const data = await parseApiResponse<any>(response);

    return data.data;
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof ApiRequestError
          ? error.message
          : "Failed to fetch organization team",
    };
  }
}

export async function getOrganizationMenus(id: string) {
  try {
    const response = await fetchWithAuth(`/organizations/${id}/menus`);
    const data = await parseApiResponse<any>(response);

    return data.data;
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof ApiRequestError
          ? error.message
          : "Failed to fetch organization menus",
    };
  }
}

export async function getOrganizationMenu2(organizationId: string) {
  try {
    const response = await fetchWithAuth(
      `/menus/organization?organizationId=${encodeURIComponent(organizationId)}`,
    );
    const data = await parseApiResponse<any>(response);

    return {
      success: true as const,
      message: "Success",
      data,
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof ApiRequestError
          ? error.message
          : "Failed to fetch organization menus",
    };
  }
}
