import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import { riskAlerts, riskIssues } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Risk() {
  const [resolved, setResolved] = useState([]);

  const handleResolve = (id) => {
    if (!resolved.includes(id)) {
      setResolved([...resolved, id]);
    }
  };

  const activeIssues = riskIssues.filter((i) => !resolved.includes(i.id));
  const totalCases = activeIssues.reduce((s, i) => s + i.count, 0);
  const resolvedCount = riskIssues.length - activeIssues.length;

  return (
    <div>
      <PageHeader
        title="AI Risk Dashboard"
        subtitle="Real-time monitoring of AI risk levels, document issues, policy conflicts, fraud alerts, and human escalation queues."
        icon="ShieldAlert"
        badges
      />

      {/* Risk level cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {riskAlerts.map((alert, i) => (
          <motion.div
            key={alert.category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <GlassCard className={cn("p-6 relative overflow-hidden")}>
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1",
                alert.color === "success" && "bg-success",
                alert.color === "warning" && "bg-warning",
                alert.color === "destructive" && "bg-destructive",
              )} />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">{alert.category}</div>
                  <div className={cn(
                    "text-4xl font-bold mt-1",
                    alert.color === "success" && "text-success",
                    alert.color === "warning" && "text-warning",
                    alert.color === "destructive" && "text-destructive",
                  )}>{alert.count.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">{alert.desc}</div>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  alert.color === "success" && "bg-success/10",
                  alert.color === "warning" && "bg-warning/10",
                  alert.color === "destructive" && "bg-destructive/10",
                )}>
                  <Icon
                    name={alert.color === "success" ? "CheckCircle2" : alert.color === "warning" ? "AlertTriangle" : "ShieldAlert"}
                    className={cn(
                      "w-6 h-6",
                      alert.color === "success" && "text-success",
                      alert.color === "warning" && "text-warning",
                      alert.color === "destructive" && "text-destructive",
                    )}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue queue */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Active Issues & Alerts</h3>
              <span className="text-xs text-muted-foreground">
                {totalCases} total{resolvedCount > 0 && <span className="text-success ml-2">· {resolvedCount} resolved</span>}
              </span>
            </div>
            <div className="space-y-3">
              {riskIssues.map((issue, i) => {
                const isResolved = resolved.includes(issue.id);
                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: isResolved ? 0.5 : 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                      isResolved ? "border-success/20 bg-success/5" : "border-slate-100 hover:border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      isResolved
                        ? "bg-success/10"
                        : issue.severity === "destructive" ? "bg-destructive/10" : "bg-warning/10"
                    )}>
                      <Icon
                        name={isResolved ? "CheckCircle2" : issue.icon}
                        className={cn(
                          "w-5 h-5",
                          isResolved
                            ? "text-success"
                            : issue.severity === "destructive" ? "text-destructive" : "text-warning"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-medium text-foreground", isResolved && "line-through")}>{issue.title}</span>
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full",
                          isResolved
                            ? "bg-success/10 text-success"
                            : issue.severity === "destructive" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                        )}>
                          {isResolved ? "resolved" : issue.severity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{issue.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn(
                        "text-xl font-bold",
                        isResolved
                          ? "text-success"
                          : issue.severity === "destructive" ? "text-destructive" : "text-warning"
                      )}>{isResolved ? 0 : issue.count}</div>
                      <div className="text-[10px] text-muted-foreground">{isResolved ? "resolved" : "cases"}</div>
                    </div>
                    {isResolved ? (
                      <span className="text-xs font-medium text-success flex items-center gap-1 shrink-0">
                        <Icon name="CheckCircle2" className="w-3.5 h-3.5" /> Resolved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleResolve(issue.id)}
                        className="text-xs font-medium text-primary hover:underline shrink-0"
                      >
                        Resolve
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Risk distribution chart */}
        <div>
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Risk Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeIssues} layout="vertical" margin={{ left: 0, right: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="title" width={80} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {activeIssues.map((entry, i) => (
                      <Cell key={i} fill={entry.severity === "destructive" ? "hsl(var(--destructive))" : "hsl(var(--warning))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="mt-6 p-6">
            <h3 className="font-semibold mb-4">Risk Mitigation</h3>
            <div className="space-y-2">
              {[
                "Automatic escalation for high-risk decisions",
                "Human-in-the-loop verification for edge cases",
                "Real-time bias detection and alerts",
                "Policy conflict resolution engine",
                "Fraud pattern anomaly detection",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <Icon name="Check" className="w-4 h-4 text-success shrink-0" strokeWidth={2.5} />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}