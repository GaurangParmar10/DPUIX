"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";

export type RiskLevel = "low" | "medium" | "high";

export interface RiskIndicatorProps {
  level: RiskLevel;
  customExplanation?: string;
  showExplanation?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({
  level,
  customExplanation,
  showExplanation = true,
  size = "md",
  className,
}) => {
  const { t } = useAccessibility();

  const meta = {
    low: {
      label: t("riskLowBadge"),
      humanTitle: t("riskLowHumanTitle"),
      defaultExplanation: t("riskLowDefaultExp"),
      badgeBg: "bg-risk-low-bg border-risk-low-border text-risk-low-text font-black",
      cardBg: "bg-risk-low-bg/90 border-2 border-risk-low-border shadow-lg shadow-emerald-950/20",
      iconBg: "bg-risk-low-text/15 text-risk-low-text border border-risk-low-border",
      Icon: ShieldCheck,
    },
    medium: {
      label: t("riskMediumBadge"),
      humanTitle: t("riskMediumHumanTitle"),
      defaultExplanation: t("riskMediumDefaultExp"),
      badgeBg: "bg-risk-warning-bg border-risk-warning-border text-risk-warning-text font-black",
      cardBg: "bg-risk-warning-bg/90 border-2 border-risk-warning-border shadow-lg shadow-amber-950/20",
      iconBg: "bg-risk-warning-text/15 text-risk-warning-text border border-risk-warning-border",
      Icon: AlertTriangle,
    },
    high: {
      label: t("riskHighBadge"),
      humanTitle: t("riskHighHumanTitle"),
      defaultExplanation: t("riskHighDefaultExp"),
      badgeBg: "bg-risk-high-bg border-risk-high-border text-risk-high-text font-black",
      cardBg: "bg-risk-high-bg/90 border-2 border-risk-high-border shadow-lg shadow-red-950/30",
      iconBg: "bg-risk-high-text/15 text-risk-high-text border border-risk-high-border",
      Icon: ShieldAlert,
    },
  }[level];

  const Icon = meta.Icon;

  if (size === "sm") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black tracking-wider uppercase",
          meta.badgeBg,
          className
        )}
      >
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{meta.label}</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 md:p-6 transition-all duration-200 shadow-card flex flex-col md:flex-row gap-5 items-start",
        meta.cardBg,
        className
      )}
      role="region"
      aria-label={`Safety assessment: ${meta.label}`}
    >
      <div className={cn("p-3.5 rounded-2xl shrink-0 flex items-center justify-center shadow-sm", meta.iconBg)}>
        <Icon className="h-8 w-8 shrink-0" aria-hidden="true" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={cn("px-3.5 py-1 rounded-xl border text-xs font-black uppercase tracking-wider", meta.badgeBg)}>
            {meta.label}
          </span>
          <h4 className="text-xl font-extrabold text-slateText-primary tracking-tight">{meta.humanTitle}</h4>
        </div>

        {showExplanation && (
          <p className="text-base sm:text-lg text-slateText-primary leading-relaxed font-medium pt-0.5">
            {customExplanation || meta.defaultExplanation}
          </p>
        )}
      </div>
    </div>
  );
};
