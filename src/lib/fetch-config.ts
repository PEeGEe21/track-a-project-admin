import { cookies } from "next/headers";

export async function getTokens(): Promise<{
  access_token: string;
  refresh_token: string;
}> {
  "use server";
  const cookieStore = await cookies();
  const access_token = cookieStore.get("access_token")?.value ?? "";
  const refresh_token = cookieStore.get("refresh_token")?.value ?? "";

  return new Promise((resolve) =>
    resolve({
      access_token,
      refresh_token,
    })
  );
}

export const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { access_token } = await getTokens();

  const headers = new Headers(options.headers);

  if (access_token) {
    headers.set("Authorization", `Bearer ${access_token}`);
  }
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  return fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers,
  });
}
