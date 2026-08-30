import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import { useI18n } from "@/lib/i18n";
import { familyMembers, totalFamilyBenefits } from "@/lib/indiaData";

export default function HouseholdAnalysisCard() {
  const { t } = useI18n();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Icon name="Users" className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t("dashboard.family.title")}</h3>
              <p className="text-[10px] text-muted-foreground">{t("dashboard.family.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Total Benefits Banner */}
        <div className="mt-4 p-4 rounded-2xl gradient-brand-soft border border-primary/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{t("dashboard.family.totalBenefits")}</p>
            <p className="text-2xl font-bold text-gradient-brand">₹{totalFamilyBenefits.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-muted-foreground">{t("dashboard.family.perYear")}</p>
          </div>
          <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center">
            <Icon name="Wallet" className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Family Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="p-3 rounded-xl border border-border bg-white/40 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-primary/10" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{member.name}</div>
                  <div className="text-[10px] text-muted-foreground">{member.relation} • {member.age}y</div>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {member.eligibleSchemes.map((s, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/5 text-primary font-medium">
                    {s.match}% {s.name.length > 20 ? s.name.substring(0, 20) + "..." : s.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link to="/family" className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-primary/20 text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
          {t("dashboard.family.viewDetails")}
          <Icon name="ArrowRight" className="w-4 h-4" />
        </Link>
      </GlassCard>
    </motion.div>
  );
}