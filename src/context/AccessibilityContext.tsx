"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { t, TranslationKeys } from "@/locales";
import { StructuredAnalysisResponse } from "@/types/analysis";

export type TextScale = "normal" | "large" | "xlarge";
export type LanguageOption = "en" | "hi" | "es" | "bn" | "mr" | "ta";

export interface LanguageMeta {
  code: LanguageOption;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
  { code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
];

const LOCALE_MAP: Record<LanguageOption, string> = {
  en: "en-US",
  hi: "hi-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  es: "es-ES",
};

interface AccessibilityContextType {
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  voicePlayback: boolean;
  setVoicePlayback: (enabled: boolean) => void;
  toggleVoicePlayback: () => void;
  magnifierEnabled: boolean;
  setMagnifierEnabled: (enabled: boolean) => void;
  toggleMagnifier: () => void;
  magnifierZoom: number;
  setMagnifierZoom: (zoom: number) => void;
  magnifierSize: number;
  setMagnifierSize: (size: number) => void;
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => void;
  isSpeaking: boolean;
  speakText: (text: string, overrideLang?: LanguageOption) => void;
  speakActionGuidance: (analysis: StructuredAnalysisResponse) => void;
  stopSpeaking: () => void;
  t: (key: TranslationKeys) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textScale, setTextScaleState] = useState<TextScale>("normal");
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [voicePlayback, setVoicePlayback] = useState<boolean>(true);
  const [magnifierEnabled, setMagnifierEnabledState] = useState<boolean>(false);
  const [magnifierZoom, setMagnifierZoom] = useState<number>(2.0);
  const [magnifierSize, setMagnifierSize] = useState<number>(180);
  const [language, setLanguageState] = useState<LanguageOption>("en");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Sync state with HTML & localStorage
  useEffect(() => {
    const savedScale = (localStorage.getItem("db_text_scale") as TextScale) || "normal";
    const savedContrast = localStorage.getItem("db_high_contrast") === "true";
    const savedVoice = localStorage.getItem("db_voice") !== "false";
    const savedMag = localStorage.getItem("db_magnifier") === "true";
    const savedLang = (localStorage.getItem("db_lang") as LanguageOption) || "en";

    setTextScaleState(savedScale);
    setHighContrastState(savedContrast);
    setVoicePlayback(savedVoice);
    setMagnifierEnabledState(savedMag);
    setLanguageState(savedLang);

    document.documentElement.setAttribute("data-text-scale", savedScale);
    if (savedContrast) {
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  const setTextScale = (scale: TextScale) => {
    setTextScaleState(scale);
    localStorage.setItem("db_text_scale", scale);
    document.documentElement.setAttribute("data-text-scale", scale);
  };

  const increaseTextSize = () => {
    if (textScale === "normal") setTextScale("large");
    else if (textScale === "large") setTextScale("xlarge");
  };

  const decreaseTextSize = () => {
    if (textScale === "xlarge") setTextScale("large");
    else if (textScale === "large") setTextScale("normal");
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem("db_high_contrast", String(enabled));
    if (enabled) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const toggleHighContrast = () => setHighContrast(!highContrast);

  const setMagnifierEnabled = (enabled: boolean) => {
    setMagnifierEnabledState(enabled);
    localStorage.setItem("db_magnifier", String(enabled));
  };

  const toggleMagnifier = () => setMagnifierEnabled(!magnifierEnabled);

  const setLanguage = (lang: LanguageOption) => {
    setLanguageState(lang);
    localStorage.setItem("db_lang", lang);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoicePlayback = () => {
    const next = !voicePlayback;
    setVoicePlayback(next);
    localStorage.setItem("db_voice", String(next));
    if (!next && isSpeaking) {
      stopSpeaking();
    }
  };

  const translate = (key: TranslationKeys): string => {
    return t(language, key);
  };

  const speakText = (text: string, overrideLang?: LanguageOption) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    if (!text || !voicePlayback) return;

    const targetLang = overrideLang || language;
    const targetLocale = LOCALE_MAP[targetLang] || "en-US";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLocale;
    utterance.rate = 0.9; // Calm reading pace
    utterance.pitch = 1.0;

    // Find best voice matching target language in browser voice registry
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const targetLangCode = targetLang.toLowerCase();
      const targetLocaleTag = targetLocale.toLowerCase().replace("_", "-");

      const matchingVoice =
        voices.find((v) => v.lang.toLowerCase().replace("_", "-") === targetLocaleTag) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLangCode));

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  /**
   * Focused Voice Experience: Speaks ONLY direct answer + action steps + warning in selected language.
   * NEVER reads navbar, page title, detected elements, or decorative UI content.
   */
  const speakActionGuidance = (analysis: StructuredAnalysisResponse) => {
    if (!voicePlayback) return;

    const mainAnswer = analysis.directAnswer || analysis.summary || "";
    const primaryReason = analysis.riskReasons?.[0] ? `${analysis.riskReasons[0]}.` : "";
    const stepsText =
      analysis.recommendedActions && analysis.recommendedActions.length > 0
        ? analysis.recommendedActions.join(". ")
        : "";
    const warningText = analysis.prohibitedActions?.[0] ? `${analysis.prohibitedActions[0]}` : "";

    const speechScript = [mainAnswer, primaryReason, stepsText, warningText]
      .filter(Boolean)
      .join(". ");

    speakText(speechScript);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textScale,
        setTextScale,
        increaseTextSize,
        decreaseTextSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        voicePlayback,
        setVoicePlayback,
        toggleVoicePlayback,
        magnifierEnabled,
        setMagnifierEnabled,
        toggleMagnifier,
        magnifierZoom,
        setMagnifierZoom,
        magnifierSize,
        setMagnifierSize,
        language,
        setLanguage,
        isSpeaking,
        speakText,
        speakActionGuidance,
        stopSpeaking,
        t: translate,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
