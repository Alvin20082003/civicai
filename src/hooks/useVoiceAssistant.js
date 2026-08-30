import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Browser-based voice assistant with BOTH:
 *  - Text-to-Speech (speak) via SpeechSynthesis API
 *  - Speech-to-Text (listen) via SpeechRecognition API
 * Supports Tamil (ta-IN) and English (en-US).
 */
export function useVoiceAssistant() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const voicesRef = useRef([]);
  const recognitionRef = useRef(null);

  // --- TTS Setup ---
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    setSupported(true);

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      window.speechSynthesis.cancel();
    };
  }, []);

  const pickVoice = useCallback((lang) => {
    const langCode = lang || "en";
    const voices = voicesRef.current;
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith(langCode + "-")) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(langCode)) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(langCode.substring(0, 2))) ||
      null
    );
  }, []);

  const speak = useCallback(
    (text, lang = "en") => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(lang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        const langMap = {
          en: "en-IN", ta: "ta-IN", hi: "hi-IN", te: "te-IN",
          ml: "ml-IN", kn: "kn-IN", bn: "bn-IN", mr: "mr-IN",
          gu: "gu-IN", pa: "pa-IN", ur: "ur-IN", or: "or-IN", as: "as-IN",
        };
        utterance.lang = langMap[lang] || "en-IN";
      }
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [supported, pickVoice]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);

  // --- STT Setup ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    setSttSupported(true);
  }, []);

  const startListening = useCallback((lang = "en", onResult, onError) => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError("not-supported");
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* noop */ }
    }

    const recognition = new SpeechRecognition();
    const langMap = {
      en: "en-IN", ta: "ta-IN", hi: "hi-IN", te: "te-IN",
      ml: "ml-IN", kn: "kn-IN", bn: "bn-IN", mr: "mr-IN",
      gu: "gu-IN", pa: "pa-IN", ur: "ur-IN", or: "or-IN", as: "as-IN",
    };
    recognition.lang = langMap[lang] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    setTranscript("");
    setInterimTranscript("");
    setIsListening(true);

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      if (interimText) setInterimTranscript(interimText);
      if (finalText) {
        setTranscript(finalText);
        setInterimTranscript("");
        if (onResult) onResult(finalText.trim());
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setInterimTranscript("");
      if (onError) onError(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* noop */ }
    }
    setIsListening(false);
  }, []);

  return {
    speak, stop, isSpeaking, supported,
    startListening, stopListening, isListening, transcript, interimTranscript, sttSupported,
  };
}