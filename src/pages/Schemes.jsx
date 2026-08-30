import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { useI18n } from "@/lib/i18n";
import { governmentSchemes } from "@/lib/indiaData";
import { cn } from "@/lib/utils";

export default function Schemes() {
  const { t, lang } = useI18n();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const categories = ["all", "education", "agriculture", "healthcare", "housing", "welfare", "business", "employment"];

  const filtered = governmentSchemes.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (lang === "ta" && s.name_ta && s.name_ta.includes(search)) ||
      (lang === "hi" && s.name_hi && s.name_hi.includes(search));
    const matchesFilter = filter === "all" || s.category.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const schemeName = (s) => {
    if (lang === "ta" && s.name_ta) return s.name_ta;
    if (lang === "hi" && s.name_hi) return s.name_hi;
    return s.name;
  };

  return (
    <div>
      <PageHeader title={t("schemes.title")} subtitle={t("schemes.subtitle")} icon="FileBadge" badges />

      {/* Search + Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("schemes.search")}
            className="w-full rounded-xl border border-border bg-white/60 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors capitalize",
                filter === cat ? "bg-primary text-white" : "bg-muted/60 text-muted-foreground hover:bg-muted"
              )}
            >
              {t(`schemes.filter.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((scheme, i) => (
          <SchemeCard key={scheme.id} scheme={scheme} name={schemeName(scheme)} onSelect={() => setSelected(scheme)} index={i} />
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <SchemeDetailModal scheme={selected} name={schemeName(selected)} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SchemeCard({ scheme, name, onSelect, index }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <GlassCard className="p-5 hover:border-primary/20 transition-colors cursor-pointer" >
        <div className="flex items-start gap-4" onClick={onSelect}>
          <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
            <Icon name={scheme.icon} className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{name}</h3>
              <span className="text-[10px] text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">{scheme.category}</span>
            </div>
            <p className="text-sm text-primary font-medium mt-1">{scheme.benefit}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{scheme.purpose}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className={cn(
              "trust-badge",
              scheme.eligible === true && "bg-success/10 text-success border border-success/20",
              scheme.eligible === "conditional" && "bg-warning/10 text-warning border border-warning/20",
            )}>
              {scheme.eligible === true ? t("common.eligible") : t("common.conditional")}
            </span>
            <span className="text-xs text-muted-foreground">{scheme.match}% {t("common.match")}</span>
          </div>
          <button onClick={onSelect} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            {t("common.viewGuide")}
            <Icon name="ArrowRight" className="w-3 h-3" />
          </button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function SchemeDetailModal({ scheme, name, onClose }) {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border sticky top-0 bg-white z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shrink-0">
              <Icon name={scheme.icon} className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{name}</h2>
              <p className="text-sm text-primary font-medium">{scheme.benefit}</p>
              <p className="text-xs text-muted-foreground mt-1">{scheme.ministry}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center shrink-0">
              <Icon name="X" className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="mt-3">
            <TrustBadges compact />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Purpose */}
          <Section title={t("schemes.purpose")} icon="Lightbulb">
            <p className="text-sm text-foreground leading-relaxed">{scheme.purpose}</p>
          </Section>

          {/* AI Guidance */}
          <div className="p-4 rounded-xl gradient-brand-soft border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Bot" className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t("schemes.aiGuidance")}</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{scheme.aiGuidance}</p>
            <div className="mt-2 text-[10px] text-muted-foreground">{t("schemes.policyVersion")}: {scheme.policyVersion}</div>
          </div>

          {/* Eligibility */}
          <Section title={t("schemes.eligibility")} icon="CheckCircle2">
            <div className="space-y-1.5">
              {scheme.eligibility.map((e, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <Icon name="Check" className="w-4 h-4 text-success mt-0.5 shrink-0" strokeWidth={2.5} />
                  <span className="text-foreground">{e}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Required Documents */}
          <Section title={t("schemes.requiredDocs")} icon="FileText">
            <div className="flex flex-wrap gap-2">
              {scheme.requiredDocuments.map((doc) => (
                <span key={doc} className="trust-badge bg-primary/5 text-primary border border-primary/10">
                  <Icon name="FileCheck" className="w-3 h-3" /> {doc}
                </span>
              ))}
            </div>
          </Section>

          {/* Application Steps */}
          <Section title={t("schemes.steps")} icon="GitBranch">
            <div className="space-y-3">
              {scheme.applicationSteps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center shrink-0 text-white text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-foreground pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Section title={t("common.processingTime")} icon="Clock">
              <p className="text-sm font-medium text-foreground">{scheme.processingTime}</p>
            </Section>
            <Section title={t("schemes.office")} icon="Building2">
              <p className="text-sm font-medium text-foreground">{scheme.office}</p>
            </Section>
          </div>

          {/* Portal */}
          <Section title={t("schemes.portal")} icon="ExternalLink">
            <a href={scheme.portal} target="_blank" rel="noopener noreferrer" className="text-sm text-primary font-medium hover:underline break-all">
              {scheme.portal}
            </a>
          </Section>

          {/* Apply Button */}
          <a
            href={scheme.portal}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-brand text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            <Icon name="Send" className="w-4 h-4" />
            {t("common.apply")}
            <Icon name="ExternalLink" className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon name={icon} className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h4>
      </div>
      {children}
    </div>
  );
}