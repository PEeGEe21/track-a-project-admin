"use server";

import { CreateMenuDto, UpdateMenuDto, ReorderMenuDto } from "@/types/menu";
import {
  ApiRequestError,
  fetchWithAuth,
  parseApiResponse,
} from "@/lib/fetch-config";
const endpoint = "/admin/menus";

export async function getGlobalMenus() {
  try {
    const response = await fetchWithAuth(`${endpoint}/global`);
    const data = await parseApiResponse<any>(response);
    return { success: true, message: "Success", data };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof ApiRequestError ? error.message : "Failed to Accept",
    };
  }
}

async function fetchData(url: string, options: RequestInit = {}) {
  const response = await fetchWithAuth(`${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return parseApiResponse<any>(response);
}

export async function getMenus() {
  return fetchData(`${endpoint}`);
}

export async function createGlobalMenu(menu: CreateMenuDto) {
  return fetchData(`${endpoint}/menus/global`, {
    method: "POST",
    body: JSON.stringify(menu),
  });
}

export async function updateGlobalMenu(id: string, updates: UpdateMenuDto) {
  return fetchData(`${endpoint}/global/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteGlobalMenu(id: string) {
  return fetchData(`${endpoint}/global/${id}`, {
    method: "DELETE",
  });
}

export async function reorderMenus(items: ReorderMenuDto[]) {
  return fetchData(`${endpoint}/global/reorder`, {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}
