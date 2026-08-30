import React from "react";
import { motion } from "framer-motion";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import KpiCard from "@/components/ui/KpiCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { governanceMetrics } from "@/lib/mockData";

export default function Governance() {
  const numericMetrics = governanceMetrics.filter((m) => !m.isText);
  const textMetrics = governanceMetrics.filter((m) => m.isText);

  return (
    <div>
      <PageHeader
        title="Responsible AI Governance Center"
        subtitle="Real-time monitoring of transparency, privacy, fairness, security, and explainability across all AI decisions."
        icon="ShieldCheck"
        badges
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {governanceMetrics.map((metric, i) => (
          <KpiCard key={metric.label} {...metric} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial gauges */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-1">Governance Score Breakdown</h3>
            <p className="text-xs text-muted-foreground mb-6">Live AI governance metrics across six core dimensions</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {numericMetrics.map((metric, i) => (
                <RadialGauge key={metric.label} metric={metric} index={i} />
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Status panel */}
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              {textMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Icon name={metric.icon} className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                  </div>
                  <span className="trust-badge bg-success/10 text-success">{metric.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-success/5 border border-success/10">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="CheckCircle2" className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">All Systems Operational</span>
              </div>
              <p className="text-xs text-muted-foreground">No bias detected. AI risk is within acceptable thresholds. All decisions are audit-ready.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4">Compliance Frameworks</h3>
            <div className="space-y-2">
              {["AI Governance Framework", "Model AI Governance", "PDPA Compliance", "Data Minimization", "Auditability Standard"].map((framework) => (
                <div key={framework} className="flex items-center gap-2 text-sm">
                  <Icon name="Check" className="w-4 h-4 text-success shrink-0" strokeWidth={2.5} />
                  <span className="text-foreground">{framework}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Governance principles */}
      <div className="mt-8">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-4">Responsible AI Principles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Transparency", desc: "Every decision is explainable and traceable to its source policy.", icon: "Eye" },
              { title: "Accountability", desc: "Clear ownership of AI decisions with human oversight available.", icon: "Scale" },
              { title: "Fairness", desc: "Bias monitoring ensures equitable treatment across all citizens.", icon: "ShieldCheck" },
              { title: "Privacy", desc: "Data minimization and consent-based access protect citizen data.", icon: "Lock" },
            ].map((principle) => (
              <div key={principle.title} className="p-4 rounded-xl bg-slate-50">
                <Icon name={principle.icon} className="w-5 h-5 text-primary mb-2" />
                <div className="font-medium text-sm text-foreground">{principle.title}</div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{principle.desc}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function RadialGauge({ metric, index }) {
  const data = [{ name: metric.label, value: metric.value, fill: "hsl(var(--primary))" }];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="flex flex-col items-center"
    >
      <div className="relative w-full h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: "hsl(var(--muted))" }} dataKey="value" cornerRadius={10} angleAxisId={0} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">{metric.value}%</span>
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center mt-1">{metric.label}</div>
    </motion.div>
  );
}