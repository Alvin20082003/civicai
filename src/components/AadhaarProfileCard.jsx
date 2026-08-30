import React from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function AadhaarProfileCard({ citizen }) {
  const { t } = useI18n();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <GlassCard className="p-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <img src={citizen.avatar} alt={citizen.name} className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/10" />
            {citizen.aadhaarVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center ring-2 ring-white">
                <Icon name="Fingerprint" className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{citizen.name}</h2>
              <span className="trust-badge bg-success/10 text-success border border-success/20">
                <Icon name="BadgeCheck" className="w-3 h-3" /> {t("dashboard.aadhaar.verified")}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{citizen.occupation} • {citizen.state}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <ProfileStat icon="Fingerprint" label={t("dashboard.aadhaar.citizenId")} value={citizen.aadhaar} />
              <ProfileStat icon="Clock" label={t("dashboard.aadhaar.age")} value={citizen.age} />
              <ProfileStat icon="Wallet" label={t("dashboard.aadhaar.income")} value={`₹${citizen.income.toLocaleString("en-IN")}`} />
              <ProfileStat icon="ShieldCheck" label={t("dashboard.aadhaar.trustScore")} value={`${citizen.trustScore}%`} highlight />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <ProfileRow icon="Landmark" label={t("dashboard.aadhaar.state")} value={citizen.state} />
              <ProfileRow icon="Building2" label={t("dashboard.aadhaar.district")} value={citizen.district} />
              <ProfileRow icon="Briefcase" label={t("dashboard.aadhaar.occupation")} value={citizen.occupation} />
              <ProfileRow icon="Wallet" label={t("dashboard.aadhaar.incomeCategory")} value={citizen.incomeCategory} />
              <ProfileRow icon="GraduationCap" label={t("dashboard.aadhaar.studentStatus")} value={citizen.studentStatus ? t("dashboard.aadhaar.yes") : t("dashboard.aadhaar.no")} />
              <ProfileRow icon="Users" label={t("dashboard.aadhaar.seniorCitizen")} value={citizen.seniorCitizen ? t("dashboard.aadhaar.yes") : t("dashboard.aadhaar.no")} />
            </div>

            <div className="mt-4 p-3 rounded-xl bg-muted/40 flex items-start gap-2">
              <Icon name="House" className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("dashboard.aadhaar.address")}</span>
                <p className="text-sm text-foreground">{citizen.address}</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function ProfileStat({ icon, label, value, highlight }) {
  return (
    <div>
      <div className={cn("text-sm font-semibold", highlight ? "text-gradient-brand" : "text-foreground")}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon name={icon} className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <div>
        <span className="text-[10px] text-muted-foreground">{label}: </span>
        <span className="text-xs font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}