import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import { decisionLog } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function DecisionLog() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = decisionLog.filter((d) => {
    const matchesFilter = filter === "All" || (filter === "Review" && d.status === "Review") || (filter === "Logged" && d.status === "Logged");
    const matchesSearch = d.decision.toLowerCase().includes(search.toLowerCase()) || d.policy.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="AI Decision Log"
        subtitle="Enterprise-grade audit trail of every AI-assisted decision. Fully filterable, sortable, and compliance-ready."
        icon="FileClock"
        badges
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Decisions", value: "12,847", icon: "FileClock", accent: "primary" },
          { label: "Logged & Audited", value: "12,816", icon: "CheckCircle2", accent: "success" },
          { label: "Under Human Review", value: "31", icon: "UserCheck", accent: "warning" },
          { label: "Avg. Confidence", value: "94.2%", icon: "Sparkles", accent: "accent" },
        ].map((stat, i) => (
          <GlassCard key={stat.label} className="p-5">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                stat.accent === "primary" && "bg-primary/5 text-primary",
                stat.accent === "success" && "bg-success/10 text-success",
                stat.accent === "warning" && "bg-warning/10 text-warning",
                stat.accent === "accent" && "bg-accent/10 text-accent",
              )}>
                <Icon name={stat.icon} className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex gap-2">
            {["All", "Logged", "Review"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  filter === f ? "bg-primary text-primary-foreground" : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 sm:max-w-xs">
            <Icon name="Search" className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search decisions or policies..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
            />
          </div>
        </div>
      </GlassCard>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Decision</th>
                <th className="px-4 py-3 font-semibold">Policy Used</th>
                <th className="px-4 py-3 font-semibold">Confidence</th>
                <th className="px-4 py-3 font-semibold">Documents Used</th>
                <th className="px-4 py-3 font-semibold">Human Review</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{entry.time}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{entry.decision}</td>
                  <td className="px-4 py-3">
                    <code className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded">{entry.policy}</code>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            entry.confidence >= 90 ? "bg-success" : entry.confidence >= 75 ? "bg-primary" : "bg-warning"
                          )}
                          style={{ width: `${entry.confidence}%` }}
                        />
                      </div>
                      <span className="font-medium text-foreground">{entry.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{entry.documents}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      entry.humanReview === "Escalated" && "bg-warning/10 text-warning",
                      entry.humanReview === "Available" && "bg-primary/10 text-primary",
                      entry.humanReview === "Not Required" && "bg-slate-100 text-muted-foreground",
                    )}>
                      {entry.humanReview}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "trust-badge",
                      entry.status === "Logged" && "bg-success/10 text-success",
                      entry.status === "Review" && "bg-warning/10 text-warning",
                    )}>
                      {entry.status === "Logged" && <Icon name="Check" className="w-3 h-3" strokeWidth={2.5} />}
                      {entry.status === "Review" && <Icon name="Clock" className="w-3 h-3" />}
                      {entry.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-muted-foreground text-sm">
            <Icon name="FileClock" className="w-8 h-8 mx-auto mb-2 opacity-40" />
            No decisions match your filters.
          </div>
        )}
      </GlassCard>
    </div>
  );
}