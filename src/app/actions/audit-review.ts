"use server";
import { fetchWithAuth, parseApiResponse } from "@/lib/fetch-config";
export type SupportAuditEvent = { id: string; action: string; occurredAt: string; outcome: string; source: string; actor: { label: string; type: string }; subject: { label: string | null; type: string | null }; before?: unknown; after?: unknown; metadata?: unknown };
export type AuditOrganizationOption = { id: string; name: string; slug: string; is_active: boolean };
export async function getAuditOrganizationOptions() {
  const options: AuditOrganizationOption[] = [];
  let page = 1;
  let lastPage = 1;
  do {
    const response = await fetchWithAuth(`/organizations?page=${page}&limit=100&orderBy=ASC`);
    const payload = await parseApiResponse<{ data: AuditOrganizationOption[]; meta: { last_page: number } }>(response);
    options.push(...payload.data);
    lastPage = payload.meta.last_page;
    page += 1;
  } while (page <= lastPage);
  return options;
}
export async function getSupportAuditHeaders(organizationId: string) { const response = await fetchWithAuth(`/admin/audit-review?organizationId=${encodeURIComponent(organizationId)}`); return parseApiResponse<SupportAuditEvent[]>(response); }
export async function breakGlassAuditEvent(organizationId: string, id: string, reason: string) { const response = await fetchWithAuth(`/admin/audit-review/${encodeURIComponent(id)}/break-glass?organizationId=${encodeURIComponent(organizationId)}`, { method: "POST", body: JSON.stringify({ reason }) }); return parseApiResponse<SupportAuditEvent>(response); }
