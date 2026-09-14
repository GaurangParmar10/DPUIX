"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Lightbulb, ArrowRight } from "lucide-react";

export const DailySafetyTip: React.FC = () => {
  const { t } = useAccessibility();
  const [tipKey, setTipKey] = useState<"tip1" | "tip2" | "tip3" | "tip4" | "tip5">("tip1");

  useEffect(() => {
    // Deterministic date seed for daily rotating tip
    const todayStr = new Date().toISOString().slice(0, 10);
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const idx = (Math.abs(hash) % 5) + 1;
    setTipKey(`tip${idx}` as any);
  }, []);

  return (
    <section className="pt-2">
      <Link href="/learn" className="block group focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-tealAccent rounded-2xl">
        <Card className="p-6 bg-navy-800 border border-navy-700 hover:border-tealAccent/40 transition-all rounded-2xl shadow-md group-hover:shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-tealAccent/15 text-tealAccent flex items-center justify-center shrink-0 shadow-sm">
              <Lightbulb className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-tealAccent flex items-center gap-1.5">
                <span>💡</span> {t("todaysSafetyTipHeader")}
              </span>
              <p className="text-sm sm:text-base font-bold text-slateText-primary leading-relaxed">
                &quot;{t(tipKey)}&quot;
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end sm:self-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-tealAccent group-hover:underline touch-target min-h-[44px] px-3 py-2 rounded-xl bg-navy-900 border border-navy-750">
              <span>{t("learnWhyAction")}</span>
            </span>
          </div>
        </Card>
      </Link>
    </section>
  );
};
