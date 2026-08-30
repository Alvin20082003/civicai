import React from "react";
import Icon from "@/components/ui/Icon";
import { trustBadges } from "@/lib/indiaData";
import { cn } from "@/lib/utils";

export default function TrustBadges({ className, compact = false }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {trustBadges.map((badge) => (
        <span
          key={badge.label}
          className={cn(
            "trust-badge bg-primary/5 text-primary border border-primary/10",
            compact && "text-[10px] px-2 py-0.5"
          )}
        >
          <Icon name={badge.icon} className={compact ? "w-3 h-3" : "w-3.5 h-3.5"} strokeWidth={2.5} />
          {badge.label}
        </span>
      ))}
    </div>
  );
}