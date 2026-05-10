import { motion } from "framer-motion";
import { Shield, Sparkles, Zap } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-5">
      <div className="relative hidden overflow-hidden lg:col-span-3 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-20 bottom-10 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-3xl" />
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/40"
              style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
              animate={{ y: [-10, 10, -10], opacity: [0.2, 0.9, 0.2] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </div>

        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">ConfidentialPay</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-xl"
        >
          <h1 className="text-5xl font-bold leading-tight tracking-tight">
            Private Payroll for the <span className="text-gradient">Multi-Chain Economy</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            ZK-powered confidentiality, FHE encryption, and one-click cross-chain settlement — for teams that take privacy seriously.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Sparkles, label: "ZK Privacy" },
              { icon: Zap, label: "Multi-Chain" },
              { icon: Shield, label: "Enterprise" },
            ].map((feature) => (
              <div key={feature.label} className="glass rounded-xl px-4 py-3">
                <feature.icon className="h-5 w-5 text-secondary" />
                <p className="mt-2 text-sm font-medium">{feature.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} ConfidentialPay Inc. — Deployed on BNB Chain.
        </p>
      </div>

      <div className="relative flex items-center justify-center px-6 py-12 lg:col-span-2">{children}</div>
    </div>
  );
}
