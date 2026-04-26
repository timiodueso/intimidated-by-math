"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Voice = "mild" | "neutral" | "sarcastic";

const VoiceContext = createContext<{
  voice: Voice;
  setVoice: (v: Voice) => void;
}>({ voice: "sarcastic", setVoice: () => {} });

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [voice, setVoiceState] = useState<Voice>("sarcastic");

  useEffect(() => {
    const stored = localStorage.getItem("itbm_voice") as Voice | null;
    if (stored) setVoiceState(stored);
  }, []);

  const setVoice = (v: Voice) => {
    setVoiceState(v);
    localStorage.setItem("itbm_voice", v);
  };

  return (
    <VoiceContext.Provider value={{ voice, setVoice }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  return useContext(VoiceContext);
}
