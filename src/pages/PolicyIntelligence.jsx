import React from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import { policyUpdates } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const impactData = [
  { month: "Apr", affected: 8200, beneficiaries: 1800 },
  { month: "May", affected: 9500, beneficiaries: 2300 },
  { month: "Jun", affected: 10800, beneficiaries: 2900 },
  { month: "Jul", affected: 12430, beneficiaries: 3420 },
];

export default function PolicyIntelligence() {
  return (
    <div>
      <PageHeader
        title="Policy Intelligence"
        subtitle="Real-time monitoring of government policy changes with automatic impact analysis on affected citizens and services."
        icon="TrendingUp"
        badges
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Active Policy Updates", value: policyUpdates.length, icon: "FileClock", accent: "primary" },
          { label: "Citizens Affected", value: "36,390", icon: "Users", accent: "accent" },
          { label: "New Beneficiaries", value: "10,930", icon: "UserCheck", accent: "success" },
          { label: "Auto-Actions Triggered", value: "3", icon: "Zap", accent: "warning" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <GlassCard className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  stat.accent === "primary" && "bg-primary/5 text-primary",
                  stat.accent === "accent" && "bg-accent/10 text-accent",
                  stat.accent === "success" && "bg-success/10 text-success",
                  stat.accent === "warning" && "bg-warning/10 text-warning",
                )}>
                  <Icon name={stat.icon} className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Impact chart */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Policy Impact Trend</h3>
            <p className="text-xs text-muted-foreground">Citizens affected and new beneficiaries over time</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" /> Affected Citizens</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent" /> New Beneficiaries</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={impactData} margin={{ left: -16, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gradAffected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradBeneficiaries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="affected" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gradAffected)" />
              <Area type="monotone" dataKey="beneficiaries" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#gradBeneficiaries)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Policy update cards */}
      <div className="space-y-4">
        <h3 className="font-semibold text-muted-foreground px-1">Latest Government Policy Updates</h3>
        {policyUpdates.map((policy, i) => (
          <motion.div
            key={policy.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  policy.severity === "high" && "bg-destructive/10",
                  policy.severity === "medium" && "bg-warning/10",
                  policy.severity === "low" && "bg-success/10",
                )}>
                  <Icon name="ScrollText" className={cn(
                    "w-6 h-6",
                    policy.severity === "high" && "text-destructive",
                    policy.severity === "medium" && "text-warning",
                    policy.severity === "low" && "text-success",
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h4 className="font-semibold text-foreground">{policy.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Icon name="Building2" className="w-3.5 h-3.5" />
                        {policy.department}
                        <span>•</span>
                        <Icon name="Calendar" className="w-3.5 h-3.5" />
                        {policy.date}
                      </div>
                    </div>
                    <span className={cn(
                      "trust-badge",
                      policy.severity === "high" && "bg-destructive/10 text-destructive",
                      policy.severity === "medium" && "bg-warning/10 text-warning",
                      policy.severity === "low" && "bg-success/10 text-success",
                    )}>{policy.severity} impact</span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{policy.summary}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    <div className="p-3 rounded-xl bg-slate-50">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Affected Citizens</div>
                      <div className="text-lg font-bold text-foreground">{policy.affectedCitizens.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Potential New Beneficiaries</div>
                      <div className="text-lg font-bold text-success">{policy.newBeneficiaries.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-primary/5">
                      <div className="text-[10px] text-primary uppercase tracking-wide">AI Recommendation</div>
                      <div className="text-sm font-semibold text-primary flex items-center gap-1.5 mt-0.5">
                        <Icon name="Zap" className="w-3.5 h-3.5" />
                        {policy.recommendation}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-medium hover:shadow-lg transition-all">
                      Execute Recommendation
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}