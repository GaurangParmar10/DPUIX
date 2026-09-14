"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAccessibility, SUPPORTED_LANGUAGES, LanguageOption } from "@/context/AccessibilityContext";
import { Sliders, Eye, Volume2, VolumeX, Globe, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Compact Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={t("accessibilityDrawerTitle")}
        className={cn(
          "touch-target min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 shadow-sm",
          isOpen
            ? "bg-tealAccent text-navy-950 border-tealAccent"
            : "bg-navy-800 border-navy-700 text-slateText-secondary hover:text-slateText-primary hover:bg-navy-750"
        )}
      >
        <Sliders className="h-4 w-4 shrink-0 text-tealAccent" />
        <span className="hidden md:inline font-bold">{t("btnAccessibilityTrigger")}</span>
      </button>

      {/* Popover Menu Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-navy-800 border border-navy-700 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4">
          <div className="flex items-center justify-between border-b border-navy-700 pb-2.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-tealAccent">
              {t("accessibilityDrawerTitle")}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slateText-muted hover:text-slateText-primary hover:bg-navy-750"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 1. VISUAL TEXT-SIZE CONTROLS: A A A */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slateText-secondary block">{t("textSizeTitle")}</span>
            <div className="grid grid-cols-3 gap-2 bg-navy-900 p-1 rounded-xl border border-navy-750">
              <button
                type="button"
                onClick={() => setTextScale("normal")}
                aria-label="Small text size"
                className={cn(
                  "touch-target min-h-[40px] rounded-lg font-bold transition-all flex items-center justify-center",
                  textScale === "normal"
                    ? "bg-tealAccent text-navy-950 shadow-sm"
                    : "text-slateText-secondary hover:text-slateText-primary"
                )}
              >
                <span className="text-xs font-extrabold">A</span>
              </button>

              <button
                type="button"
                onClick={() => setTextScale("large")}
                aria-label="Medium text size"
                className={cn(
                  "touch-target min-h-[40px] rounded-lg font-bold transition-all flex items-center justify-center",
                  textScale === "large"
                    ? "bg-tealAccent text-navy-950 shadow-sm"
                    : "text-slateText-secondary hover:text-slateText-primary"
                )}
              >
                <span className="text-base font-extrabold">A</span>
              </button>

              <button
                type="button"
                onClick={() => setTextScale("xlarge")}
                aria-label="Large text size"
                className={cn(
                  "touch-target min-h-[40px] rounded-lg font-bold transition-all flex items-center justify-center",
                  textScale === "xlarge"
                    ? "bg-tealAccent text-navy-950 shadow-sm"
                    : "text-slateText-secondary hover:text-slateText-primary"
                )}
              >
                <span className="text-xl font-black">A</span>
              </button>
            </div>
          </div>

          {/* 2. High Contrast & Voice Controls */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={toggleHighContrast}
              className={cn(
                "touch-target min-h-[40px] px-2 py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1",
                highContrast
                  ? "bg-amber-400 text-navy-950 border-amber-400 shadow-sm"
                  : "bg-navy-900 border-navy-750 text-slateText-secondary hover:text-slateText-primary"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{t("contrastLabel")}</span>
            </button>

            <button
              type="button"
              onClick={toggleVoicePlayback}
              className={cn(
                "touch-target min-h-[40px] px-2 py-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1",
                voicePlayback
                  ? "bg-navy-900 border-goldAccent/40 text-goldAccent"
                  : "bg-navy-900 border-navy-750 text-slateText-muted"
              )}
            >
              {voicePlayback ? <Volume2 className="h-3.5 w-3.5 text-goldAccent" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span>{voicePlayback ? t("voiceOnLabel") : t("voiceOffLabel")}</span>
            </button>
          </div>

          {/* 3. Language Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slateText-secondary block">{t("accLanguage")}</span>
            <div className="flex items-center gap-2 bg-navy-900 px-3 py-2 rounded-xl border border-navy-750">
              <Globe className="h-4 w-4 text-tealAccent shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageOption)}
                aria-label={t("accLanguage")}
                className="bg-transparent text-xs font-bold text-slateText-primary focus:outline-none cursor-pointer w-full"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-navy-900 text-slateText-primary">
                    {lang.nativeLabel} ({lang.label})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
