import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import { cn } from "@/lib/utils";

const explanations = [
  {
    id: 1,
    title: "Engineering Scholarship — Eligible",
    confidence: 97,
    icon: "GraduationCap",
    why: "Your profile satisfies all eligibility criteria defined in the Government Scholarship Policy. The Rule Engine evaluated your income, student status, residency, and document verification status.",
    ruleMatched: "Rule #R-SCH-014: Income < $30,000 AND Student Status = Verified AND Residency = Singapore",
    documentsUsed: ["Income Certificate", "Academic Transcript", "NRIC"],
    policyReferenced: "Government Scholarship Policy (MOE-SCH-2024-v3.2)",
    alternatives: [
      { option: "SkillsFuture Credit Top-Up", match: 92, note: "Additional education funding" },
      { option: "Study Loan Subsidy", match: 81, note: "Low-interest alternative" },
    ],
  },
  {
    id: 2,
    title: "Healthcare Subsidy — Approved",
    confidence: 94,
    icon: "Stethoscope",
    why: "You qualify for the Healthcare Subsidy Scheme as a Singapore resident under 30. The Rule Engine validated your residency and age against the subsidy policy thresholds.",
    ruleMatched: "Rule #R-HLT-008: Residency = Singapore AND Age < 30 AND Verified = true",
    documentsUsed: ["NRIC", "Bank Statement"],
    policyReferenced: "Healthcare Subsidy Policy (MOH-SUB-2025-v1.4)",
    alternatives: [
      { option: "Specialist Outpatient Subsidy", match: 88, note: "Newly expanded coverage" },
    ],
  },
  {
    id: 3,
    title: "BTO Housing Grant — Conditional",
    confidence: 78,
    icon: "House",
    why: "Your BTO grant application is conditional pending verification of your proof of residence. Income criteria are met, but document verification is incomplete.",
    ruleMatched: "Rule #R-HDB-021: Income < $14,000 AND Residency Verified AND Documents Complete",
    documentsUsed: ["Income Certificate", "Proof of Residence (unverified)"],
    policyReferenced: "Public Housing Grant Policy (MND-HDB-2024-v2.1)",
    alternatives: [
      { option: "Resale Flat Grant", match: 71, note: "Alternative housing option" },
      { option: "Enhanced CPF Housing Grant", match: 65, note: "Combined with CPF savings" },
    ],
  },
];

export default function ExplainableAI() {
  const [selected, setSelected] = useState(explanations[0]);
  const [showAlternatives, setShowAlternatives] = useState({});

  return (
    <div>
      <PageHeader
        title="Explainable AI"
        subtitle="Every AI recommendation is fully transparent. See exactly why a decision was made, which rules matched, and which policies were referenced."
        icon="Sparkles"
        badges
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision list */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">Recent Decisions</h3>
          {explanations.map((exp, i) => (
            <motion.button
              key={exp.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => setSelected(exp)}
              className={cn(
                "w-full text-left rounded-2xl border p-4 transition-all",
                selected.id === exp.id
                  ? "border-primary/30 bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-slate-200/70 bg-white/80 hover:border-primary/20 hover:shadow-md"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  selected.id === exp.id ? "gradient-brand" : "bg-slate-100"
                )}>
                  <Icon name={exp.icon} className={cn("w-5 h-5", selected.id === exp.id ? "text-white" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{exp.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", exp.confidence >= 90 ? "bg-success" : exp.confidence >= 80 ? "bg-primary" : "bg-warning")}
                        style={{ width: `${exp.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{exp.confidence}%</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Explanation detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
                    <Icon name={selected.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-foreground">{selected.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        selected.confidence >= 90 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                      )}>{selected.confidence}% Confidence</span>
                      <span className="text-xs text-muted-foreground">• Explainable AI</span>
                    </div>
                  </div>
                </div>

                <TrustBadges compact className="mb-6" />

                {/* Why */}
                <ExplanationBlock icon="Lightbulb" label="Why this decision?" color="primary">
                  <p className="text-sm text-foreground leading-relaxed">{selected.why}</p>
                </ExplanationBlock>

                {/* Rule matched */}
                <ExplanationBlock icon="GitBranch" label="Which rule matched?" color="accent">
                  <code className="text-sm text-foreground bg-slate-100 px-3 py-2 rounded-lg block">{selected.ruleMatched}</code>
                </ExplanationBlock>

                {/* Documents */}
                <ExplanationBlock icon="FileCheck" label="Which documents were used?" color="primary">
                  <div className="flex flex-wrap gap-2">
                    {selected.documentsUsed.map((doc) => (
                      <span key={doc} className="trust-badge bg-primary/5 text-primary border border-primary/10">
                        <Icon name="FileText" className="w-3 h-3" /> {doc}
                      </span>
                    ))}
                  </div>
                </ExplanationBlock>

                {/* Policy */}
                <ExplanationBlock icon="BookCheck" label="Which policy was referenced?" color="accent">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50">
                    <Icon name="BookCheck" className="w-4 h-4 text-accent shrink-0" />
                    <span className="text-sm font-medium text-foreground">{selected.policyReferenced}</span>
                  </div>
                </ExplanationBlock>

                {/* Confidence breakdown */}
                <ExplanationBlock icon="Gauge" label="Confidence Score" color="primary">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.confidence}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn("h-full rounded-full", selected.confidence >= 90 ? "bg-success" : "bg-warning")}
                      />
                    </div>
                    <span className="text-2xl font-bold text-foreground">{selected.confidence}%</span>
                  </div>
                </ExplanationBlock>

                {/* Alternatives */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowAlternatives((p) => ({ ...p, [selected.id]: !p[selected.id] }))}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon name="Lightbulb" className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Alternative Recommendations</span>
                      <span className="text-xs text-muted-foreground">({selected.alternatives.length})</span>
                    </div>
                    <Icon name="ChevronDown" className={cn("w-4 h-4 text-muted-foreground transition-transform", showAlternatives[selected.id] && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {showAlternatives[selected.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-2">
                          {selected.alternatives.map((alt, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                              <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center shrink-0">
                                <Icon name="Lightbulb" className="w-4 h-4 text-accent" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-foreground">{alt.option}</div>
                                <div className="text-xs text-muted-foreground">{alt.note}</div>
                              </div>
                              <span className="text-sm font-bold text-primary">{alt.match}%</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ExplanationBlock({ icon, label, color, children }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon name={icon} className={cn("w-4 h-4", color === "primary" ? "text-primary" : "text-accent")} />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      {children}
    </div>
  );
}