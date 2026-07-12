"use server";

import {
  ApiRequestError,
  fetchWithAuth,
  parseApiResponse,
} from "@/lib/fetch-config";
import { AdminListParams, buildAdminListSearchParams } from "@/lib/list-params";
const endpoint = "/organizations";

export type OrganizationEntitlement = {
  key: string;
  label: string;
  description: string;
  minimumTier: string;
  defaultEnabled: boolean;
  organizationTier: string;
  override: boolean | null;
  planEligible: boolean;
  permissionGranted: boolean;
  enabled: boolean;
  reason: string;
};

export async function getOrganizationEntitlements(id: string) {
  const response = await fetchWithAuth(`/admin/organizations/${id}/entitlements`);
  return parseApiResponse<OrganizationEntitlement[]>(response);
}

export async function updateOrganizationEntitlement(
  id: string,
  capability: string,
  enabled: boolean,
) {
  const response = await fetchWithAuth(`/admin/organizations/${id}/entitlements`, {
    method: "PATCH",
    body: JSON.stringify({ capability, enabled }),
  });
  return parseApiResponse<OrganizationEntitlement[]>(response);
}

export async function clearOrganizationEntitlement(
  id: string,
  capability: string,
) {
  const response = await fetchWithAuth(
    `/admin/organizations/${id}/entitlements/${encodeURIComponent(capability)}`,
    { method: "DELETE" },
  );
  return parseApiResponse<OrganizationEntitlement[]>(response);
}

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
