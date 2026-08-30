import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import { useI18n } from "@/lib/i18n";
import { documentWallet as documentVault } from "@/lib/indiaData";
import { cn } from "@/lib/utils";

export default function DocumentWalletCard() {
  const { t } = useI18n();
  const verified = documentVault.filter((d) => d.verified);
  const missing = documentVault.filter((d) => d.missing);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <Link to="/documents" className="block group">
        <GlassCard className="p-6 group-hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Icon name="FileCheck" className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t("dashboard.documents.title")}</h3>
                <p className="text-[10px] text-muted-foreground">{t("dashboard.documents.privacy")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{verified.length}/{documentVault.length}</span>
              <Icon name="ArrowRight" className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Missing Documents Alert */}
          {missing.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-warning/5 border border-warning/20 flex items-start gap-2">
              <Icon name="AlertCircle" className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-warning">{t("dashboard.documents.missing")} ({missing.length})</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{t("dashboard.documents.uploadSuggested")}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {documentVault.map((doc) => (
              <div key={doc.id} className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                doc.missing
                  ? "border-warning/20 bg-warning/5"
                  : doc.verified
                  ? "border-border bg-white/40 hover:border-primary/20"
                  : "border-border bg-white/40"
              )}>
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                  doc.missing ? "bg-warning/10" : doc.verified ? "bg-success/10" : "bg-warning/10"
                )}>
                  <Icon name={doc.missing ? "FileQuestion" : doc.icon} className={cn("w-5 h-5", doc.missing ? "text-warning" : doc.verified ? "text-success" : "text-warning")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{doc.name}</div>
                  <div className="text-[10px] text-muted-foreground">{doc.number}</div>
                </div>
                {doc.missing ? (
                  <span className="trust-badge bg-warning/10 text-warning text-[9px]">{t("common.pending")}</span>
                ) : doc.verified ? (
                  <span className="trust-badge bg-success/10 text-success text-[9px]">{t("common.verified")}</span>
                ) : (
                  <span className="trust-badge bg-warning/10 text-warning text-[9px]">{t("common.pending")}</span>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}