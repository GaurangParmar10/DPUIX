"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Image as ImageIcon, ArrowRight, ShieldCheck } from "lucide-react";

export const PrimaryActionHero: React.FC = () => {
  const router = useRouter();
  const { t } = useAccessibility();

  return (
    <Card
      variant="highlight"
      className="p-6 sm:p-8 md:p-10 space-y-6 bg-navy-800 border border-navy-700 rounded-2xl shadow-xl relative overflow-hidden"
    >
      <div className="space-y-3 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slateText-primary tracking-tight leading-tight">
          {t("btnUnderstandScreen")}
        </h2>
        <p className="text-base sm:text-lg text-slateText-secondary leading-relaxed">
          {t("dashboardSubtitle")}
        </p>
      </div>

      {/* Main Interactive Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          rightIcon={<ArrowRight className="h-5 w-5" />}
          onClick={() => router.push("/understand")}
          className="text-lg py-4 shadow-xl shadow-tealAccent/20"
        >
          {t("btnUnderstandScreen")}
        </Button>
      </div>

      {/* Quick Option Shortcut */}
      <div className="pt-2 border-t border-navy-700/80 flex items-center justify-between flex-wrap gap-3 text-xs sm:text-sm text-slateText-muted">
        <button
          type="button"
          onClick={() => router.push("/understand")}
          className="flex items-center gap-2 hover:text-tealAccent transition-colors touch-target min-h-[40px]"
        >
          <ImageIcon className="h-4 w-4 text-tealAccent" />
          <span>{t("btnChooseFromPhotos")}</span>
        </button>

        <div className="flex items-center gap-1.5 text-tealAccent font-semibold text-xs">
          <ShieldCheck className="h-4 w-4" />
          <span>{t("safePrivateConfidential")}</span>
        </div>
      </div>
    </Card>
  );
};
