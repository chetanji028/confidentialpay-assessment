import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Link2,
  FileCheck,
  Zap,
  Wallet,
  Users,
  Rocket,
  DollarSign,
  Check,
  Copy,
  Star,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Lock,
  ArrowRight,
  Play,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

function CountUp({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "glass-strong shadow-elegant" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Lock className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Confidential<span className="text-gradient">Pay</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="rounded-full border border-border bg-card/40 px-5 py-2 text-sm font-medium transition-all hover:bg-card">
            Login
          </Link>
          <Link to="/signup" className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">
            Get Started <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-card/40 md:hidden" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="glass-strong border-t border-border md:hidden">
          <div className="space-y-3 px-6 py-5">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block text-sm text-muted-foreground">
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-3">
              <Link to="/login" className="flex-1 rounded-full border border-border px-4 py-2 text-center text-sm">
                Login
              </Link>
              <Link to="/signup" className="flex-1 rounded-full bg-gradient-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ParticleField() {
  const items = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 top-10 h-[520px] w-[520px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-secondary/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-accent/10 blur-[100px]" />
      {items.map((_, index) => {
        const left = (index * 73) % 100;
        const top = (index * 41) % 100;
        const delay = (index % 5) * 0.6;
        const size = 8 + ((index * 7) % 18);
        return (
          <div
            key={index}
            className="absolute rounded-md border border-white/10 bg-white/5 backdrop-blur-sm animate-float"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
              transform: `rotate(${index * 23}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 md:px-10 lg:px-8 lg:pt-40">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-16 lg:flex-row lg:items-center">
        <div className="max-w-2xl flex-1">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm text-muted-foreground backdrop-blur">
            <Shield className="h-4 w-4 text-secondary" /> Private payroll for modern finance teams
          </motion.div>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Payroll that stays <span className="text-gradient">private</span> on every chain.
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl">
            ConfidentialPay uses ZK + FHE to keep salary flows, treasury activity, and employee data protected while still allowing instant multi-chain settlement.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/signup" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.01]">
              Start building <ArrowRight className="h-4 w-4" />
            </Link>
            <button onClick={() => toast("Demo walkthrough — coming soon", { icon: "🎬" })} className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold transition hover:bg-card">
              <Play className="h-4 w-4" /> Watch demo
            </button>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-secondary" /> ZK + FHE secure</div>
            <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-secondary" /> Wallet-native</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4 text-secondary" /> Team ready</div>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="relative w-full max-w-xl flex-1">
          <div className="glass-strong relative overflow-hidden rounded-[32px] border border-border/70 p-6 shadow-elegant">
            <ParticleField />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Private treasury</p>
                  <p className="text-2xl font-semibold">$1.23M secured</p>
                </div>
                <div className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">Live</div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "BNB Payroll", value: "$452.3k", icon: DollarSign },
                  { label: "Cross-chain", value: "342 tx", icon: Link2 },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-border/70 bg-card/70 p-4">
                    <card.icon className="h-5 w-5 text-secondary" />
                    <p className="mt-3 text-2xl font-semibold">{card.value}</p>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-border/70 bg-background/70 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Employee payout workflow</span>
                  <span className="rounded-full bg-secondary/10 px-2 py-1 text-secondary">Encrypted</span>
                </div>
                <div className="mt-4 space-y-3">
                  {['Auto-approve', 'Private proof', 'Settlement complete'].map((step) => (
                    <div key={step} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-3 py-2.5 text-sm">
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-secondary/10 text-secondary"><Check className="h-4 w-4" /></div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="px-6 pb-16 md:px-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 rounded-3xl border border-border/80 bg-card/60 p-6 shadow-elegant md:grid-cols-4">
        {[
          { label: "Payroll processed", value: 1234567, prefix: "$", suffix: "+" },
          { label: "Active employees", value: 147, suffix: "+" },
          { label: "Cross-chain tx", value: 342, suffix: "+" },
          { label: "Privacy score", value: 96, suffix: "%" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-2xl font-semibold"><CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} /></p>
            <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-20 md:px-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-secondary" /> Built for privacy-first finance teams
          </div>
          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">Everything you need to pay globally without exposing sensitive data.</h2>
          <p className="mt-4 text-lg text-muted-foreground">From payroll execution to treasury ops, ConfidentialPay keeps each workflow encrypted and auditable.</p>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "Encrypted payroll", description: "Confidentially compute and distribute compensation across multiple chains.", icon: FileCheck },
            { title: "Treasury orchestration", description: "Bridge, hold, and settle assets without leaking sensitive balance data.", icon: Link2 },
            { title: "Compliance ready", description: "Generate auditable reports and preserve privacy with enterprise controls.", icon: Shield },
          ].map((feature) => (
            <Reveal key={feature.title} className="rounded-3xl border border-border/80 bg-card/60 p-6 shadow-elegant">
              <feature.icon className="h-8 w-8 text-secondary" />
              <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{feature.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowSection() {
  return (
    <section id="how" className="px-6 py-20 md:px-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-border/80 bg-card/60 p-8 shadow-elegant lg:p-12">
        <Reveal className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm text-muted-foreground">
            <Rocket className="h-4 w-4 text-secondary" /> How it works
          </div>
          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Simple to operate, powerful to scale.</h2>
          <p className="mt-4 text-lg text-muted-foreground">A privacy-first workflow that turns complex cross-chain finance into a workflow your team can trust.</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: "1. Connect", description: "Link treasury wallets and employees in minutes." },
            { title: "2. Protect", description: "Encrypt sensitive payroll and treasury data with ZK + FHE." },
            { title: "3. Execute", description: "Trigger settlement across chains with one secure action." },
          ].map((step) => (
            <div key={step.title} className="rounded-2xl border border-border/70 bg-background/70 p-5">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="px-6 py-20 md:px-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Pricing that scales with your operations.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Switch from fragmented workflows to a single private payroll platform.</p>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            { name: "Starter", price: "$99", features: ["Up to 25 employees", "BNB Chain", "Basic privacy controls"] },
            { name: "Pro", price: "$499", featured: true, features: ["Up to 250 employees", "All chains", "ZK + FHE privacy"] },
            { name: "Enterprise", price: "Custom", features: ["Unlimited", "SAML SSO", "Dedicated support"] },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-3xl border p-6 ${plan.featured ? "border-primary bg-gradient-mystic/30 ring-glow" : "border-border/80 bg-card/60"}`}>
              <p className="text-sm text-muted-foreground">{plan.name}</p>
              <p className="mt-3 text-4xl font-semibold">{plan.price}</p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary" /> {feature}</li>
                ))}
              </ul>
              <button className="mt-8 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Choose plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-20 md:px-10 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[32px] border border-border/80 bg-card/60 p-8 shadow-elegant lg:p-12">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">Trusted by finance teams moving fast.</h2>
          <p className="mt-4 text-lg text-muted-foreground">From startups to global operators, ConfidentialPay fits fast-moving organizations.</p>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { quote: "The privacy features are exactly what our payroll team needed.", name: "Mina Chen", role: "CFO, Northstar Labs" },
            { quote: "It replaced three tools and made treasury ops much more predictable.", name: "James Okafor", role: "Head of Finance, Helio" },
            { quote: "We deployed it in days and haven’t looked back.", name: "Lina Park", role: "Operations Lead, Flux" },
          ].map((item) => (
            <div key={item.name} className="rounded-2xl border border-border/70 bg-background/70 p-5">
              <div className="flex items-center gap-1 text-secondary">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">“{item.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/70 px-6 py-10 md:px-10 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">ConfidentialPay</p>
          <p className="mt-1 text-sm text-muted-foreground">Private payroll infrastructure for the multi-chain economy.</p>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <a href="#" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
          <a href="#" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
          <a href="#" className="hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
          <a href="#" className="hover:text-foreground"><Youtube className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}

export default function LandingSections() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
