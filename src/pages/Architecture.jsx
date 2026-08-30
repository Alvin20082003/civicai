import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { architectureLayers, technologies } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Architecture() {
  const [activeLayer, setActiveLayer] = useState(1);

  return (
    <div>
      <PageHeader
        title="Enterprise Architecture"
        subtitle="The end-to-end flow from citizen interaction to government service delivery, with auditability at every layer."
        icon="Network"
        badges
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Architecture flow */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 lg:p-8">
            <div className="flex flex-col items-center">
              {architectureLayers.map((layer, i) => (
                <div key={layer.id} className="w-full max-w-xl">
                  <motion.button
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    onClick={() => setActiveLayer(layer.id)}
                    className={cn(
                      "w-full flex items-center gap-4 rounded-2xl p-4 border transition-all duration-300 text-left",
                      activeLayer === layer.id
                        ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-slate-200/70 bg-white hover:border-primary/20 hover:shadow-md"
                    )}
                  >
                    <div className="relative shrink-0">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                        activeLayer === layer.id ? "gradient-brand shadow-lg shadow-primary/20" : "bg-slate-100"
                      )}>
                        <Icon name={layer.icon} className={cn("w-6 h-6", activeLayer === layer.id ? "text-white" : "text-muted-foreground")} />
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                        {layer.id}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{layer.title}</span>
                        <span className="text-[10px] font-medium text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">{layer.layer}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{layer.desc}</p>
                    </div>
                    <Icon name="ChevronRight" className={cn("w-4 h-4 transition-transform shrink-0", activeLayer === layer.id ? "text-primary" : "text-muted-foreground/30")} />
                  </motion.button>

                  {i < architectureLayers.length - 1 && (
                    <div className="flex justify-center py-2">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.06 + 0.1 }}
                        className="origin-top flex flex-col items-center"
                      >
                        <div className="w-px h-8 bg-gradient-to-b from-primary/40 to-primary/10" />
                        <Icon name="ChevronDown" className="w-4 h-4 text-primary/40 -mt-1" />
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Layer detail */}
        <div className="space-y-6">
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                <Icon name={architectureLayers[activeLayer - 1].icon} className="w-7 h-7 text-white" />
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Layer {activeLayer} of {architectureLayers.length}</div>
              <h3 className="text-lg font-bold text-foreground mt-1">{architectureLayers[activeLayer - 1].title}</h3>
              <span className="inline-block mt-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{architectureLayers[activeLayer - 1].layer}</span>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{architectureLayers[activeLayer - 1].desc}</p>
            </GlassCard>
          </motion.div>

          <GlassCard className="p-6">
            <h4 className="text-sm font-semibold mb-3">Architecture Properties</h4>
            <div className="space-y-3">
              {[
                { label: "Total Layers", value: architectureLayers.length },
                { label: "Real-time", value: "Yes" },
                { label: "Auditable", value: "Every Layer" },
                { label: "Encrypted", value: "End-to-End" },
                { label: "Compliant", value: "PDPA Ready" },
              ].map((prop) => (
                <div key={prop.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{prop.label}</span>
                  <span className="font-medium text-foreground">{prop.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h4 className="text-sm font-semibold mb-3">Governance Tags</h4>
            <TrustBadges compact />
          </GlassCard>
        </div>
      </div>

      {/* Technology stack */}
      <div className="mt-8">
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-1">Technology Stack</h3>
          <p className="text-xs text-muted-foreground mb-4">Enterprise-grade AI technologies powering the CivicAI platform</p>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary transition-colors"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}