import { cookies } from "next/headers";
import { buildApiUrl, resolveBackendUrl } from "@/lib/api-config";

interface FetchWithAuthOptions extends RequestInit {
  organizationId?: string | number;
}

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function getTokens(): Promise<{
  access_token: string;
  refresh_token: string;
}> {
  "use server";
  const cookieStore = await cookies();
  const access_token = cookieStore.get("admin_access_token")?.value ?? "";
  const refresh_token = cookieStore.get("admin_refresh_token")?.value ?? "";

  return {
    access_token,
    refresh_token,
  };
}

export const BACKEND_URL = resolveBackendUrl();

export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {},
) {
  const { access_token } = await getTokens();
  const { organizationId, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers);

  if (access_token) {
    headers.set("Authorization", `Bearer ${access_token}`);
  }

  if (organizationId) {
    headers.set("x-organization-id", String(organizationId));
  }

  headers.set("Accept", "application/json");

  if (fetchOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(buildApiUrl(url, BACKEND_URL), {
    ...fetchOptions,
    headers,
  });
}

export async function fetchPublic(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(buildApiUrl(url, BACKEND_URL), {
    ...options,
    headers,
  });
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: string }).message ?? "Request failed")
        : typeof payload === "string" && payload
          ? payload
          : "Request failed";

    throw new ApiRequestError(message, response.status, payload);
  }

  return payload as T;
}
