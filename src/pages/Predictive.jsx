import React from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import { predictiveData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function Predictive() {
  return (
    <div>
      <PageHeader
        title="Predictive Governance"
        subtitle="Enterprise analytics forecasting service demand, citizen trends, department workload, and application bottlenecks."
        icon="LineChart"
        badges
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Predicted Demand (Aug)", value: "6,450", change: "+11%", icon: "TrendingUp", accent: "primary" },
          { label: "Welfare Uptake (YTD)", value: "2,510", change: "+38%", icon: "Users", accent: "accent" },
          { label: "Avg. Processing Time", value: "63.4h", change: "-12%", icon: "Clock", accent: "success" },
          { label: "Document Rejection", value: "4.8%", change: "-3.4%", icon: "FileQuestion", accent: "warning" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center",
                  kpi.accent === "primary" && "bg-primary/5 text-primary",
                  kpi.accent === "accent" && "bg-accent/10 text-accent",
                  kpi.accent === "success" && "bg-success/10 text-success",
                  kpi.accent === "warning" && "bg-warning/10 text-warning",
                )}>
                  <Icon name={kpi.icon} className="w-5 h-5" />
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  kpi.change.startsWith("+") ? "text-success" : "text-success"
                )}>{kpi.change}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scholarship Demand */}
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Scholarship Demand Forecast</h3>
            <p className="text-xs text-muted-foreground">Current vs. AI-predicted demand</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictiveData.scholarshipDemand} margin={{ left: -16, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="current" name="Current" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#gradCurrent)" />
                <Area type="monotone" dataKey="predicted" name="Predicted" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" fill="url(#gradPredicted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Welfare Uptake */}
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Welfare Uptake Trend</h3>
            <p className="text-xs text-muted-foreground">Monthly welfare scheme enrollments</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictiveData.welfareUptake} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} />
                <Line type="monotone" dataKey="value" name="Enrollments" stroke="hsl(var(--chart-3))" strokeWidth={2.5} dot={{ fill: "hsl(var(--chart-3))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Department Workload */}
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Department Workload</h3>
            <p className="text-xs text-muted-foreground">Current load vs. capacity by department</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictiveData.departmentWorkload} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="current" name="Current Load" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" name="Capacity" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} opacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Service Trends */}
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Citizen Service Trends</h3>
            <p className="text-xs text-muted-foreground">Distribution of service inquiries</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={predictiveData.serviceTrends}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {predictiveData.serviceTrends.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Application Bottlenecks */}
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Application Bottlenecks</h3>
            <p className="text-xs text-muted-foreground">Average delay (hours) by processing stage</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={predictiveData.bottlenecks} layout="vertical" margin={{ left: 20, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" width={100} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} formatter={(v) => [`${v}h`, "Delay"]} />
                <Bar dataKey="delay" radius={[0, 6, 6, 0]}>
                  {predictiveData.bottlenecks.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Document Rejection Trends */}
        <GlassCard className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold">Document Rejection Trends</h3>
            <p className="text-xs text-muted-foreground">Rejection rate (%) over 7 months</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictiveData.rejectionTrends} margin={{ left: -16, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: "12px" }} formatter={(v) => [`${v}%`, "Rejection Rate"]} />
                <Line type="monotone" dataKey="rate" name="Rejection Rate" stroke="hsl(var(--chart-5))" strokeWidth={2.5} dot={{ fill: "hsl(var(--chart-5))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}