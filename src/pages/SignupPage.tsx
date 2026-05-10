import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Shield, Wallet, Building2, User as UserIcon, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";

const STEPS = [
  { key: "company", title: "Company", icon: Building2 },
  { key: "admin", title: "Admin", icon: UserIcon },
  { key: "wallet", title: "Wallet", icon: Wallet },
  { key: "plan", title: "Plan", icon: Sparkles },
];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function finish() {
    const ok = await login("admin@confidentialpay.com", "00000");
    if (ok) {
      toast.success("Account created — welcome aboard!");
      navigate("/dashboard");
    } else {
      toast.error("Could not complete signup. Try the demo login.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">ConfidentialPay</span>
        </div>

        <div className="mb-8 flex items-center justify-between">
          {STEPS.map((item, index) => {
            const active = index === step;
            const done = index < step;
            return (
              <div key={item.key} className="flex flex-1 items-center last:flex-none">
                <div className={`grid h-10 w-10 place-items-center rounded-full border-2 transition ${done ? "border-secondary bg-secondary/20 text-secondary" : active ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow" : "border-border bg-card text-muted-foreground"}`}>
                  {done ? <Check className="h-5 w-5" /> : <item.icon className="h-5 w-5" />}
                </div>
                {index < STEPS.length - 1 && <div className={`mx-2 h-0.5 flex-1 ${index < step ? "bg-secondary" : "bg-border"}`} />}
              </div>
            );
          })}
        </div>

        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-8 shadow-elegant">
          <h2 className="text-2xl font-semibold">{STEPS[step].title} Setup</h2>
          <p className="mt-1 text-sm text-muted-foreground">Step {step + 1} of {STEPS.length}</p>

          <div className="mt-6 space-y-3">
            {step === 0 && (
              <>
                <Field label="Company name" placeholder="Acme Inc" />
                <Field label="Website" placeholder="https://acme.com" />
                <Field label="Team size" placeholder="11–50" />
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Full name" placeholder="Jane Doe" />
                <Field label="Work email" placeholder="jane@acme.com" />
                <Field label="Password" type="password" placeholder="••••••••" />
              </>
            )}
            {step === 2 && (
              <div className="rounded-xl border border-border bg-card/40 p-6 text-center">
                <Wallet className="mx-auto h-10 w-10 text-secondary" />
                <p className="mt-3 text-sm">Connect your treasury wallet (MetaMask or WalletConnect).</p>
                <button className="mt-4 rounded-lg bg-gradient-primary px-5 py-2 text-sm font-medium text-primary-foreground">
                  Connect Wallet
                </button>
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { name: "Starter", price: "$99", features: ["Up to 25 employees", "BNB Chain"] },
                  { name: "Pro", price: "$499", features: ["Up to 250 employees", "All chains", "ZK + FHE"], featured: true },
                  { name: "Enterprise", price: "Custom", features: ["Unlimited", "SAML SSO", "Dedicated CSM"] },
                ].map((plan) => (
                  <div key={plan.name} className={`rounded-xl border p-4 ${plan.featured ? "border-primary bg-gradient-mystic/30 ring-glow" : "border-border bg-card/40"}`}>
                    <p className="text-sm text-muted-foreground">{plan.name}</p>
                    <p className="mt-1 text-2xl font-bold">{plan.price}</p>
                    <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-secondary" /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button onClick={() => (step === 0 ? navigate("/login") : setStep(step - 1))} className="text-sm text-muted-foreground hover:text-foreground">
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="inline-flex items-center gap-1 rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={finish} className="rounded-lg bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow">
                Finish & Enter Dashboard
              </button>
            )}
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account? <Link to="/login" className="text-secondary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <input {...rest} className="w-full rounded-lg border border-border bg-input/40 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30" />
    </div>
  );
}
