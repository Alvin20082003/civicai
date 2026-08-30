import React from "react";
import { useI18n } from "@/lib/i18n";
import { Languages } from "lucide-react";

export default function LanguageToggle({ compact = false }) {
  const { lang, setLang, t } = useI18n();

  const toggle = () => setLang(lang === "en" ? "ta" : "en");

  return (
    <button
      onClick={toggle}
      title={t("lang.label")}
      className={
        compact
          ? "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted text-xs font-medium text-muted-foreground transition-colors"
          : "flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-white/60 hover:bg-muted text-sm font-medium text-foreground transition-colors"
      }
    >
      <Languages className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
      <span>{t("lang.switch")}</span>
    </button>
  );
}