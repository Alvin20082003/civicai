import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

/**
 * Tracks unread notification count with realtime updates.
 * Used by the topbar bell badge.
 */
export function useUnreadNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [actionRequiredCount, setActionRequiredCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadCount = async () => {
      try {
        const all = await base44.entities.Notification.list("-created_date", 50);
        if (!mounted) return;
        setUnreadCount(all.filter((n) => !n.read).length);
        setActionRequiredCount(all.filter((n) => !n.read && n.category === "action_required").length);
      } catch (e) {
        // silently fail — bell just won't show a count
      }
    };

    loadCount();

    const unsubscribe = base44.entities.Notification.subscribe((event) => {
      if (event.type === "create") {
        setUnreadCount((c) => c + 1);
        if (event.data.category === "action_required") {
          setActionRequiredCount((c) => c + 1);
        }
      } else if (event.type === "update") {
        // Re-fetch to get accurate counts on read/unread changes
        loadCount();
      } else if (event.type === "delete") {
        loadCount();
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { unreadCount, actionRequiredCount };
}