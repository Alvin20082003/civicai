import React from "react";
import Icon from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function VoiceButton({ isSpeaking, onPlay, onStop, label, size = "sm" }) {
  const { t } = useI18n();
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  if (isSpeaking) {
    return (
      <button
        onClick={onStop}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors"
        title={t("voice.stop")}
      >
        <Icon name="Square" className={sizeClasses} />
        <span>{t("voice.stop")}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onPlay}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors",
        !label && "px-2"
      )}
      title={label || t("voice.readAloud")}
    >
      <Icon name="Volume2" className={sizeClasses} />
      {label && <span>{label}</span>}
    </button>
  );
}