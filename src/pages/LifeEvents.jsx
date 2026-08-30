import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n";
import { lifeEvents, governmentSchemes } from "@/lib/indiaData";
import { cn } from "@/lib/utils";

export default function LifeEvents() {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState(lifeEvents[0]);

  const eventName = (e) => {
    if (lang === "ta" && e.event_ta) return e.event_ta;
    if (lang === "hi" && e.event_hi) return e.event_hi;
    return e.event;
  };

  const matchingSchemes = governmentSchemes.filter((s) =>
    selected.schemes.some((sn) => s.name.toLowerCase().includes(sn.toLowerCase().split(" ")[0]))
  );

  return (
    <div>
      <PageHeader title={t("lifeEvents.title")} subtitle={t("lifeEvents.subtitle")} icon="Sparkles" badges />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Life Events List */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">{t("lifeEvents.selectEvent")}</p>
          {lifeEvents.map((event, i) => (
            <motion.button
              key={event.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => setSelected(event)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all",
                selected.id === event.id
                  ? "border-primary/30 bg-primary/5 shadow-sm"
                  : "border-border bg-white/40 hover:border-primary/20"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  selected.id === event.id ? "gradient-brand" : "bg-muted"
                )}>
                  <Icon name={event.icon} className={cn("w-5 h-5", selected.id === event.id ? "text-white" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{eventName(event)}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{event.desc}</div>
                </div>
                {selected.id === event.id && <Icon name="ChevronRight" className="w-4 h-4 text-primary shrink-0" />}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-6">
                {/* Event Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
                    <Icon name={selected.icon} className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{eventName(selected)}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{selected.desc}</p>
                  </div>
                </div>

                {/* Flow visualization */}
                <div className="mb-6 p-4 rounded-xl gradient-brand-soft border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Sparkles" className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wide">{t("lifeEvents.proactive")}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{eventName(selected)}</span>
                    <Icon name="ArrowRight" className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{t("lifeEvents.recommendedSchemes")}</span>
                  </div>
                </div>

                {/* Recommended Schemes */}
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t("lifeEvents.recommendedSchemes")}</h3>
                <div className="space-y-3">
                  {selected.schemes.map((schemeName, i) => {
                    const matchedScheme = matchingSchemes[i];
                    return (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border bg-white/40 hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                          <Icon name={matchedScheme?.icon || "FileBadge"} className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground">{schemeName}</div>
                          {matchedScheme && (
                            <div className="text-xs text-primary font-medium mt-0.5">{matchedScheme.benefit}</div>
                          )}
                        </div>
                        {matchedScheme && (
                          <div className="flex items-center gap-3 shrink-0">
                            <a
                              href={matchedScheme.portal}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                              {t("common.apply")}
                              <Icon name="ExternalLink" className="w-3 h-3" />
                            </a>
                            <div className="text-right">
                              <div className={cn(
                                "text-sm font-bold",
                                matchedScheme.match >= 90 ? "text-success" : matchedScheme.match >= 80 ? "text-primary" : "text-warning"
                              )}>{matchedScheme.match}%</div>
                              <div className="text-[10px] text-muted-foreground">{t("common.match")}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <Link
                  to="/schemes"
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                >
                  {t("common.viewGuide")}
                  <Icon name="ArrowRight" className="w-4 h-4" />
                </Link>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}