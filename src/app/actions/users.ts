"use server";

import {
  ApiRequestError,
  fetchWithAuth,
  parseApiResponse,
} from "@/lib/fetch-config";
import { AdminListParams, buildAdminListSearchParams } from "@/lib/list-params";
const endpoint = "/users";

export async function getUsers(page: number, params: AdminListParams) {
  const queryParams = buildAdminListSearchParams(page, params);

  try {
    const response = await fetchWithAuth(`/admin${endpoint}?${queryParams.toString()}`);
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
          : "Failed to fetch users",
    };
  }
}

export async function activateUser(id: number) {
  try {
    const response = await fetchWithAuth(`${endpoint}/invite/accept/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await parseApiResponse<any>(response);
    return { success: true, message: "Accepted Successfully", data };
  } catch (error) {
    return { success: false, message: "Failed to Accept" };
  }
}

export async function suspendUser(id: number) {
  try {
    const response = await fetchWithAuth(`/admin${endpoint}/${id}/suspend`, {
      method: "PATCH",
    });

    const data = await parseApiResponse<any>(response);
    return { success: true, message: "Success!!", data };
  } catch {
    return { success: false, message: "Failed to Suspend" };
  }
}

export async function reActivateUser(id: number) {
  try {
    const response = await fetchWithAuth(`/admin${endpoint}/${id}/activate`, {
      method: "PATCH",
    });

    const data = await parseApiResponse<any>(response);
    return { success: true, message: "Success!!", data };
  } catch {
    return { success: false, message: "Failed to Suspend" };
  }
}

export async function getUserById(id: number) {
  try {
    const response = await fetchWithAuth(`${endpoint}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await parseApiResponse<any>(response);
    return data;
  } catch {
    return { success: false, message: "Failed to Accept" };
  }
}

export async function rejectUser(id: number) {
  try {
    const response = await fetchWithAuth(`${endpoint}/invite/reject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await parseApiResponse<any>(response);
    return { success: true, message: "Rejected Successfully", data };
  } catch {
    return { success: false, message: "Failed to Reject" };
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await fetchWithAuth(`${endpoint}/invite/reject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await parseApiResponse<any>(response);

    return {
      success: true,
      message: "Rejected Successfully",
      data: data?.data,
    };
  } catch {
    return { success: false, message: "Failed to Reject" };
  }
}
