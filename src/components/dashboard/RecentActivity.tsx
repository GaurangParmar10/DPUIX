"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HistoryService, HistoryItem } from "@/lib/services/HistoryService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { useAccessibility } from "@/context/AccessibilityContext";
import { History, ArrowRight, ChevronRight } from "lucide-react";

export const RecentActivity: React.FC = () => {
  const router = useRouter();
  const { t } = useAccessibility();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const list = HistoryService.getHistory();
    setHistoryItems(list.slice(0, 3));
  }, []);

  const riskLevelMap = {
    LOW: "low",
    CAUTION: "medium",
    HIGH: "high",
    SUSPICIOUS: "high",
    UNKNOWN: "medium",
  } as const;

  return (
    <section className="space-y-4 py-2 border-t border-navy-700/60 pt-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-tealAccent" />
          <h2 className="text-xl sm:text-2xl font-bold text-slateText-primary">
            {t("recentlyUnderstood")}
          </h2>
        </div>

        {historyItems.length > 0 && (
          <button
            type="button"
            onClick={() => router.push("/history")}
            className="text-xs font-semibold text-tealAccent hover:underline flex items-center gap-1 touch-target min-h-[40px]"
          >
            <span>{t("viewAllExplanations")} ({HistoryService.getHistory().length})</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <Card className="p-8 text-center space-y-4 border border-navy-700 bg-navy-800/80">
          <div className="h-14 w-14 rounded-2xl bg-navy-900 border border-navy-700 text-slateText-muted flex items-center justify-center mx-auto">
            <History className="h-7 w-7 text-tealAccent" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slateText-primary">{t("emptyHistoryTitle")}</h3>
            <p className="text-sm text-slateText-secondary leading-relaxed">
              {t("emptyHistoryDesc")}
            </p>
          </div>

          <div className="pt-2 max-w-xs mx-auto">
            <Button
              variant="outline"
              size="sm"
              fullWidth
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={() => router.push("/understand")}
            >
              {t("btnUnderstandScreen")}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3 animate-in fade-in duration-200">
          {historyItems.map((item) => (
            <Card
              key={item.id}
              variant="hoverable"
              interactive
              onClick={() => router.push("/history")}
              className="p-4 flex items-center justify-between gap-4 border border-navy-700 hover:border-tealAccent/40"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slateText-primary">{item.title}</span>
                  <RiskIndicator level={riskLevelMap[item.riskLevel] || "medium"} size="sm" showExplanation={false} />
                </div>
                <p className="text-xs text-slateText-secondary">{item.createdAt} • {item.category}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slateText-muted" />
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};
