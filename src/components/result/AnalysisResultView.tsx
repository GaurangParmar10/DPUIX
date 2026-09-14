"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StructuredAnalysisResponse } from "@/types/analysis";
import { HistoryService } from "@/lib/services/HistoryService";
import { cn, compressImageForMobile } from "@/lib/utils";
import { analyzeScreen } from "@/lib/ai/analysisService";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ActionGuidance } from "@/components/guidance/ActionGuidance";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Info,
  X,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  HelpCircle,
  AlertOctagon,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Eye,
  Send,
  FileText,
  Key,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export interface AnalysisResultViewProps {
  analysis: StructuredAnalysisResponse;
  originalImage?: string | null;
  onReset: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  analysis: initialAnalysis,
  originalImage,
  onReset,
}) => {
  const router = useRouter();
  const { isSpeaking, stopSpeaking, language, t } = useAccessibility();

  const [currentAnalysis, setCurrentAnalysis] = useState<StructuredAnalysisResponse>(initialAnalysis);
  const [followUpInput, setFollowUpInput] = useState("");
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [feedbackVote, setFeedbackVote] = useState<"yes" | "no" | null>(null);
  const [feedbackReason, setFeedbackReason] = useState<string | null>(null);

  const isOtp =
    currentAnalysis.category === "OTP / Verification" ||
    (currentAnalysis.summary && currentAnalysis.summary.toLowerCase().includes("otp"));

  const handleSaveExplanation = () => {
    const saved = HistoryService.saveAnalysis(currentAnalysis, undefined, true);
    if (saved) {
      setIsSaved(true);
    }
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || isAskingFollowUp || !originalImage) return;

    const qText = followUpInput.trim();
    setFollowUpInput("");
    setIsAskingFollowUp(true);

    const prevHistory = currentAnalysis.chatHistory || [];
    const updatedHistory = [
      ...prevHistory,
      { sender: "user" as const, text: qText },
    ];

    try {
      const compressedImage = await compressImageForMobile(originalImage);
      const newAnalysis = await analyzeScreen(compressedImage, {
        language,
        followUpQuestion: qText,
        chatHistory: updatedHistory,
      });

      newAnalysis.chatHistory = [
        ...updatedHistory,
        { sender: "assistant" as const, text: newAnalysis.summary },
      ];

      setCurrentAnalysis(newAnalysis);
    } catch (err) {
      console.error("[AnalysisResultView] Follow-up error:", err);
    } finally {
      setIsAskingFollowUp(false);
    }
  };

  const riskLevelMap = {
    LOW: "low",
    CAUTION: "medium",
    HIGH: "high",
    SUSPICIOUS: "high",
    UNKNOWN: "medium",
  } as const;

  const feedbackOptions = [
    t("optUnclearExplanation"),
    t("optUnhelpfulAdvice"),
    t("optMisunderstoodScreen"),
    t("optOther"),
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4 animate-in fade-in duration-300">
      {/* AI Service Notice / Quota Exceeded Banner */}
      {currentAnalysis.serviceNotice && (
        <Card className="p-4 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex items-center gap-3 text-amber-200 text-sm font-bold">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="leading-relaxed">{currentAnalysis.serviceNotice}</span>
        </Card>
      )}

      {/* Top Action Header Bar */}
      <div className="bg-navy-800 border-2 border-navy-700 rounded-3xl p-6 sm:p-8 space-y-4 shadow-card-elevated flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-tealAccent-bg border border-tealAccent/40 text-tealAccent flex items-center justify-center shadow-md">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slateText-primary tracking-tight">
              {t("resultHeader")}
            </h1>
            <p className="text-xs sm:text-sm text-slateText-secondary font-medium">
              {t("resultHeaderDesc")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            leftIcon={isSaved ? <BookmarkCheck className="h-4 w-4 text-tealAccent" /> : <Bookmark className="h-4 w-4 text-tealAccent" />}
            onClick={handleSaveExplanation}
            disabled={isSaved}
            className="font-bold"
          >
            {isSaved ? t("btnSaved") : t("saveForLater")}
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={onReset}
            className="font-bold"
          >
            {t("btnUnderstandAnother")}
          </Button>
        </div>
      </div>

      {/* User Question Context */}
      {currentAnalysis.userQuestion && (
        <div className="p-4 sm:p-5 rounded-2xl bg-navy-850 border-2 border-tealAccent/40 flex items-start gap-3.5 shadow-sm">
          <MessageSquare className="h-5 w-5 text-tealAccent shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-black text-tealAccent uppercase tracking-wider">{t("youAsked")}:</span>
            <p className="text-base sm:text-lg font-bold text-slateText-primary italic">&quot;{currentAnalysis.userQuestion}&quot;</p>
          </div>
        </div>
      )}

      {/* DIRECT ANSWER HERO BANNER */}
      {currentAnalysis.directAnswer && (
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-tealAccent-bg via-navy-800 to-navy-800 border-2 border-tealAccent/70 rounded-3xl space-y-3 shadow-card-elevated animate-in zoom-in-95">
          <div className="flex items-center gap-2 text-tealAccent font-black text-xs uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-goldAccent" />
            <span>{t("directAnswerBadge")}</span>
          </div>
          <p className="text-xl sm:text-3xl font-black text-slateText-primary leading-snug tracking-tight">
            {currentAnalysis.directAnswer}
          </p>
        </Card>
      )}

      {/* TRANSIENT VISIBLE OTP CARD */}
      {currentAnalysis.visibleOtp && (
        <Card className="p-6 bg-navy-800 border-2 border-tealAccent/60 rounded-3xl space-y-3 animate-in zoom-in-95 shadow-card-elevated">
          <div className="flex items-center gap-2 text-tealAccent font-black text-xs uppercase tracking-widest">
            <Key className="h-4 w-4 text-goldAccent" />
            <span>{t("transientOtpBadge")}</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4 p-5 rounded-2xl bg-navy-900 border-2 border-navy-750">
            <div>
              <p className="text-xs text-slateText-secondary font-bold">{t("codeVisibleOnScreenshot")}</p>
              <p className="text-4xl font-black tracking-widest text-tealAccent font-mono mt-1">
                {currentAnalysis.visibleOtp}
              </p>
            </div>
            <div className="text-xs sm:text-sm text-slateText-secondary max-w-xs leading-relaxed font-medium">
              {t("otpPrivacyProtection")}
            </div>
          </div>
        </Card>
      )}

      {/* OCR TRANSCRIPTION CARD */}
      {currentAnalysis.ocrText && (
        <Card className="p-6 bg-navy-800 border-2 border-navy-700 rounded-3xl space-y-3 shadow-card">
          <div className="flex items-center gap-2 text-tealAccent font-black text-xs uppercase tracking-widest">
            <FileText className="h-4 w-4" />
            <span>{t("screenTextTranscription")}</span>
          </div>
          <pre className="p-5 rounded-2xl bg-navy-900 border border-navy-750 text-xs sm:text-sm font-mono text-slateText-primary whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {currentAnalysis.ocrText}
          </pre>
        </Card>
      )}

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: What is this? + Is this safe? + Why? + Why am I seeing this? */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. What is this? */}
          <Card className="p-6 sm:p-7 space-y-4 bg-navy-800 border-2 border-navy-700 rounded-3xl shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-tealAccent font-black text-xs uppercase tracking-widest">
                <Info className="h-4 w-4" />
                <span>1. {t("whatIsThis")}</span>
              </div>
              {currentAnalysis.category && (
                <Badge variant="teal" size="sm">
                  {currentAnalysis.category}
                </Badge>
              )}
            </div>

            <p className="text-lg sm:text-xl font-black text-slateText-primary leading-relaxed">
              {currentAnalysis.summary}
            </p>

            {/* Visible Detected Screen Elements */}
            {currentAnalysis.detectedElements && currentAnalysis.detectedElements.length > 0 && (
              <div className="pt-3 border-t border-navy-750 space-y-2.5">
                <span className="text-xs font-bold text-slateText-secondary flex items-center gap-1.5 uppercase tracking-wider">
                  <Eye className="h-4 w-4 text-tealAccent" />
                  <span>{t("visibleElementsOnScreen")}</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentAnalysis.detectedElements.map((el, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-750 text-slateText-primary shadow-sm"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* 2. Is it safe? */}
          <Card className="p-6 space-y-3 bg-navy-800 border-2 border-navy-700 rounded-3xl shadow-card">
            <div className="flex items-center gap-2 text-goldAccent font-black text-xs uppercase tracking-widest">
              <ShieldCheck className="h-4 w-4" />
              <span>2. {t("isThisSafe")}</span>
            </div>

            <RiskIndicator
              level={riskLevelMap[currentAnalysis.riskLevel] || (isOtp ? "medium" : "medium")}
              customExplanation={currentAnalysis.riskTitle || (isOtp ? t("otpRiskDesc") : undefined)}
            />
          </Card>

          {/* 3. Why? */}
          {(currentAnalysis.riskReasons && currentAnalysis.riskReasons.length > 0) && (
            <Card className="p-6 space-y-3 bg-navy-800 border-2 border-navy-700 rounded-3xl shadow-card">
              <div className="flex items-center gap-2 text-slateText-secondary font-black text-xs uppercase tracking-widest">
                <Info className="h-4 w-4 text-tealAccent" />
                <span>3. {t("whyTitle")}</span>
              </div>

              <ul className="space-y-3">
                {currentAnalysis.riskReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-base text-slateText-primary font-bold">
                    <span className="h-2.5 w-2.5 rounded-full bg-tealAccent shrink-0 mt-2" />
                    <span className="leading-relaxed">{reason}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* WHY AM I SEEING THIS? */}
          <Card className="p-6 space-y-3 bg-navy-800 border-2 border-navy-700 rounded-3xl shadow-card">
            <div className="flex items-center gap-2 text-tealAccent font-black text-xs uppercase tracking-widest">
              <HelpCircle className="h-4 w-4" />
              <span>{t("whyAmISeeingThis")}</span>
            </div>
            <p className="text-sm sm:text-base text-slateText-secondary leading-relaxed font-medium">
              {currentAnalysis.whyAmISeeingThis ||
                (isOtp
                  ? t("otpWhySeeingThis")
                  : "This type of screen usually appears when an application or service requests your authorization or notification acknowledgement.")}
            </p>
          </Card>
        </div>

        {/* Right Column: 4. What should I do? (Action Guidance) */}
        <div className="lg:col-span-6 space-y-6">
          <ActionGuidance analysis={currentAnalysis} />

          {/* MULTI-TURN FOLLOW-UP QUESTION BAR */}
          <Card className="p-6 bg-navy-800 border-2 border-navy-700 rounded-3xl space-y-4 shadow-card-elevated">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-tealAccent uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-goldAccent" />
                <span>{t("askFollowUpTitle")}</span>
              </span>
            </div>

            <form onSubmit={handleSendFollowUp} className="flex items-center gap-3">
              <Input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                placeholder={t("askFollowUpPlaceholder")}
                disabled={isAskingFollowUp}
                className="bg-navy-900 border-navy-750 text-base py-3"
              />
              <Button
                type="submit"
                variant="primary"
                size="default"
                disabled={!followUpInput.trim() || isAskingFollowUp}
                leftIcon={<Send className="h-4 w-4" />}
                className="font-bold"
              >
                {isAskingFollowUp ? t("btnThinking") : t("btnAsk")}
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Bottom Grid: 5. What to avoid & 6. Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 5. What to avoid */}
        {currentAnalysis.prohibitedActions && currentAnalysis.prohibitedActions.length > 0 && (
          <Card className="p-6 space-y-4 border-2 border-red-500/40 bg-navy-800 rounded-3xl shadow-card">
            <div className="flex items-center gap-2 text-red-400 font-black text-xs uppercase tracking-widest">
              <AlertOctagon className="h-4 w-4" />
              <span>5. {t("avoidThis")}</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentAnalysis.prohibitedActions.map((prohibited, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-navy-900 border border-navy-750 flex items-start gap-3 text-sm font-bold text-red-200">
                  <span className="text-red-400 font-black text-base shrink-0">✕</span>
                  <span className="leading-relaxed">{prohibited}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 6. What can't DigitalBridge confirm? */}
        <Card className="p-6 space-y-3 border-2 border-navy-700 bg-navy-800 rounded-3xl shadow-card">
          <div className="flex items-center gap-2 text-slateText-secondary font-black text-xs uppercase tracking-widest">
            <HelpCircle className="h-4 w-4 text-tealAccent" />
            <span>6. {t("limitationsTitle")}</span>
          </div>

          <p className="text-sm sm:text-base text-slateText-secondary leading-relaxed font-medium">
            {currentAnalysis.limitations?.[0] || "We evaluate what is visible in this screenshot. Always verify independently through official channels before sharing credentials."}
          </p>
        </Card>
      </div>

      {/* WAS THIS EXPLANATION HELPFUL? */}
      <Card className="p-6 bg-navy-800 border-2 border-navy-700 rounded-3xl space-y-4 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-0.5">
            <p className="text-base font-extrabold text-slateText-primary">{t("wasThisHelpful")}</p>
            <p className="text-xs sm:text-sm text-slateText-secondary font-medium">{t("feedbackSubtitle")}</p>
          </div>

          {feedbackVote === null && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ThumbsUp className="h-4 w-4 text-tealAccent" />}
                onClick={() => setFeedbackVote("yes")}
                className="font-bold"
              >
                {t("btnYesThumb")}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ThumbsDown className="h-4 w-4 text-slateText-muted" />}
                onClick={() => setFeedbackVote("no")}
                className="font-bold"
              >
                {t("btnNotQuite")}
              </Button>
            </div>
          )}

          {feedbackVote === "yes" && (
            <div className="flex items-center gap-2 text-tealAccent text-sm font-black bg-navy-900 px-4 py-2.5 rounded-2xl border border-tealAccent/40">
              <CheckCircle2 className="h-5 w-5" />
              <span>{t("thanksFeedback")}</span>
            </div>
          )}
        </div>

        {/* Follow-up question if "Not quite" selected */}
        {feedbackVote === "no" && !feedbackReason && (
          <div className="pt-3 border-t border-navy-750 space-y-2 animate-in fade-in duration-200">
            <p className="text-xs font-black text-slateText-primary uppercase tracking-wider">{t("whatWasConfusing")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {feedbackOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFeedbackReason(opt)}
                  className="touch-target min-h-[48px] p-3 rounded-2xl bg-navy-900 border border-navy-750 text-xs sm:text-sm font-bold text-slateText-secondary hover:text-slateText-primary hover:border-tealAccent/50 transition-all text-left"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {feedbackVote === "no" && feedbackReason && (
          <div className="pt-2 flex items-center gap-2 text-tealAccent text-sm font-black bg-navy-900 px-4 py-2.5 rounded-2xl border border-tealAccent/40 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5" />
            <span>{t("thanksFeedback")}</span>
          </div>
        )}
      </Card>

      {/* Screen Thumbnail & Navigation Bar */}
      <Card className="p-5 sm:p-6 bg-navy-800 border-2 border-navy-700 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
        {originalImage && (
          <div className="flex items-center gap-4">
            <div
              className="h-16 w-20 rounded-2xl overflow-hidden border-2 border-navy-700 bg-navy-950 flex items-center justify-center shrink-0 cursor-pointer shadow-inner"
              onClick={() => setIsImageModalOpen(true)}
            >
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={originalImage}
                alt="Analyzed screen thumbnail"
                className="max-h-14 w-auto object-contain rounded-lg"
              />
            </div>
            <div>
              <p className="text-base font-extrabold text-slateText-primary">{t("originalScreenshot")}</p>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="text-xs sm:text-sm text-tealAccent font-bold hover:underline"
              >
                {t("inspectOriginalPhoto")}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="secondary"
            size="default"
            fullWidth
            leftIcon={<ArrowLeft className="h-5 w-5" />}
            onClick={() => router.push("/dashboard")}
            className="font-extrabold"
          >
            {t("btnBackToDashboard")}
          </Button>
        </div>
      </Card>

      {/* Image Inspection Modal */}
      {isImageModalOpen && originalImage && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          role="dialog"
          aria-label="Inspecting original screen image"
        >
          <div className="relative max-w-4xl w-full bg-navy-900 border-2 border-navy-700 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <h3 className="text-xl font-black text-slateText-primary">{t("originalScreenshot")}</h3>
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="p-2.5 rounded-2xl text-slateText-secondary hover:text-slateText-primary hover:bg-navy-800 touch-target"
                aria-label="Close image inspection modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto flex items-center justify-center p-2 rounded-2xl bg-navy-950 border border-navy-800">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={originalImage}
                alt="Full screen inspection"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
