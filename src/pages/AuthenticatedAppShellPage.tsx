import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Banknote,
  Users,
  Wallet,
  ShieldCheck,
  ArrowLeftRight,
  Settings as SettingsIcon,
  HelpCircle,
  Menu,
  Search,
  Bell,
  Copy,
  LogOut,
  Plus,
  Shield,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/auth";
import { truncAddr } from "@/lib/format";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/payroll", label: "Payroll", icon: Banknote },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/treasury", label: "Treasury", icon: Wallet },
  { to: "/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/bridge", label: "Bridge", icon: ArrowLeftRight },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

const DEMO_WALLET = "0x7f3eA4b21cD9f08B5a6c11E0B23F8a9D4cE7b210";

export default function AuthenticatedAppShellPage({ children }: { children?: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="flex min-h-screen">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-transform lg:relative lg:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">ConfidentialPay</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">BNB Chain</p>
          </div>
        </div>

        <nav className="space-y-1 p-3">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4 transition group-hover:translate-x-0.5" />
                {item.label}
                {active && <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/70" />}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute inset-x-3 bottom-3 space-y-2">
          <NavLink
            to="/settings"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-sidebar-accent"
          >
            <HelpCircle className="h-4 w-4" /> Help & Support
          </NavLink>
          <div className="glass rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                {(user?.name ?? "A")[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium">{user?.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="rounded p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6">
          <button
            className="rounded-lg p-2 hover:bg-muted lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search employees, transactions…"
              className="w-full rounded-lg border border-border bg-input/40 py-2 pl-10 pr-12 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </div>

          <div className="flex-1 md:hidden" />

          <div className="hidden items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="font-medium" style={{ color: "var(--chain-bnb)" }}>BNB Chain</span>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(DEMO_WALLET);
              toast.success("Address copied");
            }}
            className="hidden items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs font-mono hover:bg-muted md:flex"
          >
            {truncAddr(DEMO_WALLET)}
            <Copy className="h-3 w-3" />
          </button>

          <button className="relative rounded-lg p-2 hover:bg-muted" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-glow-pulse rounded-full bg-accent" />
          </button>

          <button
            onClick={() => toast("Quick actions menu")}
            className="hidden items-center gap-1 rounded-lg bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow sm:flex"
          >
            <Plus className="h-4 w-4" /> New
          </button>

          <div className="relative">
            <button
              onClick={() => setUserMenu((s) => !s)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-2 py-1.5 hover:bg-muted"
            >
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                {(user?.name ?? "A")[0]}
              </div>
              <ChevronDown className="hidden h-3 w-3 sm:block" />
            </button>
            {userMenu && (
              <div
                onMouseLeave={() => setUserMenu(false)}
                className="glass-strong absolute right-0 mt-2 w-56 rounded-xl border border-border p-1 shadow-elegant"
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <NavLink
                  to="/settings"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  <SettingsIcon className="h-4 w-4" /> Settings
                </NavLink>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
}
