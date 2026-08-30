import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export default function KpiCard({ label, value, suffix = "", icon, trend, isText = false, index = 0, accent = "primary" }) {
  const accentMap = {
    primary: "from-blue-500/10 to-blue-600/5 text-primary",
    accent: "from-teal-500/10 to-teal-600/5 text-accent",
    success: "from-emerald-500/10 to-emerald-600/5 text-success",
    warning: "from-amber-500/10 to-amber-600/5 text-warning",
  };
  const iconBg = accentMap[accent] || accentMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_8px_32px_rgba(0,82,204,0.08)] hover:border-primary/20 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", iconBg)}>
          <Icon name={icon} className="w-5 h-5" />
        </div>
        {trend === "up" && !isText && (
          <span className="text-xs font-medium text-success flex items-center gap-0.5">
            <Icon name="TrendingUp" className="w-3 h-3" /> Optimal
          </span>
        )}
        {isText && (
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            value === "None" && "bg-success/10 text-success",
            value === "Low" && "bg-success/10 text-success",
          )}>
            Stable
          </span>
        )}
      </div>
      <div className="text-3xl font-bold tracking-tight text-foreground">
        {value}{!isText && suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}