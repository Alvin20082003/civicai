import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Icon from "@/components/ui/Icon";
import GlassCard from "@/components/ui/GlassCard";
import PageHeader from "@/components/PageHeader";
import TrustBadges from "@/components/TrustBadges";
import VoiceButton from "@/components/VoiceButton";
import VoiceInputButton from "@/components/ai/VoiceInputButton";
import SchemeCard from "@/components/ai/SchemeCard";
import { useI18n } from "@/lib/i18n";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { aiGreetings } from "@/lib/indiaData";
import { buildCaseworkerPrompt, caseworkerResponseSchema, naturalLanguageExamples } from "@/lib/aiPrompt";
import { base44 } from "@/api/base44Client";
import { cn } from "@/lib/utils";

export default function AIChat() {
  const { t, lang } = useI18n();
  const { speak, stop, isSpeaking, startListening, stopListening, isListening, interimTranscript, sttSupported } = useVoiceAssistant();
  const greeting = aiGreetings[lang] || aiGreetings.en;
  const examples = naturalLanguageExamples[lang] || naturalLanguageExamples.en;

  const [messages, setMessages] = useState([
    { role: "assistant", content: greeting, structured: null },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [readingIdx, setReadingIdx] = useState(null);
  const [detectedLang, setDetectedLang] = useState(lang);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, interimTranscript]);

  const handleSend = async (text) => {
    const message = text || input;
    if (!message.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: message, structured: null }]);
    setInput("");
    setLoading(true);

    try {
      const prompt = buildCaseworkerPrompt(message, lang);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 45000)
      );

      const response = await Promise.race([
        base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: caseworkerResponseSchema,
        }),
        timeoutPromise,
      ]);

      const data = response.data || response;
      if (data && data.detected_language && data.detected_language !== detectedLang) {
        setDetectedLang(data.detected_language);
      }

      const intro = (data && data.greeting) || "";
      const summary = (data && data.summary) || "";
      const schemes = (data && data.recommended_schemes) || [];

      if (!intro && !summary && schemes.length === 0) {
        throw new Error("Empty response from AI");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: intro + (summary ? "\n\n" + summary : ""),
          structured: data,
          detectedLang: (data && data.detected_language) || lang,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            lang === "ta"
              ? "மன்னிக்கவும், தற்போது சேவையை பெற முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
              : lang === "hi"
              ? "क्षमा करें, अभी सेवा उपलब्ध नहीं है। कृपया थोड़ी देर बाद पुनः प्रयास करें।"
              : "Sorry, I couldn't process your request right now. Please try again in a moment.",
          structured: null,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(lang, (transcript) => {
        handleSend(transcript);
      });
    }
  };

  const readMessage = (msg, idx) => {
    const speakLang = msg.detectedLang || lang;
    speak(msg.content, speakLang);
    setReadingIdx(idx);
  };

  const stopReading = () => {
    stop();
    setReadingIdx(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader title={t("page.chat.title")} subtitle={t("page.chat.subtitle")} icon="MessageCircle" badges>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
          <Icon name="Sparkles" className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">AI Digital Caseworker</span>
        </div>
      </PageHeader>

      <GlassCard className="flex-1 flex flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              index={i}
              isReading={readingIdx === i && isSpeaking}
              onRead={() => readMessage(msg, i)}
              onStop={stopReading}
              detectedLang={detectedLang}
            />
          ))}
          {loading && <ThinkingIndicator />}
          {isListening && interimTranscript && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <div className="bg-primary/10 text-primary rounded-2xl rounded-tr-sm px-4 py-2 text-sm italic">
                {interimTranscript}...
              </div>
            </motion.div>
          )}
        </div>

        {/* Natural language examples */}
        {messages.length <= 1 && !loading && (
          <div className="px-4 lg:px-6 pb-3">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <Icon name="Lightbulb" className="w-3.5 h-3.5" />
              {t("chat.suggested")} — {t("chat.naturalLanguage")}
            </div>
            <div className="flex flex-wrap gap-2">
              {examples.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-primary/5 hover:text-primary text-sm text-muted-foreground transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-200/70 p-4">
          <div className="flex items-end gap-2 sm:gap-3">
            <VoiceInputButton
              isListening={isListening}
              onToggle={handleVoiceToggle}
              interimTranscript={interimTranscript}
              sttSupported={sttSupported}
            />
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t("chat.placeholder")}
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl gradient-brand text-white flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-primary/30 transition-all shrink-0"
            >
              <Icon name="Send" className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Icon name="ShieldCheck" className="w-3 h-3" />
              {t("chat.disclaimer")}
            </p>
            {detectedLang !== lang && (
              <span className="text-[11px] text-primary flex items-center gap-1">
                <Icon name="Languages" className="w-3 h-3" />
                Auto-detected: {detectedLang}
              </span>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function MessageBubble({ message, index, isReading, onRead, onStop, detectedLang }) {
  const isUser = message.role === "user";
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Icon name="Bot" className="w-5 h-5 text-white" />
        </div>
      )}
      <div className={cn("max-w-[85%] lg:max-w-[75%]", isUser && "order-first")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-slate-50 text-foreground rounded-tl-sm border border-slate-100"
        )}>
          {isUser ? message.content : <ReactMarkdown className="prose prose-sm max-w-none">{message.content}</ReactMarkdown>}
        </div>
        {!isUser && message.content && (
          <div className="mt-2">
            <VoiceButton
              isSpeaking={isReading}
              onPlay={onRead}
              onStop={onStop}
              label={t("voice.readAloud")}
            />
          </div>
        )}
        {message.structured && message.structured.recommended_schemes && (
          <StructuredRecommendations data={message.structured} />
        )}
      </div>
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
          <Icon name="User" className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </motion.div>
  );
}

function StructuredRecommendations({ data }) {
  const schemes = data.recommended_schemes || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mt-3 space-y-4"
    >
      {/* Total benefit summary */}
      {data.total_estimated_benefit && (
        <div className="rounded-2xl gradient-brand p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Icon name="Wallet" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-white/80 uppercase tracking-wide">Total Estimated Benefit</div>
              <div className="text-lg font-bold">{data.total_estimated_benefit}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/80">{schemes.length} schemes</div>
            <div className="text-xs text-white/80">recommended</div>
          </div>
        </div>
      )}

      {/* Intent */}
      {data.intent_summary && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
          <Icon name="Brain" className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs text-foreground">
            <span className="font-medium text-primary">AI understood: </span>
            {data.intent_summary}
          </span>
        </div>
      )}

      {/* Scheme cards */}
      {schemes.map((scheme, i) => (
        <SchemeCard key={i} scheme={scheme} index={i} />
      ))}

      {/* Trust badges */}
      <div className="flex justify-center">
        <TrustBadges compact />
      </div>

      {/* Audit log */}
      {data.audit_log_id && (
        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
          <Icon name="FileClock" className="w-3 h-3" />
          Audit Log: {data.audit_log_id}
          {data.rule_engine_validation && (
            <>
              <span className="mx-1">•</span>
              <Icon name="GitBranch" className="w-3 h-3" />
              {data.rule_engine_validation}
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

function ThinkingIndicator() {
  const { t } = useI18n();
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
        <Icon name="Bot" className="w-5 h-5 text-white" />
      </div>
      <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 rounded-full bg-primary/40"
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{t("chat.thinking")}</span>
        </div>
      </div>
    </div>
  );
}