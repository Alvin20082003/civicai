import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useI18n, LANGUAGES } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function LanguageSelector({ compact = false }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg transition-colors",
          compact
            ? "px-2 py-1.5 hover:bg-muted text-xs font-medium text-muted-foreground"
            : "px-3 py-2 border border-border bg-white/60 hover:bg-muted text-sm font-medium text-foreground"
        )}
      >
        <Globe className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
        <span>{current.nativeLabel}</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-border z-50 overflow-hidden"
            >
              <div className="p-2">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  Select Language / भाषा चुनें
                </p>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setOpen(false); }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      lang === l.code
                        ? "bg-primary/5 text-primary font-medium"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{l.flag}</span>
                      <span>{l.nativeLabel}</span>
                    </span>
                    {lang === l.code && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}