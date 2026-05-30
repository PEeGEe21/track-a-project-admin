export function normalizeBackendUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export function resolveBackendUrl(
  url = process.env.NEXT_PUBLIC_API_BASE_URL,
): string {
  if (!url) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is required for the tracker-admin app.",
    );
  }

  return normalizeBackendUrl(url);
}

export function buildApiUrl(path: string, baseUrl = resolveBackendUrl()): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
