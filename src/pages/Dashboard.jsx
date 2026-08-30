import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import AadhaarProfileCard from "@/components/AadhaarProfileCard";
import HouseholdAnalysisCard from "@/components/HouseholdAnalysisCard";
import DocumentWalletCard from "@/components/DocumentWalletCard";
import NotificationCenter from "@/components/NotificationCenter";
import { useI18n } from "@/lib/i18n";
import {
  citizen, governmentSchemes, recentApplications,
  policyUpdates, governanceMetrics,
} from "@/lib/indiaData";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { t } = useI18n();
  const eligibleSchemes = governmentSchemes.filter((s) => s.eligible === true).slice(0, 5);

  return (
    <div>
      <PageHeader
        title={t("dashboard.welcome", citizen.name.split(" ")[0])}
        subtitle={t("dashboard.subtitle")}
        icon="House"
      >
        <Link
          to="/chat"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
        >
          <Icon name="MessageCircle" className="w-4 h-4" />
          {t("dashboard.askAi")}
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <AadhaarProfileCard citizen={citizen} />
          <HouseholdAnalysisCard />
          <DocumentWalletCard />
          <EligibleSchemesCard schemes={eligibleSchemes} />
          <RecentApplicationsCard />
        </div>

        {/* Right column - 1/3 */}
        <div className="space-y-6">
          {/* AI Assistant Widget */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-primary/20">
                <Icon name="Bot" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("dashboard.aiWidget.title")}</h3>
                <p className="text-xs text-muted-foreground">{t("dashboard.aiWidget.badge")}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{t("dashboard.aiWidget.desc")}</p>
            <Link
              to="/chat"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gradient-brand text-white text-sm font-medium hover:shadow-lg transition-all"
            >
              {t("dashboard.aiWidget.start")}
              <Icon name="ArrowRight" className="w-4 h-4" />
            </Link>
          </GlassCard>

          <NotificationCenter />

          {/* Governance Summary */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">{t("dashboard.governance.title")}</h3>
              <Link to="/governance" className="text-xs text-primary font-medium hover:underline">{t("common.viewAll")}</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {governanceMetrics.slice(0, 4).map((m) => (
                <div key={m.label} className="text-center p-3 rounded-xl bg-slate-50">
                  <div className="text-xl font-bold text-gradient-brand">{m.value}{m.suffix}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{m.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Policy Updates */}
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">{t("dashboard.policy.title")}</h3>
              <Link to="/policy-intelligence" className="text-xs text-primary font-medium hover:underline">{t("common.viewAll")}</Link>
            </div>
            <div className="space-y-3">
              {policyUpdates.slice(0, 2).map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-slate-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-medium text-foreground leading-tight">{p.title}</div>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full shrink-0",
                      p.severity === "high" && "bg-destructive/10 text-destructive",
                      p.severity === "medium" && "bg-warning/10 text-warning",
                      p.severity === "low" && "bg-success/10 text-success",
                    )}>{t("common." + p.severity)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{p.department}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function EligibleSchemesCard({ schemes }) {
  const { t } = useI18n();
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{t("dashboard.schemes.title")}</h3>
        <Link to="/schemes" className="text-xs text-primary font-medium hover:underline">{t("common.viewAll")}</Link>
      </div>
      <p className="text-xs text-muted-foreground mb-4">{t("dashboard.schemes.aiMatched")}</p>
      <div className="space-y-2">
        {schemes.map((scheme) => (
          <Link key={scheme.id} to="/schemes" className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
              <Icon name={scheme.icon} className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">{scheme.name}</span>
                <span className="text-[10px] text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">{scheme.category}</span>
              </div>
              <div className="text-xs text-primary font-medium mt-0.5">{scheme.benefit}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className={cn(
                  "text-sm font-bold",
                  scheme.match >= 90 ? "text-success" : scheme.match >= 80 ? "text-primary" : "text-warning"
                )}>{scheme.match}%</div>
                <div className="text-[10px] text-muted-foreground">{t("common.match")}</div>
              </div>
              <Icon name="ArrowRight" className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}

function RecentApplicationsCard() {
  const { t } = useI18n();
  const statusColors = {
    "Approved": "bg-success/10 text-success",
    "Under Review": "bg-warning/10 text-warning",
    "Pending": "bg-primary/10 text-primary",
  };
  const statusLabel = (s) => {
    if (s === "Approved") return t("dashboard.applications.approved");
    if (s === "Under Review") return t("dashboard.applications.underReview");
    return t("dashboard.applications.pending");
  };
  return (
    <GlassCard className="p-6">
      <h3 className="font-semibold mb-4">{t("dashboard.applications.title")}</h3>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-slate-100">
              <th className="pb-2 px-2 font-medium">{t("dashboard.applications.app")}</th>
              <th className="pb-2 px-2 font-medium">{t("dashboard.applications.service")}</th>
              <th className="pb-2 px-2 font-medium">{t("dashboard.applications.submitted")}</th>
              <th className="pb-2 px-2 font-medium">{t("dashboard.applications.amount")}</th>
              <th className="pb-2 px-2 font-medium">{t("dashboard.applications.status")}</th>
            </tr>
          </thead>
          <tbody>
            {recentApplications.map((app) => (
              <tr key={app.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                <td className="py-3 px-2 font-medium text-primary">{app.id}</td>
                <td className="py-3 px-2 text-foreground">{app.service}</td>
                <td className="py-3 px-2 text-muted-foreground">{app.submitted}</td>
                <td className="py-3 px-2 font-medium text-foreground">{app.amount}</td>
                <td className="py-3 px-2">
                  <span className={cn("trust-badge", statusColors[app.status])}>{statusLabel(app.status)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}