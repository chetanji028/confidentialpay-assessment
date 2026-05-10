import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield, Sparkles, Zap, ArrowRight, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { AuthShell } from "@/components/auth/AuthShell";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@confidentialpay.com");
  const [password, setPassword] = useState("00000");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);

    if (ok) {
      toast.success("Welcome back, Admin");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials. Use the demo credentials shown.");
    }
  }

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-strong w-full max-w-md rounded-2xl p-8 shadow-elegant"
      >
        <div className="mb-6 flex lg:hidden">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your ConfidentialPay account.</p>

        <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-3 text-xs">
          <p className="font-medium text-secondary">💡 Demo credentials</p>
          <p className="mt-1 font-mono text-muted-foreground">admin@confidentialpay.com / 00000</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-border bg-input/40 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-border bg-input/40 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="••••••"
                required
              />
              <button type="button" onClick={() => setShow((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <span className="relative inline-flex h-5 w-9 items-center">
                <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="peer absolute h-0 w-0 opacity-0" />
                <span className="h-5 w-9 rounded-full bg-muted transition peer-checked:bg-gradient-primary" />
                <span className="absolute left-0.5 h-4 w-4 rounded-full bg-foreground transition peer-checked:translate-x-4" />
              </span>
              Remember me
            </label>
            <Link to="/forgot-password" className="group inline-flex items-center gap-1 text-xs text-secondary">
              Forgot password?
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button type="submit" disabled={loading} className="relative w-full overflow-hidden rounded-lg bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01] disabled:opacity-60">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          Or continue with
          <span className="h-px flex-1 bg-border" />
        </div>

        <button type="button" onClick={() => toast("Web3 connect — wire MetaMask / WalletConnect here.", { icon: "🔌" })} className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium transition hover:bg-muted">
          <Wallet className="h-4 w-4" /> Connect Wallet
        </button>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-secondary hover:underline">Create one →</Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
