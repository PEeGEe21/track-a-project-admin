"use server";

import { cookies } from "next/headers";
import { CreateMenuDto, UpdateMenuDto, ReorderMenuDto } from "@/types/menu";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const endpoint = API_URL + "/menus";

// export async function getMenus() {
//   //   const access_token = (await cookies()).get("access_token")?.value;

//   try {
//     const response = await fetch(`${endpoint}/organization`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${access_token}`,
//       },
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return {
//         success: false,
//         message: data.message || "Something went wrong",
//       };
//     }

//     return { success: true, message: "Success", data: data };
//   } catch {
//     return { success: false, message: "Failed to Accept" };
//   }
// }

export async function getGlobalMenus() {
  const access_token = (await cookies()).get("access_token")?.value;

  try {
    const response = await fetch(`${endpoint}/global`, {
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

    return { success: true, message: "Success", data: data };
  } catch {
    return { success: false, message: "Failed to Accept" };
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const access_token = (await cookies()).get("access_token")?.value;
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

// Get all global menus (Super Admin)
// export async function getGlobalMenus() {
//   return fetchWithAuth("/menus/global");
// }

// Get organization menus
export async function getMenus() {
  return fetchWithAuth("/menus");
}

// Create global menu
export async function createGlobalMenu(menu: CreateMenuDto) {
  return fetchWithAuth("/menus/global", {
    method: "POST",
    body: JSON.stringify(menu),
  });
}

// Update global menu
export async function updateGlobalMenu(id: string, updates: UpdateMenuDto) {
  return fetchWithAuth(`/menus/global/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// Delete global menu
export async function deleteGlobalMenu(id: string) {
  return fetchWithAuth(`/menus/global/${id}`, {
    method: "DELETE",
  });
}

// Reorder menus (batch update)
export async function reorderMenus(items: ReorderMenuDto[]) {
  return fetchWithAuth("/menus/global/reorder", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}
