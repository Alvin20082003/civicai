import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import TrustBadges from "@/components/TrustBadges";
import { cn } from "@/lib/utils";

const categoryColors = {
  Education: "bg-blue-50 text-blue-600 border-blue-100",
  Agriculture: "bg-green-50 text-green-600 border-green-100",
  Healthcare: "bg-teal-50 text-teal-600 border-teal-100",
  Housing: "bg-amber-50 text-amber-600 border-amber-100",
  Welfare: "bg-purple-50 text-purple-600 border-purple-100",
  Business: "bg-indigo-50 text-indigo-600 border-indigo-100",
  Employment: "bg-cyan-50 text-cyan-600 border-cyan-100",
};

const statusConfig = {
  Eligible: { icon: "CheckCircle2", color: "text-success", bg: "bg-success/5", label: "Eligible" },
  "Conditionally Eligible": { icon: "AlertCircle", color: "text-warning", bg: "bg-warning/5", label: "Conditional" },
  "Not Eligible": { icon: "X", color: "text-destructive", bg: "bg-destructive/5", label: "Not Eligible" },
  "Check Eligibility": { icon: "FileQuestion", color: "text-primary", bg: "bg-primary/5", label: "Check" },
};

export default function SchemeCard({ scheme, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[scheme.eligibility_status] || statusConfig["Check Eligibility"];
  const catColor = categoryColors[scheme.category] || "bg-slate-50 text-slate-600 border-slate-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm"
    >
      {/* Header */}
      <div className={cn("p-4 flex items-start justify-between gap-3", status.bg)}>
        <div className="flex items-start gap-3 min-w-0">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", status.bg)}>
            <Icon name={status.icon} className={cn("w-5 h-5", status.color)} />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-foreground text-sm leading-tight">{scheme.scheme_name}</h4>
            {scheme.scheme_name_local && scheme.scheme_name_local !== scheme.scheme_name && (
              <p className="text-xs text-muted-foreground mt-0.5">{scheme.scheme_name_local}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border", catColor)}>
                {scheme.category}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Icon name="Building2" className="w-3 h-3" /> {scheme.ministry}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Confidence</div>
          <div className={cn(
            "text-xl font-bold",
            scheme.confidence_score >= 90 ? "text-success" : scheme.confidence_score >= 75 ? "text-primary" : "text-warning"
          )}>{scheme.confidence_score}%</div>
        </div>
      </div>

      {/* Benefit bar */}
      {scheme.benefit && (
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-2">
            <Icon name="Wallet" className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Estimated Benefit</span>
          </div>
          <span className="text-sm font-bold text-primary">{scheme.benefit}</span>
        </div>
      )}

      {/* Why recommended */}
      <div className="p-4 border-b border-slate-100">
        <p className="text-sm text-foreground leading-relaxed">{scheme.why_recommended}</p>
      </div>

      {/* Source verification */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
        {scheme.source_verified ? (
          <span className="trust-badge bg-success/5 text-success border border-success/10">
            <Icon name="BadgeCheck" className="w-3 h-3" strokeWidth={2.5} /> Source Verified
          </span>
        ) : (
          <span className="trust-badge bg-warning/5 text-warning border border-warning/10">
            <Icon name="AlertCircle" className="w-3 h-3" /> Verify Before Applying
          </span>
        )}
        <span className="trust-badge bg-primary/5 text-primary border border-primary/10">
          <Icon name="GitBranch" className="w-3 h-3" /> Rule Engine
        </span>
        <span className="trust-badge bg-purple-50 text-purple-600 border border-purple-100">
          <Icon name="ShieldCheck" className="w-3 h-3" /> Trust: {scheme.trust_score || 95}
        </span>
      </div>

      {/* Quick actions */}
      <div className="p-4 border-b border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scheme.government_url && (
            <a
              href={scheme.government_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary transition-colors"
            >
              <Icon name="ExternalLink" className="w-4 h-4" />
              <span className="text-[10px] font-medium">Apply Now</span>
            </a>
          )}
          <button className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-foreground transition-colors">
            <Icon name="FileCheck" className="w-4 h-4" />
            <span className="text-[10px] font-medium">Documents</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-foreground transition-colors">
            <Icon name="Clock" className="w-4 h-4" />
            <span className="text-[10px] font-medium">Track Status</span>
          </button>
          {scheme.helpline && (
            <a
              href={`tel:${scheme.helpline}`}
              className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-foreground transition-colors"
            >
              <Icon name="MessageCircle" className="w-4 h-4" />
              <span className="text-[10px] font-medium">Helpline</span>
            </a>
          )}
        </div>
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <span className="text-xs font-medium text-primary">Full Details & Application Guide</span>
        <Icon name={expanded ? "ChevronDown" : "ChevronRight"} className={cn("w-4 h-4 text-primary transition-transform", expanded && "rotate-90")} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="p-4 space-y-4">
              {/* Eligibility reasons */}
              {scheme.eligibility_reasons?.length > 0 && (
                <div>
                  <SectionLabel icon="Check" text="Why You Qualify" />
                  <div className="space-y-1.5 mt-2">
                    {scheme.eligibility_reasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Icon name="Check" className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" strokeWidth={2.5} />
                        <span className="text-foreground">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required documents */}
              {scheme.required_documents?.length > 0 && (
                <div>
                  <SectionLabel icon="FileCheck" text="Required Documents" />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {scheme.required_documents.map((doc, i) => (
                      <span key={i} className="trust-badge bg-primary/5 text-primary border border-primary/10 text-[11px]">
                        <Icon name="FileText" className="w-3 h-3" /> {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Application steps */}
              {scheme.application_steps?.length > 0 && (
                <div>
                  <SectionLabel icon="BookCheck" text="Application Steps" />
                  <div className="space-y-2 mt-2">
                    {scheme.application_steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-foreground pt-0.5">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Guidance */}
              {scheme.ai_guidance && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="Sparkles" className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">AI Guidance</span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{scheme.ai_guidance}</p>
                </div>
              )}

              {/* Source metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <MetaRow icon="BookCheck" label="Policy Version" value={scheme.policy_version} />
                <MetaRow icon="Clock" label="Last Updated" value={scheme.last_updated} />
                <MetaRow icon="Clock" label="Processing Time" value={scheme.processing_time} />
                <MetaRow icon="Building2" label="Nearest Office" value={scheme.nearest_office} />
                <MetaRow icon="GitBranch" label="Rule Matched" value={scheme.rule_matched} />
                <MetaRow icon="Globe" label="Government Portal" value={scheme.government_portal} link={scheme.government_url} />
              </div>

              {/* Human review */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <Icon name="UserCheck" className="w-4 h-4 text-primary" />
                  <span className="text-xs text-foreground">Human Review Available</span>
                </div>
                <button className="text-xs font-medium text-primary hover:underline">Request Review</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon name={icon} className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{text}</span>
    </div>
  );
}

function MetaRow({ icon, label, value, link }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon name={icon} className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</div>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline truncate block">
            {value}
          </a>
        ) : (
          <div className="text-xs font-medium text-foreground">{value}</div>
        )}
      </div>
    </div>
  );
}