"use server";

import { cookies } from "next/headers";
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const endpoint = baseUrl + "/users";

type GetUsersParams = {
  limit?: number;
  search?: string;
  status?: string;
  orderBy?: "ASC" | "DESC";
};

export async function getUsers(page: number, params: GetUsersParams) {
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
    const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();

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

export async function activateUser(id: number) {
  const access_token = (await cookies()).get("admin_access_token")?.value;

  try {
    const response = await fetch(`${endpoint}/invite/accept/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Something went wrong",
      };
    }

    return { success: true, message: "Accepted Successfully", data: data };
  } catch {
    return { success: false, message: "Failed to Accept" };
  }
}

export async function getUserById(id: number) {
  const access_token = (await cookies()).get("admin_access_token")?.value;

  try {
    const response = await fetch(`${endpoint}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Something went wrong",
      };
    }

    console.log(data , 'ni')
    return data;
  } catch {
    return { success: false, message: "Failed to Accept" };
  }
}

export async function rejectUser(id: number) {
  const access_token = (await cookies()).get("admin_access_token")?.value;

  try {
    const response = await fetch(`${endpoint}/invite/reject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Something went wrong",
      };
    }

    return { success: true, message: "Rejected Successfully", data: data };
  } catch {
    return { success: false, message: "Failed to Reject" };
  }
}

export async function deleteUser(id: number) {
  const access_token = (await cookies()).get("admin_access_token")?.value;

  try {
    const response = await fetch(`${endpoint}/invite/reject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Something went wrong",
      };
    }

    return {
      success: true,
      message: "Rejected Successfully",
      data: data?.data,
    };
  } catch {
    return { success: false, message: "Failed to Reject" };
  }
}
