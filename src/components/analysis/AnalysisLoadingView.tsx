"use client";

import React, { useEffect, useState } from "react";
import { Card3D } from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/Badge";
import { useAccessibility } from "@/context/AccessibilityContext";
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalysisLoadingViewProps {
  imageThumbnail?: string;
  className?: string;
}

export const AnalysisLoadingView: React.FC<AnalysisLoadingViewProps> = ({
  imageThumbnail,
  className,
}) => {
  const { t } = useAccessibility();
  const [currentStage, setCurrentStage] = useState<number>(1);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStage(2), 1200);
    const t2 = setTimeout(() => setCurrentStage(3), 2400);
    const t3 = setTimeout(() => setCurrentStage(4), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const stages = [
    { step: 1, label: t("loadingStage1") },
    { step: 2, label: t("loadingStage2") },
    { step: 3, label: t("loadingStage3") },
    { step: 4, label: t("loadingStage4") },
  ];

  return (
    <Card3D depth={14} glowColor="rgba(212, 175, 107, 0.35)" className={cn("p-6 sm:p-10 border-2 border-goldAccent/50 bg-navy-850 space-y-8 text-center max-w-2xl mx-auto rounded-3xl", className)}>
      <div className="space-y-3">
        <Badge variant="teal" icon={<ShieldCheck className="h-4 w-4 text-goldAccent" />}>
          DigitalBridge Intelligence
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-slateText-primary tracking-tight">
          {t("loadingTitle")}
        </h2>
        <p className="text-base text-slateText-secondary max-w-md mx-auto leading-relaxed">
          {t("loadingDesc")}
        </p>
      </div>

      {/* Screen Thumbnail Preview with Animated 3D Radar Beam */}
      {imageThumbnail && (
        <div className="relative w-full max-w-xs mx-auto h-44 rounded-2xl overflow-hidden border-2 border-goldAccent/60 bg-navy-950 flex items-center justify-center p-2 shadow-2xl [perspective:800px]">
          <img
            src={imageThumbnail}
            alt="Screen thumbnail being analyzed"
            className="max-h-40 w-auto object-contain rounded-xl opacity-90 transition-transform duration-500 hover:scale-105"
          />
          {/* Animated 3D Scanning Beam & Grid Sheen */}
          <div className="animate-radar-beam shadow-[0_0_24px_rgba(212,175,107,0.8)]" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-goldAccent/10 via-transparent to-goldAccent/10 pointer-events-none" />
        </div>
      )}

      {/* Stage Progress List */}
      <div className="space-y-3 max-w-md mx-auto text-left" role="status" aria-live="polite">
        {stages.map((st) => {
          const isDone = currentStage > st.step;
          const isCurrent = currentStage === st.step;

          return (
            <div
              key={st.step}
              className={cn(
                "p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300",
                isDone
                  ? "bg-tealAccent-bg border-tealAccent/40 text-tealAccent font-bold"
                  : isCurrent
                  ? "bg-navy-750 border-tealAccent text-slateText-primary font-extrabold shadow-md"
                  : "bg-navy-900/60 border-navy-700/60 text-slateText-muted opacity-60"
              )}
            >
              <div className="shrink-0 flex items-center justify-center">
                {isDone ? (
                  <CheckCircle2 className="h-6 w-6 text-tealAccent" />
                ) : isCurrent ? (
                  <Loader2 className="h-6 w-6 animate-spin text-tealAccent" />
                ) : (
                  <span className="h-6 w-6 rounded-full border-2 border-navy-600 text-xs flex items-center justify-center font-bold font-mono">
                    {st.step}
                  </span>
                )}
              </div>
              <span className="text-sm sm:text-base leading-snug font-bold">{st.label}</span>
            </div>
          );
        })}
      </div>
    </Card3D>
  );
};
