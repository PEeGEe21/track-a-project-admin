"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, ChevronRight, Clock3, Eye, Loader2, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { AuditOrganizationOption, breakGlassAuditEvent, getAuditOrganizationOptions, getSupportAuditHeaders, SupportAuditEvent } from "@/app/actions/audit-review";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const pretty = (value?: string | null) => value?.replaceAll("_", " ").replaceAll(".", " · ") || "Unknown";

export default function AuditReviewPage() {
  const [organizationId, setOrganizationId] = useState("");
  const [organizations, setOrganizations] = useState<AuditOrganizationOption[]>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState(true);
  const [events, setEvents] = useState<SupportAuditEvent[]>([]);
  const [selected, setSelected] = useState<SupportAuditEvent | null>(null);
  const [detail, setDetail] = useState<SupportAuditEvent | null>(null);
  const [reason, setReason] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? events.filter((event) => [event.action, event.actor.label, event.subject.label, event.subject.type, event.source].some((value) => value?.toLowerCase().includes(query))) : events;
  }, [events, search]);

  useEffect(() => {
    getAuditOrganizationOptions().then(setOrganizations).catch((error) => setMessage({ tone: "error", text: error instanceof Error ? error.message : "Unable to load organizations." })).finally(() => setOrganizationsLoading(false));
  }, []);

  const load = async () => {
    if (!organizationId.trim()) return;
    setLoading(true); setMessage(null); setDetail(null); setSelected(null);
    try { setEvents(await getSupportAuditHeaders(organizationId.trim())); setMessage(null); }
    catch (error) { setEvents([]); setMessage({ tone: "error", text: error instanceof Error ? error.message : "Unable to load audit headers." }); }
    finally { setLoading(false); }
  };

  const reveal = async () => {
    if (!selected || !reason.trim()) return;
    setRevealing(true); setMessage(null);
    try { setDetail(await breakGlassAuditEvent(organizationId.trim(), selected.id, reason.trim())); setReason(""); setMessage({ tone: "success", text: "Break-glass access was recorded in the audit ledger." }); }
    catch (error) { setMessage({ tone: "error", text: error instanceof Error ? error.message : "Unable to reveal event details." }); }
    finally { setRevealing(false); }
  };

  return <div className="space-y-6 text-white">
    <section className="relative overflow-hidden rounded-2xl border border-[#2B2B2B] bg-[#171717] p-6">
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#ADED22]/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-[#ADED22]/20 bg-[#ADED22]/10"><ShieldCheck className="h-6 w-6 text-[#ADED22]" /></div><h1 className="text-2xl font-semibold">Audit support review</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">Inspect safe event headers for support investigations. Field-level details stay sealed until you provide an auditable business reason.</p></div><Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-300"><AlertTriangle /> Privileged support surface</Badge></div>
    </section>

    <Card className="gap-4 border-[#2B2B2B] bg-[#171717] text-white"><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-[#ADED22]" /> Select organization</CardTitle><CardDescription className="text-neutral-400">Choose a workspace to review. Audit requests remain isolated to the selected organization.</CardDescription></CardHeader><CardContent><div className="flex flex-col gap-3 sm:flex-row"><Select value={organizationId} onValueChange={(value) => { setOrganizationId(value); setEvents([]); setSelected(null); setDetail(null); }} disabled={organizationsLoading || organizations.length === 0}><SelectTrigger className="h-11 w-full border-[#353535] bg-[#212121] text-white"><SelectValue placeholder={organizationsLoading ? "Loading organizations…" : organizations.length ? "Choose an organization" : "No organizations available"} /></SelectTrigger><SelectContent className="max-h-80 border-[#353535] bg-[#212121] text-white">{organizations.map((organization) => <SelectItem key={organization.id} value={organization.id} className="focus:bg-[#303030] focus:text-white"><span className="flex items-center gap-2"><span className="font-medium">{organization.name}</span><span className="text-xs text-neutral-500">{organization.slug}</span>{!organization.is_active && <span className="text-xs text-amber-400">Inactive</span>}</span></SelectItem>)}</SelectContent></Select><Button onClick={load} disabled={!organizationId || loading} className="h-11 bg-[#ADED22] px-5 text-black hover:bg-[#9bd01f]">{loading ? <Loader2 className="animate-spin" /> : <Search />} Review ledger</Button></div></CardContent></Card>

    {message && <div role="status" className={`rounded-xl border px-4 py-3 text-sm ${message.tone === "error" ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`}>{message.text}</div>}

    <div className="grid min-h-[520px] gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,.65fr)]">
      <Card className="gap-0 border-[#2B2B2B] bg-[#171717] text-white"><CardHeader className="border-b border-[#2B2B2B] pb-5"><div className="flex items-center justify-between gap-3"><div><CardTitle>Event headers</CardTitle><CardDescription className="mt-1 text-neutral-400">{events.length ? `${events.length} recent events` : "No organization loaded"}</CardDescription></div>{events.length > 0 && <Button variant="ghost" size="icon" onClick={load} title="Refresh"><RefreshCw /></Button>}</div>{events.length > 0 && <div className="relative mt-3"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter action, actor, subject, or source" className="border-[#353535] bg-[#212121] pl-9 text-white" /></div>}</CardHeader><CardContent className="max-h-[650px] overflow-y-auto p-0">{loading ? <div className="flex h-72 flex-col items-center justify-center gap-3 text-neutral-500"><Loader2 className="h-6 w-6 animate-spin" /><span className="text-sm">Loading safe headers…</span></div> : filtered.length === 0 ? <div className="flex h-72 flex-col items-center justify-center px-6 text-center"><Clock3 className="mb-3 h-9 w-9 text-neutral-700" /><p className="font-medium text-neutral-300">No audit events to display</p><p className="mt-1 text-sm text-neutral-500">Load an organization or adjust your filter.</p></div> : filtered.map((event) => <button key={event.id} onClick={() => { setSelected(event); setDetail(null); setReason(""); }} className={`flex w-full items-center gap-4 border-b border-[#292929] p-4 text-left transition hover:bg-[#202020] ${selected?.id === event.id ? "bg-[#ADED22]/[.07]" : ""}`}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#252525]"><ShieldCheck className="h-4 w-4 text-neutral-400" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{pretty(event.action)}</span><span className="mt-1 block truncate text-xs text-neutral-500">{event.actor.label} · {event.subject.label || pretty(event.subject.type)}</span></span><span className="hidden shrink-0 text-right sm:block"><span className="block text-xs text-neutral-400">{new Date(event.occurredAt).toLocaleDateString()}</span><span className="block text-[11px] text-neutral-600">{new Date(event.occurredAt).toLocaleTimeString()}</span></span><ChevronRight className="h-4 w-4 shrink-0 text-neutral-600" /></button>)}</CardContent></Card>

      <Card className="gap-0 border-[#2B2B2B] bg-[#171717] text-white"><CardHeader className="border-b border-[#2B2B2B] pb-5"><CardTitle>Protected detail</CardTitle><CardDescription className="text-neutral-400">A reason is required for every reveal.</CardDescription></CardHeader><CardContent className="p-5">{!selected ? <div className="flex h-72 flex-col items-center justify-center text-center"><Eye className="mb-3 h-9 w-9 text-neutral-700" /><p className="font-medium text-neutral-300">Select an event</p><p className="mt-1 max-w-xs text-sm text-neutral-500">Choose a safe header to begin a controlled detail review.</p></div> : <div className="space-y-5"><div className="rounded-xl border border-[#303030] bg-[#202020] p-4"><Badge variant="outline" className="border-[#ADED22]/20 text-[#ADED22]">{pretty(selected.outcome)}</Badge><p className="mt-3 font-medium">{pretty(selected.action)}</p><p className="mt-1 break-all text-xs text-neutral-500">Event {selected.id}</p></div>{detail ? <div><p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">Redacted event payload</p><pre className="max-h-[390px] overflow-auto rounded-xl border border-[#303030] bg-[#101010] p-4 text-xs leading-5 text-neutral-300">{JSON.stringify({ before: detail.before ?? null, after: detail.after ?? null, metadata: detail.metadata ?? null }, null, 2)}</pre></div> : <><div><label className="mb-2 block text-sm font-medium">Business reason</label><textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} rows={4} placeholder="Example: Support ticket TP-1042 — investigating a reported permission change" className="w-full resize-none rounded-xl border border-[#353535] bg-[#212121] px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-[#ADED22]/50" /><p className="mt-1 text-right text-xs text-neutral-600">{reason.length}/500</p></div><Button onClick={reveal} disabled={!reason.trim() || revealing} className="w-full bg-amber-400 text-black hover:bg-amber-300">{revealing ? <Loader2 className="animate-spin" /> : <Eye />} Record reason and reveal</Button></>}</div>}</CardContent></Card>
    </div>
  </div>;
}
