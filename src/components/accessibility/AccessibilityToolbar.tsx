"use client";

import React from "react";
import { useAccessibility, SUPPORTED_LANGUAGES, LanguageOption } from "@/context/AccessibilityContext";
import { Volume2, VolumeX, Eye, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export const AccessibilityToolbar: React.FC = () => {
  const {
    textScale,
    setTextScale,
    highContrast,
    toggleHighContrast,
    voicePlayback,
    toggleVoicePlayback,
    language,
    setLanguage,
    t,
  } = useAccessibility();

  return (
    <div
      role="region"
      aria-label="Accessibility & Viewing Tools"
      className="w-full flex items-center justify-end flex-wrap gap-2 text-xs text-slateText-secondary"
    >
      {/* 1. VISUAL TEXT-SIZE CONTROLS: A  A  A (No words "Small", "Medium", "Large") */}
      <div className="flex items-center gap-1 bg-navy-800 p-1 rounded-xl border border-navy-700 shadow-sm">
        {/* Small Visual A */}
        <button
          type="button"
          onClick={() => setTextScale("normal")}
          aria-label="Small text size"
          title="Small text size"
          className={cn(
            "touch-target min-h-[44px] min-w-[44px] px-3 rounded-lg font-bold transition-all flex items-center justify-center",
            textScale === "normal"
              ? "bg-tealAccent text-navy-950 shadow-sm"
              : "text-slateText-secondary hover:text-slateText-primary hover:bg-navy-750"
          )}
        >
          <span className="text-xs font-extrabold leading-none">A</span>
        </button>

        {/* Medium Visual A */}
        <button
          type="button"
          onClick={() => setTextScale("large")}
          aria-label="Medium text size"
          title="Medium text size"
          className={cn(
            "touch-target min-h-[44px] min-w-[44px] px-3 rounded-lg font-bold transition-all flex items-center justify-center",
            textScale === "large"
              ? "bg-tealAccent text-navy-950 shadow-sm"
              : "text-slateText-secondary hover:text-slateText-primary hover:bg-navy-750"
          )}
        >
          <span className="text-base font-extrabold leading-none">A</span>
        </button>

        {/* Large Visual A */}
        <button
          type="button"
          onClick={() => setTextScale("xlarge")}
          aria-label="Large text size"
          title="Large text size"
          className={cn(
            "touch-target min-h-[44px] min-w-[44px] px-3 rounded-lg font-bold transition-all flex items-center justify-center",
            textScale === "xlarge"
              ? "bg-tealAccent text-navy-950 shadow-sm"
              : "text-slateText-secondary hover:text-slateText-primary hover:bg-navy-750"
          )}
        >
          <span className="text-xl font-black leading-none">A</span>
        </button>
      </div>

      {/* 2. High Contrast Toggle */}
      <button
        type="button"
        onClick={toggleHighContrast}
        aria-pressed={highContrast}
        aria-label="Toggle high contrast mode"
        className={cn(
          "touch-target min-h-[44px] px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5",
          highContrast
            ? "bg-amber-400 text-navy-950 border-amber-400 shadow-sm"
            : "bg-navy-800 border-navy-700 text-slateText-secondary hover:text-slateText-primary hover:bg-navy-750"
        )}
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{highContrast ? "Contrast On" : "Contrast"}</span>
      </button>

      {/* 3. Voice Toggle Button: 🔊 Hear what to do / Voice */}
      <button
        type="button"
        onClick={toggleVoicePlayback}
        aria-pressed={voicePlayback}
        aria-label="Toggle voice guidance"
        className={cn(
          "touch-target min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5",
          voicePlayback
            ? "bg-navy-800 border-tealAccent/40 text-tealAccent"
            : "bg-navy-800 border-navy-700 text-slateText-muted"
        )}
      >
        {voicePlayback ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        <span>{voicePlayback ? "🔊 Voice" : "Voice Off"}</span>
      </button>

      {/* 4. Language Selector */}
      <div className="flex items-center gap-1 bg-navy-800 px-2.5 py-1.5 rounded-xl border border-navy-700">
        <Globe className="h-3.5 w-3.5 text-tealAccent" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as LanguageOption)}
          aria-label={t("accLanguage")}
          className="bg-transparent text-xs font-bold text-slateText-primary focus:outline-none cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-navy-900 text-slateText-primary">
              {lang.nativeLabel}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
