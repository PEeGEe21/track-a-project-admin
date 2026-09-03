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
  const cookieStore = await cookies();
  const { access_token, refresh_token } = await getTokens();
  const { organizationId, ...fetchOptions } = options;
  const request = (token: string) => {
    const headers = new Headers(fetchOptions.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (organizationId) headers.set("x-organization-id", String(organizationId));
    headers.set("Accept", "application/json");
    if (fetchOptions.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    return fetch(buildApiUrl(url, BACKEND_URL), { ...fetchOptions, headers, cache: fetchOptions.cache ?? "no-store" });
  };

  let response = await request(access_token);
  if (response.status !== 401 || !refresh_token) return response;

  const refreshResponse = await fetch(
    buildApiUrl(`/auth/access-token?refreshToken=${encodeURIComponent(refresh_token)}`, BACKEND_URL),
    { method: "GET", headers: { Accept: "application/json" }, cache: "no-store" },
  );
  if (!refreshResponse.ok) return response;
  const refreshed = await refreshResponse.json() as { accessToken?: string; refreshToken?: string; data?: { accessToken?: string; refreshToken?: string } };
  const nextAccessToken = refreshed.accessToken ?? refreshed.data?.accessToken;
  const nextRefreshToken = refreshed.refreshToken ?? refreshed.data?.refreshToken;
  if (!nextAccessToken) return response;
  const secure = process.env.NODE_ENV === "production";
  cookieStore.set("admin_access_token", nextAccessToken, { httpOnly: true, sameSite: "strict", secure, maxAge: 60 * 15, path: "/" });
  if (nextRefreshToken) cookieStore.set("admin_refresh_token", nextRefreshToken, { httpOnly: true, sameSite: "strict", secure, maxAge: 60 * 60 * 24 * 7, path: "/" });
  response = await request(nextAccessToken);
  return response;
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
