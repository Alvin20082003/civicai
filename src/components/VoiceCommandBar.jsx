import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { useI18n } from "@/lib/i18n";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

/**
 * Floating voice command bar. Citizens can speak to:
 *  - Navigate pages ("go to dashboard", "open governance")
 *  - Check application status ("what's my application status?")
 *  - Get help ("what can you do?")
 * Supports English and Tamil based on selected language.
 */
export default function VoiceCommandBar() {
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const { speak, stop, isSpeaking, startListening, stopListening, isListening, interimTranscript, transcript, sttSupported } = useVoiceAssistant();
  const [panelOpen, setPanelOpen] = useState(false);
  const [lastResponse, setLastResponse] = useState("");

  // Navigation command map — multilingual keywords (EN + Tamil + Hindi)
  const navCommands = [
    { path: "/dashboard", keys: ["dashboard", "home", "டாஷ்போர்டு", "முகப்பு", "डैशबोर्ड", "होम"], pageName: () => t("nav.dashboard") },
    { path: "/chat", keys: ["chat", "assistant", "ask ai", "உதவியாளர்", "செயற்கை", "सहायक", "एआई"], pageName: () => t("nav.aiAssistant") },
    { path: "/schemes", keys: ["scheme", "schemes", "government scheme", "திட்டம்", "திட்டங்கள்", "योजना", "योजनाएं"], pageName: () => t("nav.schemes") },
    { path: "/family", keys: ["family", "household", "family benefit", "குடும்ப", "परिवार", "कुटुंब"], pageName: () => t("nav.family") },
    { path: "/life-events", keys: ["life event", "life", "event", "வாழ்க்கை", "जीवन", "घटना"], pageName: () => t("nav.lifeEvents") },
    { path: "/governance", keys: ["governance", "oversight", "ஆளுகை", "शासन"], pageName: () => t("nav.governance") },
    { path: "/explainable-ai", keys: ["explainable", "transparency", "விளக்கமுள்ள", "स्पष्ट"], pageName: () => t("nav.explainableAi") },
    { path: "/rule-engine", keys: ["rule", "rules", "engine", "விதி", "नियम"], pageName: () => t("nav.ruleEngine") },
    { path: "/decision-log", keys: ["decision", "log", "audit", "முடிவு", "निर्णय"], pageName: () => t("nav.decisionLog") },
    { path: "/consent", keys: ["consent", "privacy", "permission", "ஒப்புதல்", "सहमति"], pageName: () => t("nav.consent") },
    { path: "/risk", keys: ["risk", "ஆபத்து", "जोखिम"], pageName: () => t("nav.risk") },
    { path: "/policy-intelligence", keys: ["policy", "கொள்கை", "नीति"], pageName: () => t("nav.policy") },
    { path: "/predictive", keys: ["predictive", "forecast", "முன்கணிப்பு", "भविष्य"], pageName: () => t("nav.predictive") },
    { path: "/architecture", keys: ["architecture", "கட்டமைப்பு", "आर्किटेक्चर"], pageName: () => t("nav.architecture") },
  ];

  const statusKeys = [
    "application status", "my application", "check status", "any updates", "application update", "what schemes",
    "விண்ணப்ப நிலை", "எனது விண்ணப்ப", "நிலை சரிபார்", "என் விண்ணப்பம்", "புதுப்பிப்பு", "எனக்கு என்ன திட்டங்கள்",
    "आवेदन स्थिति", "मेरा आवेदन", "स्थिति जांचें", "किन योजनाओं",
  ];

  const familyKeys = [
    "family benefit", "family", "household", "total benefit",
    "குடुம்ப நன்மை", "குடும்ப", "மொத்த நன்மை",
    "परिवार लाभ", "परिवार", "कुल लाभ",
  ];

  const helpKeys = ["what can you do", "help", "commands", "என்ன செய்ய முடியும்", "உதவி", "क्या कर सकते", "मदद"];

  const handleCommand = useCallback(async (text) => {
    const lower = text.toLowerCase().trim();

    // Check navigation commands
    for (const cmd of navCommands) {
      if (cmd.keys.some((k) => lower.includes(k))) {
        const pageName = cmd.pageName();
        speak(t("voice.navigating", pageName), lang);
        setLastResponse(t("voice.navigating", pageName));
        navigate(cmd.path);
        setTimeout(() => setPanelOpen(false), 2000);
        return;
      }
    }

    // Check family benefits
    if (familyKeys.some((k) => lower.includes(k))) {
      const response = lang === "ta"
        ? "உங்கள் குடும்பத்தின் மொத்த ஆண்டு நன்மைகள் ₹4,85,000. 6 குடும்ப உறுப்பினர்கள் 8 அரசு திட்டங்களுக்கு தகுதியானவர்கள்."
        : lang === "hi"
        ? "आपके परिवार का कुल वार्षिक लाभ ₹4,85,000 है। 6 परिवार सदस्य 8 सरकारी योजनाओं के लिए पात्र हैं।"
        : "Your family's total annual benefits are ₹4,85,000. 6 family members are eligible for 8 government schemes.";
      speak(response, lang);
      setLastResponse(response);
      navigate("/family");
      setTimeout(() => setPanelOpen(false), 3000);
      return;
    }

    // Check application status
    if (statusKeys.some((k) => lower.includes(k))) {
      try {
        const notifications = await base44.entities.Notification.list("-created_date", 10);
        const unread = notifications.filter((n) => !n.read);
        const parts = [];

        if (notifications.length === 0) {
          parts.push(t("voice.noNotifications"));
        } else {
          parts.push(t("voice.statusIntro", unread.length));
          const latest = notifications[0];
          const service = latest.service_name || "government service";
          const statusText = latest.type === "success" ? "approved"
            : latest.type === "warning" ? "under review"
            : latest.type === "action_required" ? "requiring action"
            : "in progress";
          parts.push(t("voice.statusLatest", service, statusText));
        }

        const response = parts.join(" ");
        speak(response, lang);
        setLastResponse(response);
      } catch (e) {
        const fallback = t("voice.noNotifications");
        speak(fallback, lang);
        setLastResponse(fallback);
      }
      setTimeout(() => setPanelOpen(false), 3000);
      return;
    }

    // Check help
    if (helpKeys.some((k) => lower.includes(k))) {
      speak(t("voice.help"), lang);
      setLastResponse(t("voice.help"));
      setTimeout(() => setPanelOpen(false), 5000);
      return;
    }

    // No match
    speak(t("voice.noMatch"), lang);
    setLastResponse(t("voice.noMatch"));
    setTimeout(() => setPanelOpen(false), 4000);
  }, [lang, navigate, speak, t]);

  const handleMicClick = useCallback(() => {
    if (isSpeaking) {
      stop();
      return;
    }
    if (!sttSupported) {
      speak(t("voice.notSupported"), lang);
      setLastResponse(t("voice.notSupported"));
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    setLastResponse("");
    setPanelOpen(true);
    startListening(lang, handleCommand, (err) => {
      if (err === "not-supported") {
        speak(t("voice.notSupported"), lang);
        setLastResponse(t("voice.notSupported"));
      } else if (err === "no-speech") {
        speak(t("voice.noMatch"), lang);
        setLastResponse(t("voice.noMatch"));
      }
    });
  }, [isSpeaking, isListening, sttSupported, lang, startListening, stopListening, speak, stop, t, handleCommand]);

  // Close panel when not listening and no response
  useEffect(() => {
    if (!isListening && !lastResponse && panelOpen) {
      const timer = setTimeout(() => setPanelOpen(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isListening, lastResponse, panelOpen]);

  return (
    <>
      {/* Floating mic button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={handleMicClick}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all",
          isListening
            ? "bg-destructive shadow-destructive/30"
            : isSpeaking
            ? "bg-accent shadow-accent/30"
            : "gradient-brand shadow-primary/30 hover:scale-105"
        )}
        title={t("voicebar.tooltip")}
      >
        {isListening ? (
          <>
            <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-30" />
            <Icon name="Circle" className="w-6 h-6 text-white relative z-10" />
          </>
        ) : isSpeaking ? (
          <Icon name="Square" className="w-5 h-5 text-white" />
        ) : (
          <Icon name="Mic" className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Voice panel */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]"
          >
            <div className="glass-card rounded-2xl p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  isListening ? "bg-destructive/10" : "gradient-brand"
                )}>
                  <Icon name={isListening ? "Mic" : "Bot"} className={cn("w-4 h-4", isListening ? "text-destructive" : "text-white")} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t("voice.commandTitle")}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {isListening ? t("voice.listening") : t("voice.commandHint")}
                  </p>
                </div>
                <button
                  onClick={() => { stopListening(); stop(); setPanelOpen(false); }}
                  className="ml-auto w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center"
                >
                  <Icon name="X" className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Transcript / Response */}
              <div className="min-h-[60px] rounded-xl bg-muted/40 p-3">
                {isListening && interimTranscript ? (
                  <p className="text-sm text-muted-foreground italic">"{interimTranscript}"</p>
                ) : transcript ? (
                  <p className="text-sm text-foreground font-medium">"{transcript}"</p>
                ) : lastResponse ? (
                  <p className="text-sm text-foreground leading-relaxed">{lastResponse}</p>
                ) : (
                  <p className="text-xs text-muted-foreground/60 text-center py-3">{t("voice.tapToSpeak")}</p>
                )}
              </div>

              {/* Examples */}
              {!isListening && !lastResponse && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("voicebar.tooltip")}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t("voicebar.examples")}</p>
                </div>
              )}

              {/* Wave animation when listening */}
              {isListening && (
                <div className="flex items-center justify-center gap-1 h-6">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [4, 16, 4] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-destructive rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}