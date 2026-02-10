import { cookies } from "next/headers";
interface FetchWithAuthOptions extends RequestInit {
  organizationId?: string | number;
}

export async function getTokens(): Promise<{
  access_token: string;
  refresh_token: string;
}> {
  "use server";
  const cookieStore = await cookies();
  const access_token = cookieStore.get("admin_access_token")?.value ?? "";
  const refresh_token = cookieStore.get("admin_refresh_token")?.value ?? "";

  return new Promise((resolve) =>
    resolve({
      access_token,
      refresh_token,
    })
  );
}

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {}
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

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  return fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers,
  });
}

export async function fetchPublic(url: string, options: RequestInit = {}) {
  return fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });
}
