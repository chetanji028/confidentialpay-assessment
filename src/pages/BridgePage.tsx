import { useApiData } from "@/lib/useApiData";
import { ArrowLeftRight, RefreshCw, ShieldCheck, Zap } from "lucide-react";
import { api } from "@/lib/api";
import { fmtUSD } from "@/lib/format";
import { GlassCard, PageHeader } from "@/components/layout/Primitives";

export default function BridgePage() {
  const { data } = useApiData<any>("/api/bridge");

  return (
    <div className="space-y-6">
      <PageHeader title="Bridge" subtitle="Move funds across chains while preserving privacy and auditability." />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <GlassCard>
          <div className="rounded-2xl border border-border bg-card/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Bridge Funds</p>
                <p className="text-sm text-muted-foreground">Secure transfer between supported chains</p>
              </div>
              <button className="rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">Preview</button>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-background/40 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">From</span>
                <span className="font-medium">BNB</span>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl border border-border bg-card/40 px-3 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">{fmtUSD(data?.amount ?? 50000)}</p>
                </div>
                <div className="rounded-lg bg-gradient-primary px-3 py-2 text-sm font-semibold text-primary-foreground">USDC</div>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="rounded-full border border-border bg-card/40 p-2">
                  <ArrowLeftRight className="h-4 w-4 text-secondary" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">To</span>
                <span className="font-medium">ETH</span>
              </div>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
              <Zap className="h-4 w-4" /> Execute Bridge
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-secondary" />
            <h3 className="text-base font-semibold">Transfer Status</h3>
          </div>
          <div className="mt-4 space-y-3">
            {(data?.history ?? []).map((item: any) => (
              <div key={item.id} className="rounded-xl border border-border bg-card/40 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{item.label}</p>
                  <span className="text-xs text-muted-foreground">{item.status}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
