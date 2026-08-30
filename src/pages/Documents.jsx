import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { useI18n } from "@/lib/i18n";
import { documentWallet } from "@/lib/indiaData";
import { cn } from "@/lib/utils";

function getDocStatus(doc) {
  if (doc.missing) return { status: "missing", color: "destructive", bg: "bg-destructive/5", text: "text-destructive", icon: "AlertCircle", label: "Missing" };
  if (!doc.verified) return { status: "unverified", color: "warning", bg: "bg-warning/5", text: "text-warning", icon: "AlertCircle", label: "Unverified" };
  if (doc.expiry) {
    const expiryDate = new Date(doc.expiry);
    const now = new Date("2026-07-09");
    const monthsUntilExpiry = (expiryDate - now) / (1000 * 60 * 60 * 24 * 30);
    if (monthsUntilExpiry < 0) return { status: "expired", color: "destructive", bg: "bg-destructive/5", text: "text-destructive", icon: "AlertTriangle", label: "Expired" };
    if (monthsUntilExpiry < 2) return { status: "expiring", color: "warning", bg: "bg-warning/5", text: "text-warning", icon: "Clock", label: "Expiring Soon" };
  }
  return { status: "valid", color: "success", bg: "bg-success/5", text: "text-success", icon: "CheckCircle2", label: "Valid" };
}

const docTypeConfig = {
  Identity: { icon: "IdCard", color: "#0052CC" },
  Financial: { icon: "Wallet", color: "#0D9488" },
  Welfare: { icon: "FileBadge", color: "#7C3AED" },
  Education: { icon: "GraduationCap", color: "#0891B2" },
  Property: { icon: "House", color: "#EA580C" },
};

export default function Documents() {
  const { t } = useI18n();
  const [filter, setFilter] = useState("All");

  const docs = useMemo(() => {
    return documentWallet.map((doc) => ({ ...doc, statusInfo: getDocStatus(doc) }));
  }, []);

  const stats = useMemo(() => {
    const valid = docs.filter((d) => d.statusInfo.status === "valid").length;
    const expiring = docs.filter((d) => d.statusInfo.status === "expiring").length;
    const expired = docs.filter((d) => d.statusInfo.status === "expired").length;
    const missing = docs.filter((d) => d.statusInfo.status === "missing").length;
    return { valid, expiring, expired, missing, total: docs.length };
  }, [docs]);

  const filteredDocs = useMemo(() => {
    if (filter === "All") return docs;
    if (filter === "Issues") return docs.filter((d) => d.statusInfo.status !== "valid");
    return docs.filter((d) => d.statusInfo.status === filter);
  }, [docs, filter]);

  return (
    <div>
      <PageHeader
        title="Smart Document Vault"
        subtitle="DigiLocker-integrated digital vault with automatic expiry detection, missing document alerts, and verification status"
        icon="FileCheck"
        badges
      >
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/5 border border-success/10">
          <Icon name="ShieldCheck" className="w-3.5 h-3.5 text-success" />
          <span className="text-xs font-medium text-success">DigiLocker Secure</span>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="CheckCircle2" label="Valid Documents" value={stats.valid} color="success" />
        <StatCard icon="Clock" label="Expiring Soon" value={stats.expiring} color="warning" />
        <StatCard icon="AlertTriangle" label="Expired" value={stats.expired} color="destructive" />
        <StatCard icon="AlertCircle" label="Missing" value={stats.missing} color="destructive" />
      </div>

      {/* Proactive alerts */}
      {(stats.expiring > 0 || stats.expired > 0 || stats.missing > 0) && (
        <GlassCard className="p-4 mb-6 border-warning/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
              <Icon name="Lightbulb" className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Proactive AI Alert</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.expired > 0 && `${stats.expired} document(s) have expired. `}
                {stats.expiring > 0 && `${stats.expiring} document(s) expiring within 60 days. `}
                {stats.missing > 0 && `${stats.missing} required document(s) missing.`}
                {" "}Upload or renew these to keep your benefit applications active.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        {["All", "valid", "expiring", "expired", "missing", "Issues"].map((f) => {
          const count = f === "All" ? docs.length : f === "Issues" ? docs.filter((d) => d.statusInfo.status !== "valid").length : docs.filter((d) => d.statusInfo.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors capitalize",
                filter === f ? "bg-primary text-primary-foreground" : "bg-slate-100 text-muted-foreground hover:bg-slate-200"
              )}
            >
              {f === "All" ? "All Documents" : f === "Issues" ? "Needs Attention" : f} ({count})
            </button>
          );
        })}
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc, i) => {
          const typeConfig = docTypeConfig[doc.type] || docTypeConfig.Identity;
          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <GlassCard className={cn("p-4 h-full", doc.statusInfo.bg)}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${typeConfig.color}15` }}
                  >
                    <Icon name={doc.icon} className="w-5 h-5" style={{ color: typeConfig.color }} />
                  </div>
                  <span className={cn("trust-badge text-[10px]", doc.statusInfo.bg, doc.statusInfo.text, "border border-current/10")}>
                    <Icon name={doc.statusInfo.icon} className="w-3 h-3" strokeWidth={2.5} /> {doc.statusInfo.label}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-foreground">{doc.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">{doc.number}</p>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground">{doc.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Verified</span>
                    <span className={cn("font-medium", doc.verified ? "text-success" : "text-warning")}>
                      {doc.verified ? "Yes" : "Pending"}
                    </span>
                  </div>
                  {doc.expiry && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Expires</span>
                      <span className={cn("font-medium", doc.statusInfo.text)}>
                        {new Date(doc.expiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                  {doc.missing ? (
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
                      <Icon name="Plus" className="w-3 h-3" /> Upload Now
                    </button>
                  ) : doc.statusInfo.status === "expired" || doc.statusInfo.status === "expiring" ? (
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning text-white text-xs font-medium hover:opacity-90">
                      <Icon name="RefreshCw" className="w-3 h-3" /> Renew
                    </button>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-foreground text-xs font-medium hover:bg-slate-200">
                      <Icon name="Download" className="w-3 h-3" /> Download
                    </button>
                  )}
                  <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-muted-foreground hover:bg-slate-200">
                    <Icon name="ExternalLink" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6">
        <TrustBadges />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", `bg-${color}/10`)}>
          <Icon name={icon} className={cn("w-5 h-5", `text-${color}`)} />
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </div>
      </div>
    </GlassCard>
  );
}