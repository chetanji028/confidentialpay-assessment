import { useApiData } from "@/lib/useApiData";
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Copy, TrendingUp, Lock, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { api } from "@/lib/api";
import { fmtUSD } from "@/lib/format";
import { GlassCard, PageHeader, ChainBadge } from "@/components/layout/Primitives";

const DEPOSIT_ADDR = "0x7f3eA4b21cD9f08B5a6c11E0B23F8a9D4cE7b210";

export default function TreasuryPage() {
  const { data } = useApiData<any>("/api/treasury/balances");
  const [wAmount, setWAmount] = useState("");
  const [wTo, setWTo] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader title="Treasury" subtitle="Balances, deposits, and withdrawals across chains." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <BalanceCard icon={Wallet} label="Total Balance" value={fmtUSD(data?.total ?? 0)} change="+12.5%" gradient />
        <BalanceCard icon={Zap} label="Available" value={fmtUSD(data?.available ?? 0)} change="USDC primary" />
        <BalanceCard icon={Lock} label="Reserved" value={fmtUSD(data?.reserved ?? 0)} change="Pending 3 txs" />
        <BalanceCard icon={TrendingUp} label="Gas Fees (mo)" value={fmtUSD(data?.gasFees ?? 0)} change="Avg $2.50/tx" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="xl:col-span-2">
          <h3 className="mb-4 text-base font-semibold">Token Balances</h3>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase text-muted-foreground">
                <th className="pb-2">Token</th>
                <th className="pb-2">Chain</th>
                <th className="pb-2">Balance</th>
                <th className="pb-2">USD Value</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data?.tokens ?? []).map((t: any, i: number) => (
                <tr key={i} className="border-b border-border/60 hover:bg-muted/30">
                  <td className="py-3 font-semibold">{t.symbol}</td>
                  <td className="py-3"><ChainBadge chain={t.chain} /></td>
                  <td className="py-3 font-mono">{t.balance.toLocaleString()}</td>
                  <td className="py-3 font-medium">{fmtUSD(t.value)}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="rounded border border-border bg-card/40 px-2 py-1 text-[10px] hover:bg-muted">Bridge</button>
                      <button className="rounded border border-border bg-card/40 px-2 py-1 text-[10px] hover:bg-muted">Swap</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <div className="mb-3 flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4 text-success" />
              <h3 className="text-sm font-semibold">Deposit</h3>
            </div>
            <select className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm">
              <option>BNB Chain</option>
              <option>Ethereum</option>
              <option>Solana</option>
              <option>Base</option>
            </select>
            <div className="mt-3 rounded-lg border border-border bg-card/40 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Deposit address</p>
              <div className="mt-1 flex items-center gap-2">
                <code className="truncate text-xs">{DEPOSIT_ADDR}</code>
                <button onClick={() => { navigator.clipboard.writeText(DEPOSIT_ADDR); toast.success("Copied"); }} className="shrink-0 rounded p-1 hover:bg-muted">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">Min deposit: 10 USDC</p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-3 flex items-center gap-2">
              <ArrowUpFromLine className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold">Withdraw</h3>
            </div>
            <div className="space-y-3">
              <select className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 text-sm">
                <option>USDC (Balance: 125,000)</option>
                <option>BNB (Balance: 45.5)</option>
              </select>
              <div className="flex gap-2">
                <input value={wAmount} onChange={(e) => setWAmount(e.target.value)} placeholder="Amount" className="flex-1 rounded-lg border border-border bg-input/40 px-3 py-2 text-sm outline-none focus:border-primary" />
                <button onClick={() => setWAmount("125000")} className="rounded-lg border border-border bg-card/40 px-3 text-xs">Max</button>
              </div>
              <input value={wTo} onChange={(e) => setWTo(e.target.value)} placeholder="Destination address" className="w-full rounded-lg border border-border bg-input/40 px-3 py-2 font-mono text-xs outline-none focus:border-primary" />
              <p className="text-[10px] text-muted-foreground">Estimated fee: $2.50</p>
              <button onClick={() => toast.success("Withdrawal submitted")} className="w-full rounded-lg bg-gradient-primary py-2 text-sm font-semibold text-primary-foreground shadow-glow">Withdraw</button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function BalanceCard({ icon: Icon, label, value, change, gradient }: { icon: any; label: string; value: string; change: string; gradient?: boolean }) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl border border-glass-border p-5 shadow-elegant">
      {gradient && <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-primary opacity-30 blur-2xl" />}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        <p className="mt-3 text-2xl font-bold">{value}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{change}</p>
      </div>
    </div>
  );
}
