import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { ruleEngineSteps } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function RuleEngine() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div>
      <PageHeader
        title="Rule Engine Visualization"
        subtitle="Trace how a citizen request flows through deterministic rules, validation, and human oversight to a government submission."
        icon="GitBranch"
        badges
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flow diagram */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 lg:p-8">
            <div className="flex flex-col items-center">
              {ruleEngineSteps.map((step, i) => (
                <div key={step.id} className="w-full max-w-md">
                  <motion.button
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    onClick={() => setActiveStep(i)}
                    className={cn(
                      "w-full flex items-center gap-4 rounded-2xl p-4 border transition-all duration-300",
                      activeStep === i
                        ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-slate-200/70 bg-white hover:border-primary/20 hover:shadow-md"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all",
                      activeStep === i
                        ? "gradient-brand shadow-lg shadow-primary/20"
                        : "bg-slate-100"
                    )}>
                      <Icon name={step.icon} className={cn("w-6 h-6", activeStep === i ? "text-white" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-muted-foreground">STEP {step.id}</span>
                        {activeStep === i && (
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Active</span>
                        )}
                      </div>
                      <div className="font-semibold text-foreground text-sm">{step.title}</div>
                    </div>
                    <Icon name="ChevronRight" className={cn("w-4 h-4 transition-transform", activeStep === i ? "text-primary translate-x-0" : "text-muted-foreground/40")} />
                  </motion.button>

                  {i < ruleEngineSteps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        transition={{ duration: 0.4, delay: i * 0.08 + 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-px h-6 bg-gradient-to-b from-primary/40 to-primary/10" />
                        <Icon name="ChevronDown" className="w-4 h-4 text-primary/40 -mt-1" />
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Active step detail */}
        <div className="space-y-6">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                <Icon name={ruleEngineSteps[activeStep].icon} className="w-7 h-7 text-white" />
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Step {ruleEngineSteps[activeStep].id} of {ruleEngineSteps.length}</div>
              <h3 className="text-lg font-bold text-foreground mt-1">{ruleEngineSteps[activeStep].title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{ruleEngineSteps[activeStep].desc}</p>
            </GlassCard>
          </motion.div>

          <GlassCard className="p-6">
            <h4 className="text-sm font-semibold mb-3">Pipeline Properties</h4>
            <div className="space-y-3">
              {[
                { label: "Total Steps", value: ruleEngineSteps.length },
                { label: "Processing Time", value: "~0.3s" },
                { label: "Deterministic", value: "Yes" },
                { label: "Auditable", value: "Yes" },
                { label: "Human Override", value: "Available" },
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

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" /> Previous
            </button>
            <button
              onClick={() => setActiveStep(Math.min(ruleEngineSteps.length - 1, activeStep + 1))}
              disabled={activeStep === ruleEngineSteps.length - 1}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <Icon name="ArrowRight" className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}