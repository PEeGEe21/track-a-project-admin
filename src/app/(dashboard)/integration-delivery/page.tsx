"use client";
import { useEffect, useState } from "react";
import { Building2, Loader2, RefreshCw, Webhook } from "lucide-react";
import {
  getAuditOrganizationOptions,
  AuditOrganizationOption,
} from "@/app/actions/audit-review";
import {
  getIntegrationHealth,
  IntegrationHealth,
} from "@/app/actions/integration-delivery";
import { getGithubHealth, GithubHealth } from "@/app/actions/github";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IntegrationDeliveryPage() {
  const [organizations, setOrganizations] = useState<AuditOrganizationOption[]>(
    [],
  );
  const [organizationId, setOrganizationId] = useState("");
  const [health, setHealth] = useState<IntegrationHealth | null>(null);
  const [github, setGithub] = useState<GithubHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    getAuditOrganizationOptions()
      .then(setOrganizations)
      .catch((e) =>
        setError(
          e instanceof Error ? e.message : "Unable to load organizations",
        ),
      );
  }, []);
  const load = async () => {
    if (!organizationId) return;
    setLoading(true);
    setError("");
    try {
      const [outbound, inbound] = await Promise.all([
        getIntegrationHealth(organizationId),
        getGithubHealth(organizationId),
      ]);
      setHealth(outbound);
      setGithub(inbound);
    } catch (e) {
      setHealth(null);
      setGithub(null);
      setError(
        e instanceof Error ? e.message : "Unable to load integration health",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6 text-white">
      <section className="rounded-2xl border border-[#2B2B2B] bg-[#171717] p-6">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-[#ADED22]/10 p-3">
            <Webhook className="h-6 w-6 text-[#ADED22]" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">Integration health</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Tenant-safe aggregate status. URLs, repositories, secrets, and
              payloads are never exposed.
            </p>
          </div>
        </div>
      </section>
      <Card className="border-[#2B2B2B] bg-[#171717] text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#ADED22]" />
            Organization
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Select a workspace to inspect aggregate health.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Select
            value={organizationId}
            onValueChange={(value) => {
              setOrganizationId(value);
              setHealth(null);
              setGithub(null);
            }}
          >
            <SelectTrigger className="border-[#353535] bg-[#212121]">
              <SelectValue placeholder="Choose an organization" />
            </SelectTrigger>
            <SelectContent className="border-[#353535] bg-[#212121] text-white">
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={load}
            disabled={!organizationId || loading}
            className="bg-[#ADED22] text-black hover:bg-[#9bd01f]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}Load
            health
          </Button>
        </CardContent>
      </Card>
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </div>
      )}
      {health && (
        <Metrics
          title="Outbound webhooks"
          values={{
            endpoints: health.endpoints.total,
            active: health.endpoints.active,
            "dead letters": health.deliveries.dead_letter ?? 0,
          }}
        />
      )}
      {github && (
        <Metrics
          title="GitHub webhooks"
          values={{
            connections: github.connections.total,
            active: github.connections.active,
            silent: github.connections.silent,
            failing: github.connections.failing,
            queued: github.deliveries.queued ?? 0,
            failed: github.deliveries.failed ?? 0,
            processed: github.deliveries.processed ?? 0,
          }}
        />
      )}
    </div>
  );
}
function Metrics({
  title,
  values,
}: {
  title: string;
  values: Record<string, number>;
}) {
  return (
    <Card className="border-[#2B2B2B] bg-[#171717] text-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(values).map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-[#303030] bg-[#202020] p-4"
          >
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
