import { useState } from "react";
import { useApiData } from "@/lib/useApiData";
import { Lock, Shield, Bell, Wallet, Sparkles, Check, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { GlassCard, PageHeader } from "@/components/layout/Primitives";

export default function SettingsPage() {
  const [tab, setTab] = useState("Security");
  const { data } = useApiData<any>("/api/settings");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Secure your organization, policies, and treasury defaults." />

      <div className="glass inline-flex rounded-xl border border-glass-border p-1">
        {['Security', 'Policies', 'Integrations'].map((item) => (
          <button key={item} onClick={() => setTab(item)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === item ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 'text-muted-foreground hover:text-foreground'}`}>
            {item}
          </button>
        ))}
      </div>

      {tab === 'Security' && (
        <div className="grid gap-4 xl:grid-cols-3">
          <GlassCard className="xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Security Controls</h3>
                <p className="text-sm text-muted-foreground">Multi-factor and private key protection</p>
              </div>
              <button className="rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">Review</button>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { title: 'MFA Required', desc: 'Every admin account uses passkeys or TOTP.', icon: Shield },
                { title: 'Vault Encryption', desc: 'On-chain signing keys are encrypted in the custody layer.', icon: Lock },
                { title: 'Approval Flow', desc: 'High-value transactions need dual approval.', icon: Bell },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-primary/10 p-2 text-primary">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <button className="rounded-lg border border-border bg-card/40 px-3 py-1.5 text-sm">Manage</button>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-secondary" />
              <h3 className="text-base font-semibold">Treasury Wallets</h3>
            </div>
            <div className="mt-4 space-y-3">
              {(data?.wallets ?? []).map((wallet: any) => (
                <div key={wallet.name} className="rounded-xl border border-border bg-card/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{wallet.name}</p>
                    <span className="text-xs text-muted-foreground">{wallet.chain}</span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">{wallet.address}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {tab === 'Policies' && (
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Policy Center</h3>
              <p className="text-sm text-muted-foreground">Approval thresholds and privacy defaults</p>
            </div>
            <button className="rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">Edit Policies</button>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Daily payout cap', value: '$100k' },
              { label: 'Dual approval threshold', value: '$25k' },
              { label: 'Default privacy tier', value: 'High' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3">
                <span className="text-sm">{row.label}</span>
                <span className="text-sm font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {tab === 'Integrations' && (
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Connected Services</h3>
              <p className="text-sm text-muted-foreground">Wallets, HRIS, and compliance providers</p>
            </div>
            <button className="rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">Add Connection</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Workday', status: 'Connected' },
              { name: 'Plaid', status: 'Connected' },
              { name: 'Notion', status: 'Pending' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-border bg-card/40 p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${item.status === 'Connected' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{item.status}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
