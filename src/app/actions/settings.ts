 "use server";

import {
  ApiRequestError,
  fetchWithAuth,
  parseApiResponse,
} from "@/lib/fetch-config";

type ProjectStatusTemplatePayload = {
  title: string;
  color: string;
  isTerminal: boolean;
  isDefault?: boolean;
};

export async function getProjectStatusTemplates() {
  try {
    const response = await fetchWithAuth("/admin/project-status-templates");
    const data = await parseApiResponse<any>(response);

    return {
      success: true as const,
      message: data?.message || "Success",
      data: data?.data ?? [],
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof ApiRequestError
          ? error.message
          : "Failed to fetch project status templates",
      data: [],
    };
  }
}

export async function updateProjectStatusTemplates(
  statuses: ProjectStatusTemplatePayload[],
) {
  try {
    const response = await fetchWithAuth("/admin/project-status-templates", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ statuses }),
    });
    const data = await parseApiResponse<any>(response);

    return {
      success: true as const,
      message: data?.message || "Success",
      data: data?.data ?? [],
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof ApiRequestError
          ? error.message
          : "Failed to update project status templates",
      data: [],
    };
  }
}
