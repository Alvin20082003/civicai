import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export default function VoiceInputButton({ isListening, onToggle, interimTranscript, sttSupported }) {
  if (!sttSupported) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all",
          isListening
            ? "bg-destructive text-white shadow-lg shadow-destructive/30"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        title={isListening ? "Stop listening" : "Speak naturally"}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Icon name="Square" className="w-5 h-5" fill="currentColor" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Icon name="Mic" className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 12, 4] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-1 rounded-full bg-destructive"
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}