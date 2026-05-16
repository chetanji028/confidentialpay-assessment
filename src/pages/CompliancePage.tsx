import { useApiData } from "@/lib/useApiData";
import { ShieldCheck, AlertTriangle, CheckCircle2, FileCheck2 } from "lucide-react";
import { api } from "@/lib/api";
import { GlassCard, PageHeader, StatusBadge } from "@/components/layout/Primitives";

export default function CompliancePage() {
  const { data } = useApiData<any>("/api/compliance");

  return (
    <div className="space-y-6">
      <PageHeader title="Compliance" subtitle="Track policies, audits, and proof readiness for every payroll flow." />

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <h3 className="text-base font-semibold">Policy Health</h3>
          </div>
          <p className="mt-4 text-3xl font-semibold">{data?.policyHealth ?? "98%"}</p>
          <p className="mt-2 text-sm text-muted-foreground">All compliance policies are current and active.</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-secondary" />
            <h3 className="text-base font-semibold">Audit Trail</h3>
          </div>
          <p className="mt-4 text-3xl font-semibold">{data?.auditTrail ?? "24"}</p>
          <p className="mt-2 text-sm text-muted-foreground">Signed and verifiable records this month.</p>
        </GlassCard>
        <GlassCard>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-base font-semibold">Open Issues</h3>
          </div>
          <p className="mt-4 text-3xl font-semibold">{data?.openIssues ?? "2"}</p>
          <p className="mt-2 text-sm text-muted-foreground">One KYC review and one policy update pending.</p>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-base font-semibold">Recent Checks</h3>
        <div className="mt-4 space-y-3">
          {(data?.checks ?? []).map((item: any) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
