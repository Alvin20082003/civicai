import React from "react";
import { cn } from "@/lib/utils";

export default function GlassCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}