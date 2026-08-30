import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import VoiceButton from "@/components/VoiceButton";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { cn } from "@/lib/utils";

const typeConfig = {
  success: { icon: "CheckCircle2", color: "text-success", dot: "bg-success", bg: "bg-success/5" },
  warning: { icon: "AlertTriangle", color: "text-warning", dot: "bg-warning", bg: "bg-warning/5" },
  info: { icon: "Info", color: "text-primary", dot: "bg-primary", bg: "bg-primary/5" },
  action_required: { icon: "AlertCircle", color: "text-destructive", dot: "bg-destructive", bg: "bg-destructive/5" },
};

function timeAgo(dateStr, t) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("notifications.justNow");
  if (mins < 60) return mins + t("notifications.minAgo");
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + t("notifications.hrAgo");
  return Math.floor(hrs / 24) + t("notifications.dayAgo");
}

export default function NotificationCenter() {
  const { lang, t } = useI18n();
  const { speak, stop, isSpeaking } = useVoiceAssistant();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [readingId, setReadingId] = useState(null);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await base44.entities.Notification.list("-created_date", 50);
      setNotifications(data);
    } catch (e) {
      console.error("Failed to load notifications", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const unsubscribe = base44.entities.Notification.subscribe((event) => {
      if (event.type === "create") {
        setNotifications((prev) => [event.data, ...prev]);
      } else if (event.type === "update") {
        setNotifications((prev) => prev.map((n) => (n.id === event.data.id ? event.data : n)));
      } else if (event.type === "delete") {
        setNotifications((prev) => prev.filter((n) => n.id !== event.data.id));
      }
    });
    return () => unsubscribe();
  }, [loadNotifications]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const actionRequiredCount = useMemo(
    () => notifications.filter((n) => n.category === "action_required" && !n.read).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => !n.read);
    if (filter === "action_required") return notifications.filter((n) => n.category === "action_required");
    if (filter === "status_change") return notifications.filter((n) => n.category === "status_change");
    return notifications;
  }, [notifications, filter]);

  const markAsRead = useCallback(async (id) => {
    try {
      await base44.entities.Notification.update(id, { read: true });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    try {
      await base44.entities.Notification.bulkUpdate(unread.map((n) => ({ id: n.id, read: true })));
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  }, [notifications]);

  const readAloud = useCallback(
    (notification) => {
      const title = lang === "ta" ? notification.title_ta : notification.title_en;
      const desc = lang === "ta" ? notification.description_ta : notification.description_en;
      speak(`${title}. ${desc}`, lang);
      setReadingId(notification.id);
    },
    [lang, speak]
  );

  const stopReading = useCallback(() => {
    stop();
    setReadingId(null);
  }, [stop]);

  const readAll = useCallback(() => {
    const text = filtered
      .filter((n) => !n.read)
      .map((n) => {
        const title = lang === "ta" ? n.title_ta : n.title_en;
        const desc = lang === "ta" ? n.description_ta : n.description_en;
        return `${title}. ${desc}`;
      })
      .join(". ");
    if (text) speak(text, lang);
  }, [filtered, lang, speak]);

  const filters = [
    { key: "all", label: t("notifications.filter.all"), count: notifications.length },
    { key: "unread", label: t("notifications.filter.unread"), count: unreadCount },
    { key: "action_required", label: t("notifications.filter.actionRequired"), count: actionRequiredCount },
    { key: "status_change", label: t("notifications.filter.statusChanges"), count: notifications.filter((n) => n.category === "status_change").length },
  ];

  return (
    <GlassCard className="p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Icon name="Bell" className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{t("notifications.title")}</h3>
            <p className="text-[10px] text-muted-foreground">{t("notifications.subtitle")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle compact />
        </div>
      </div>

      {/* Actions bar */}
      <div className="flex items-center justify-between mt-3 pb-3 border-b border-border">
        <span className="text-xs text-primary font-medium">
          {unreadCount} {t("notifications.new")}
        </span>
        <div className="flex items-center gap-2">
          {filtered.some((n) => !n.read) && (
            <VoiceButton
              isSpeaking={isSpeaking}
              onPlay={readAll}
              onStop={stopReading}
              label={t("voice.readAll")}
            />
          )}
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              {t("notifications.markAllRead")}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mt-3 mb-3 overflow-x-auto scrollbar-thin">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              filter === f.key
                ? "bg-primary text-white"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            )}
          >
            {f.label}
            {f.count > 0 && (
              <span className={cn(
                "px-1 rounded-full text-[9px]",
                filter === f.key ? "bg-white/20" : "bg-primary/10 text-primary"
              )}>
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin -mr-2 pr-2">
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <Icon name="BellOff" className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{t("notifications.empty")}</p>
            <p className="text-xs text-muted-foreground/70 mt-1 max-w-[200px] mx-auto">{t("notifications.emptyDesc")}</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((n) => {
              const cfg = typeConfig[n.type] || typeConfig.info;
              const title = lang === "ta" ? n.title_ta : n.title_en;
              const desc = lang === "ta" ? n.description_ta : n.description_en;
              const actionLabel = lang === "ta" ? n.action_label_ta : n.action_label_en;
              const isThisReading = readingId === n.id && isSpeaking;

              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "relative rounded-xl p-3 border transition-all",
                    n.read ? "bg-white/40 border-border" : `${cfg.bg} border-transparent ring-1 ring-primary/5`
                  )}
                >
                  {!n.read && (
                    <div className={cn("absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full", cfg.dot)} />
                  )}
                  <div className="flex gap-2.5 pl-2">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", cfg.bg)}>
                      <Icon name={cfg.icon} className={cn("w-4 h-4", cfg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
                        <span className="text-[10px] text-muted-foreground/70 shrink-0 mt-0.5">
                          {timeAgo(n.created_date, t)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>

                      {/* Service / App ID badge */}
                      {(n.service_name || n.application_id) && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {n.service_name && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                              {n.service_name}
                            </span>
                          )}
                          {n.application_id && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/5 text-primary font-medium">
                              {n.application_id}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <VoiceButton
                          isSpeaking={isThisReading}
                          onPlay={() => readAloud(n)}
                          onStop={stopReading}
                          label={t("voice.readAloud")}
                        />
                        {actionLabel && n.action_link && (
                          <Link
                            to={n.action_link}
                            onClick={() => markAsRead(n.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                          >
                            {actionLabel}
                            <Icon name="ArrowRight" className="w-3 h-3" />
                          </Link>
                        )}
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="ml-auto text-[10px] text-muted-foreground hover:text-primary transition-colors"
                          >
                            {t("notifications.markRead")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </GlassCard>
  );
}