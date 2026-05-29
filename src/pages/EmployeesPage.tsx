import { useApiData } from "@/lib/useApiData";
import { motion } from "framer-motion";
import { Search, Plus, Mail, Phone, Shield, Briefcase, MoreHorizontal, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { fmtUSD, truncAddr } from "@/lib/format";
import { GlassCard, PageHeader, StatusBadge } from "@/components/layout/Primitives";

export default function EmployeesPage() {
  const { data } = useApiData<any[]>("/api/employees", (payload) => payload.items ?? []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Manage payroll recipients, wallet addresses, and compliance status."
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" /> Add Employee
          </button>
        }
      />

      <GlassCard>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search employees"
              className="w-full rounded-lg border border-border bg-input/40 py-2 pl-10 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">All Teams</button>
            <button className="rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">Active</button>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {(data ?? []).map((employee: any) => (
            <motion.div key={employee.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card/40 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
                    {employee.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold">{employee.name}</h4>
                    <p className="text-xs text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <button className="rounded-lg border border-border bg-card/40 p-2">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-background/40 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </div>
                  <p className="mt-1 text-sm font-medium">{employee.email}</p>
                </div>
                <div className="rounded-xl border border-border bg-background/40 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> Wallet
                  </div>
                  <p className="mt-1 text-sm font-medium">{truncAddr(employee.wallet)}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={employee.status} />
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2.5 py-1 text-[11px] text-muted-foreground">
                  <Briefcase className="h-3 w-3" /> {employee.department}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2.5 py-1 text-[11px] text-muted-foreground">
                  <Shield className="h-3 w-3" /> {employee.kyc ? "KYC Verified" : "Pending"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background/40 p-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Salary</p>
                  <p className="text-lg font-semibold">{fmtUSD(employee.salary)}</p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-card/40 px-3 py-1.5 text-sm">
                  <Sparkles className="h-3.5 w-3.5" /> View
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
