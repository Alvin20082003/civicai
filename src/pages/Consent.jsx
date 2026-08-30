import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import { consentItems } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Consent() {
  const [items, setItems] = useState(consentItems);

  const toggle = (id) => {
    setItems((prev) => prev.map((item) =>
      item.id === id
        ? {
            ...item,
            granted: !item.granted,
            access: !item.granted ? "Access Granted" : "No Access",
            purpose: !item.granted ? item.purpose === "—" ? "General Verification" : item.purpose : "—",
            expiry: !item.granted ? "30 Days" : "—",
          }
        : item
    ));
  };

  const grantedCount = items.filter((i) => i.granted).length;

  return (
    <div>
      <PageHeader
        title="Consent Management"
        subtitle="Control which government services can access your personal data. Every permission is purpose-bound and time-limited."
        icon="KeyRound"
        badges
      />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Icon name="CheckCircle2" className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{grantedCount}</div>
              <div className="text-xs text-muted-foreground">Access Granted</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Icon name="Lock" className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{items.length - grantedCount}</div>
              <div className="text-xs text-muted-foreground">Access Restricted</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <Icon name="ShieldCheck" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground">Privacy Protected</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Consent list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <GlassCard className={cn("p-5 transition-all", item.granted ? "border-primary/20" : "")}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                  item.granted ? "bg-primary/5" : "bg-slate-100"
                )}>
                  <Icon name={item.icon} className={cn("w-5 h-5", item.granted ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                    <ToggleSwitch checked={item.granted} onChange={() => toggle(item.id)} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <ConsentField label="Access" value={item.access} granted={item.granted} />
                    <ConsentField label="Purpose" value={item.purpose} />
                    <ConsentField label="Expiry" value={item.expiry} />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Privacy notice */}
      <GlassCard className="mt-6 p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <Icon name="ShieldCheck" className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Privacy by Design</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              All data access is governed by the principle of data minimization. Permissions are purpose-bound, time-limited, and revocable at any time. Government services only receive the minimum data necessary to process your request.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ConsentField({ label, value, granted }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className={cn(
        "text-xs font-medium mt-0.5",
        value === "No Access" ? "text-muted-foreground" : granted ? "text-foreground" : "text-muted-foreground"
      )}>{value}</div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0",
        checked ? "bg-primary" : "bg-slate-200"
      )}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md",
          checked ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
}