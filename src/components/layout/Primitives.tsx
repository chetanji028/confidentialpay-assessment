import { type ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-2xl border border-glass-border p-5 shadow-elegant ${className}`}>
      {children}
    </div>
  );
}

export function ChainBadge({ chain }: { chain: string }) {
  const color =
    chain === "BNB"
      ? "var(--chain-bnb)"
      : chain === "ETH"
      ? "var(--chain-eth)"
      : chain === "SOL"
      ? "var(--chain-sol)"
      : "var(--chain-base)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium"
      style={{ color, borderColor: `${color}55`, background: `${color}15` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {chain}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { c: string; bg: string }> = {
    completed: { c: "var(--success)", bg: "oklch(0.7 0.17 155 / 0.15)" },
    active: { c: "var(--success)", bg: "oklch(0.7 0.17 155 / 0.15)" },
    processing: { c: "var(--warning)", bg: "oklch(0.78 0.16 75 / 0.15)" },
    pending: { c: "var(--warning)", bg: "oklch(0.78 0.16 75 / 0.15)" },
    scheduled: { c: "var(--secondary)", bg: "oklch(0.78 0.16 210 / 0.15)" },
    failed: { c: "var(--destructive)", bg: "oklch(0.62 0.24 25 / 0.15)" },
    inactive: { c: "var(--muted-foreground)", bg: "oklch(0.5 0.04 270 / 0.2)" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
      style={{ color: s.c, background: s.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.c }} />
      {status}
    </span>
  );
}
