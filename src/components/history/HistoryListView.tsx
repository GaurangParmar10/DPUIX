"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HistoryService, HistoryItem } from "@/lib/services/HistoryService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { ActionGuidance } from "@/components/guidance/ActionGuidance";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  History,
  Trash2,
  Lock,
  ArrowRight,
  ChevronRight,
  X,
  Volume2,
  VolumeX,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const HistoryListView: React.FC = () => {
  const router = useRouter();
  const { t, speakActionGuidance, isSpeaking, stopSpeaking } = useAccessibility();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "SAVED">("ALL");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<HistoryItem | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  const loadHistory = () => {
    const list = HistoryService.getHistory();
    setItems(list);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDeleteItem = (id: string) => {
    HistoryService.deleteAnalysis(id);
    setItemToDelete(null);
    if (selectedItem?.id === id) setSelectedItem(null);
    loadHistory();
  };

  const handleToggleSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    HistoryService.toggleSaved(id);
    loadHistory();
  };

  const handleClearAll = () => {
    HistoryService.clearHistory();
    setShowClearAllModal(false);
    setSelectedItem(null);
    loadHistory();
  };

  const savedCount = items.filter((i) => i.isSaved).length;

  const tabFilteredItems = items.filter((item) => {
    if (activeTab === "SAVED") return item.isSaved;
    return true;
  });

  const filteredItems = tabFilteredItems.filter((item) => {
    if (filterRisk === "ALL") return true;
    return item.riskLevel === filterRisk;
  });

  const riskLevelMap = {
    LOW: "low",
    CAUTION: "medium",
    HIGH: "high",
    SUSPICIOUS: "high",
    UNKNOWN: "medium",
  } as const;

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-navy-800 border-2 border-navy-700 rounded-3xl p-6 sm:p-8 space-y-4 shadow-card-elevated">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-navy-700 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-tealAccent-bg border border-tealAccent/40 text-tealAccent flex items-center justify-center shadow-md">
              <History className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slateText-primary tracking-tight">
                {t("historyTitle")}
              </h1>
              <p className="text-sm text-slateText-secondary font-medium mt-0.5">
                {t("historySubtitle")}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setShowClearAllModal(true)}
              className="font-bold"
            >
              {t("btnClearAll")}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-tealAccent font-bold bg-navy-900 border border-navy-750 px-4 py-2.5 rounded-2xl">
          <Lock className="h-4 w-4 shrink-0" />
          <span>{t("historyPrivacyNote")}</span>
        </div>
      </div>

      {/* Primary View Tabs: Recent vs Saved for Later */}
      {items.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-navy-700 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={cn(
                "touch-target min-h-[48px] px-5 py-2.5 rounded-2xl text-sm font-black border-2 transition-all flex items-center gap-2 shadow-sm",
                activeTab === "ALL"
                  ? "bg-tealAccent text-navy-950 border-tealAccent"
                  : "bg-navy-800 border-navy-700 text-slateText-secondary hover:bg-navy-750"
              )}
            >
              <History className="h-4 w-4" />
              <span>{t("recentTab")} ({items.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("SAVED")}
              className={cn(
                "touch-target min-h-[48px] px-5 py-2.5 rounded-2xl text-sm font-black border-2 transition-all flex items-center gap-2 shadow-sm",
                activeTab === "SAVED"
                  ? "bg-tealAccent text-navy-950 border-tealAccent"
                  : "bg-navy-800 border-navy-700 text-slateText-secondary hover:bg-navy-750"
              )}
            >
              <Bookmark className="h-4 w-4" />
              <span>{t("savedForLaterTab")} ({savedCount})</span>
            </button>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {["ALL", "HIGH", "CAUTION", "LOW"].map((rk) => (
              <button
                key={rk}
                type="button"
                onClick={() => setFilterRisk(rk)}
                className={cn(
                  "touch-target min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border-2 uppercase tracking-wider",
                  filterRisk === rk
                    ? "bg-navy-750 border-tealAccent text-tealAccent"
                    : "bg-navy-900 border-navy-750 text-slateText-muted hover:text-slateText-primary"
                )}
              >
                {rk === "ALL" ? t("filterAll") : rk}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History Items List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              variant="hoverable"
              interactive
              onClick={() => setSelectedItem(item)}
              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-2 border-navy-700 hover:border-tealAccent/50 transition-all shadow-card group rounded-3xl"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="teal" size="sm">
                    {item.category}
                  </Badge>
                  <RiskIndicator level={riskLevelMap[item.riskLevel] || "medium"} size="sm" showExplanation={false} />
                  <span className="text-xs font-bold text-slateText-muted">{item.createdAt}</span>
                </div>

                <h3 className="text-xl font-black text-slateText-primary group-hover:text-tealAccent transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-slateText-secondary line-clamp-2 leading-relaxed font-medium">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={item.isSaved ? <BookmarkCheck className="h-4 w-4 text-tealAccent" /> : <Bookmark className="h-4 w-4 text-slateText-muted" />}
                  onClick={(e) => handleToggleSaved(item.id, e)}
                  title={item.isSaved ? t("savedBtn") : t("saveBtn")}
                  className="font-bold"
                >
                  {item.isSaved ? t("savedBtn") : t("saveBtn")}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Trash2 className="h-4 w-4 text-red-400" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setItemToDelete(item);
                  }}
                  title={t("btnDelete")}
                  className="font-bold"
                >
                  {t("btnDelete")}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                  onClick={() => setSelectedItem(item)}
                  className="font-bold"
                >
                  {t("btnViewExplanation")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <Card className="p-10 text-center space-y-6 border-2 border-navy-700 bg-navy-800 shadow-card max-w-2xl mx-auto rounded-3xl">
          <div className="h-20 w-20 rounded-3xl bg-navy-900 border-2 border-navy-700 text-tealAccent flex items-center justify-center mx-auto shadow-inner">
            <History className="h-10 w-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slateText-primary">
              {activeTab === "SAVED" ? t("noSavedTitle") : t("emptyHistoryTitle")}
            </h2>
            <p className="text-base text-slateText-secondary leading-relaxed font-medium">
              {activeTab === "SAVED"
                ? t("noSavedDesc")
                : t("emptyHistoryDesc")}
            </p>
          </div>

          <div className="pt-2 max-w-sm mx-auto">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="h-5 w-5" />}
              onClick={() => router.push("/understand")}
              className="font-black touch-target-lg"
            >
              {t("btnUnderstandScreen")}
            </Button>
          </div>
        </Card>
      )}

      {/* DETAIL MODAL: Read Saved Explanation */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          role="dialog"
          aria-label={`Saved explanation detail: ${selectedItem.title}`}
        >
          <div className="relative max-w-4xl w-full bg-navy-900 border-2 border-navy-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-elevated max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-navy-700 pb-4">
              <div className="flex items-center gap-3">
                <Badge variant="teal" size="md">
                  {selectedItem.category}
                </Badge>
                <span className="text-xs font-bold text-slateText-muted">{selectedItem.createdAt}</span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={isSpeaking ? <VolumeX className="h-4 w-4 text-tealAccent" /> : <Volume2 className="h-4 w-4 text-tealAccent" />}
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    else speakActionGuidance({
                      summary: selectedItem.summary,
                      category: selectedItem.category as any,
                      riskLevel: selectedItem.riskLevel,
                      riskTitle: selectedItem.riskTitle,
                      riskReasons: selectedItem.riskReasons,
                      recommendedActions: selectedItem.recommendedActions,
                      prohibitedActions: selectedItem.prohibitedActions,
                      detectedElements: [],
                      confidence: 1.0,
                    });
                  }}
                  className="font-bold"
                >
                  {isSpeaking ? t("btnPauseVoice") : t("btnHearWhatToDo")}
                </Button>

                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-2.5 rounded-2xl text-slateText-secondary hover:text-slateText-primary hover:bg-navy-800 touch-target"
                  aria-label="Close saved explanation detail"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* WHAT IS THIS? */}
            <div className="space-y-2 bg-navy-800 p-6 rounded-2xl border-2 border-navy-700">
              <span className="text-xs font-black uppercase tracking-widest text-tealAccent flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-goldAccent" />
                <span>{t("whatIsThis")}</span>
              </span>
              <p className="text-lg sm:text-xl font-black text-slateText-primary leading-relaxed">{selectedItem.summary}</p>
            </div>

            {/* IS THIS SAFE? */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-goldAccent">{t("isThisSafe")}</span>
              <RiskIndicator level={riskLevelMap[selectedItem.riskLevel] || "medium"} customExplanation={selectedItem.riskTitle} />
            </div>

            {/* ACTION GUIDANCE */}
            <ActionGuidance
              analysis={{
                summary: selectedItem.summary,
                category: selectedItem.category as any,
                riskLevel: selectedItem.riskLevel,
                riskTitle: selectedItem.riskTitle,
                riskReasons: selectedItem.riskReasons,
                recommendedActions: selectedItem.recommendedActions,
                prohibitedActions: selectedItem.prohibitedActions,
                detectedElements: [],
                confidence: 1.0,
                limitations: selectedItem.limitations,
              }}
            />

            <div className="pt-4 border-t border-navy-700 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedItem(null)} className="font-extrabold">
                {t("closeExplanationBtn")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Delete Single Item */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-label="Confirm item deletion"
        >
          <Card className="max-w-md w-full p-6 space-y-4 border-2 border-red-500/40 bg-navy-900 text-center shadow-2xl rounded-3xl">
            <div className="h-14 w-14 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slateText-primary">{t("deleteConfirmationTitle")}</h3>
            <p className="text-sm text-slateText-secondary font-medium">
              &quot;{itemToDelete.title}&quot; {t("deleteConfirmationDesc")}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="ghost" fullWidth onClick={() => setItemToDelete(null)}>
                {t("btnKeep")}
              </Button>
              <Button variant="destructive" fullWidth onClick={() => handleDeleteItem(itemToDelete.id)}>
                {t("btnDelete")}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* CONFIRMATION MODAL: Clear All History */}
      {showClearAllModal && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-label="Confirm clear all history"
        >
          <Card className="max-w-md w-full p-6 space-y-4 border-2 border-red-500/40 bg-navy-900 text-center shadow-2xl rounded-3xl">
            <div className="h-14 w-14 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mx-auto shadow-md">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slateText-primary">{t("btnClearAll")}?</h3>
            <p className="text-sm text-slateText-secondary font-medium">
              {t("clearAllConfirmDesc")}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="ghost" fullWidth onClick={() => setShowClearAllModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" fullWidth onClick={handleClearAll}>
                {t("btnClearAll")}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
