"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { useAccessibility, LanguageOption } from "@/context/AccessibilityContext";
import {
  Settings,
  Globe,
  Type,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { textScale, setTextScale, highContrast, toggleHighContrast, language, setLanguage, t } =
    useAccessibility();

  const languages: { code: LanguageOption; name: string }[] = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिंदी)" },
    { code: "mr", name: "Marathi (मराठी)" },
    { code: "bn", name: "Bengali (বাংলা)" },
    { code: "ta", name: "Tamil (தமிழ்)" },
    { code: "es", name: "Spanish (Español)" },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-navy-800 border border-navy-700 rounded-2xl p-6 sm:p-8 space-y-4 shadow-card">
        <div className="flex items-center gap-3 border-b border-navy-700 pb-4">
          <div className="h-12 w-12 rounded-xl bg-tealAccent/15 text-tealAccent flex items-center justify-center shadow-sm">
            <Settings className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight">
              {t("settingsTitle")}
            </h1>
            <p className="text-xs sm:text-sm text-slateText-secondary">
              {t("settingsSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Viewing & Accessibility Controls */}
      <Card className="p-6 sm:p-8 space-y-6 border border-navy-700 bg-navy-800 shadow-xl rounded-2xl">
        <div className="flex items-center gap-2 border-b border-navy-700 pb-3">
          <Type className="h-5 w-5 text-tealAccent" />
          <h2 className="text-lg font-bold text-slateText-primary">{t("textSizeLabel")}</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            {/* Visual A A A buttons matching Requirement 6 */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setTextScale("normal")}
                aria-label="Small text size"
                className={cn(
                  "touch-target min-h-[48px] p-3 rounded-xl font-bold border transition-all flex items-center justify-center",
                  textScale === "normal"
                    ? "bg-tealAccent text-navy-950 border-tealAccent shadow-md"
                    : "bg-navy-900 border-navy-700 text-slateText-secondary hover:bg-navy-750"
                )}
              >
                <span className="text-xs font-extrabold">A</span>
              </button>

              <button
                type="button"
                onClick={() => setTextScale("large")}
                aria-label="Medium text size"
                className={cn(
                  "touch-target min-h-[48px] p-3 rounded-xl font-bold border transition-all flex items-center justify-center",
                  textScale === "large"
                    ? "bg-tealAccent text-navy-950 border-tealAccent shadow-md"
                    : "bg-navy-900 border-navy-700 text-slateText-secondary hover:bg-navy-750"
                )}
              >
                <span className="text-base font-extrabold">A</span>
              </button>

              <button
                type="button"
                onClick={() => setTextScale("xlarge")}
                aria-label="Large text size"
                className={cn(
                  "touch-target min-h-[48px] p-3 rounded-xl font-bold border transition-all flex items-center justify-center",
                  textScale === "xlarge"
                    ? "bg-tealAccent text-navy-950 border-tealAccent shadow-md"
                    : "bg-navy-900 border-navy-700 text-slateText-secondary hover:bg-navy-750"
                )}
              >
                <span className="text-xl font-black">A</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-navy-750 flex-wrap gap-3">
            <div>
              <p className="text-base font-bold text-slateText-primary">{t("highContrastLabel")}</p>
              <p className="text-xs text-slateText-muted">{t("highContrastSub")}</p>
            </div>
            <button
              type="button"
              onClick={toggleHighContrast}
              className={cn(
                "touch-target min-h-[44px] px-5 py-2 rounded-xl font-bold border transition-all text-sm",
                highContrast
                  ? "bg-amber-400 text-navy-950 border-amber-400"
                  : "bg-navy-900 border-navy-700 text-slateText-secondary"
              )}
            >
              {highContrast ? t("btnActiveContrast") : t("btnEnableContrast")}
            </button>
          </div>
        </div>
      </Card>

      {/* Language Selection */}
      <Card className="p-6 sm:p-8 space-y-4 border border-navy-700 bg-navy-800 shadow-xl rounded-2xl">
        <div className="flex items-center gap-2 border-b border-navy-700 pb-3">
          <Globe className="h-5 w-5 text-tealAccent" />
          <h2 className="text-lg font-bold text-slateText-primary">{t("languageLabel")}</h2>
        </div>

        <p className="text-xs sm:text-sm text-slateText-secondary">
          {t("languageSub")}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "touch-target min-h-[48px] p-3 rounded-xl font-semibold border text-left transition-all text-sm flex items-center justify-between",
                language === lang.code
                  ? "bg-tealAccent/20 border-tealAccent text-tealAccent font-bold"
                  : "bg-navy-900 border-navy-700 text-slateText-secondary hover:bg-navy-750"
              )}
            >
              <span>{lang.name}</span>
              {language === lang.code && <span className="text-xs font-bold text-tealAccent">✓</span>}
            </button>
          ))}
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card className="p-6 space-y-3 border border-tealAccent/30 bg-navy-850 text-slateText-secondary rounded-2xl">
        <div className="flex items-center gap-2 text-tealAccent font-bold text-base">
          <Lock className="h-5 w-5" />
          <span>{t("privacyLabel")}</span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed">
          {t("privacySub")}
        </p>
      </Card>
    </div>
  );
}
