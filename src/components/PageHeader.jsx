import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import TrustBadges from "@/components/TrustBadges";

export default function PageHeader({ title, subtitle, icon, badges = false, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Icon name={icon} className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
          )}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
      {badges && <TrustBadges className="mt-4" />}
    </motion.div>
  );
}