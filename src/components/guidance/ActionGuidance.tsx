"use client";

import React, { useState } from "react";
import { StructuredAnalysisResponse } from "@/types/analysis";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  CheckCircle2,
  Volume2,
  VolumeX,
  Lock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionGuidanceProps {
  analysis: StructuredAnalysisResponse;
  className?: string;
}

export const ActionGuidance: React.FC<ActionGuidanceProps> = ({ analysis, className }) => {
  const { isSpeaking, stopSpeaking, speakText, t, voicePlayback } = useAccessibility();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [completedStepIndices, setCompletedStepIndices] = useState<number[]>([]);
  const [hasVoiceActivated, setHasVoiceActivated] = useState<boolean>(false);

  const isOtp =
    analysis.category === "OTP / Verification" ||
    (analysis.summary && analysis.summary.toLowerCase().includes("otp"));

  const displayActions =
    analysis.recommendedActions && analysis.recommendedActions.length > 0
      ? analysis.recommendedActions
      : isOtp
      ? [t("otpStep1"), t("otpStep2"), t("otpStep3")]
      : ["Follow the instructions on your phone screen carefully.", "Do not share sensitive passwords or PINs."];

  const totalSteps = displayActions.length;
  const currentActionText = displayActions[activeStepIndex] || displayActions[0];

  const speakStepIndex = (stepIdx: number) => {
    const textToSpeak = displayActions[stepIdx];
    if (textToSpeak && voicePlayback) {
      speakText(`${t("stepPrefix")} ${stepIdx + 1}: ${textToSpeak}`);
    }
  };

  const handleNextStep = () => {
    if (!completedStepIndices.includes(activeStepIndex)) {
      setCompletedStepIndices((prev) => [...prev, activeStepIndex]);
    }
    if (activeStepIndex < totalSteps - 1) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      if (hasVoiceActivated || isSpeaking) {
        speakStepIndex(nextIdx);
      }
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      const prevIdx = activeStepIndex - 1;
      setActiveStepIndex(prevIdx);
      if (hasVoiceActivated || isSpeaking) {
        speakStepIndex(prevIdx);
      }
    }
  };

  const handleStepJump = (idx: number) => {
    setActiveStepIndex(idx);
    if (hasVoiceActivated || isSpeaking) {
      speakStepIndex(idx);
    }
  };

  const handleHearStep = () => {
    if (isSpeaking) {
      stopSpeaking();
      setHasVoiceActivated(false);
    } else {
      setHasVoiceActivated(true);
      speakStepIndex(activeStepIndex);
    }
  };

  const handleResetProgress = () => {
    setActiveStepIndex(0);
    setCompletedStepIndices([]);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  return (
    <Card
      variant="highlight"
      className={cn(
        "p-6 sm:p-8 space-y-6 bg-navy-850 border-2 border-goldAccent/70 shadow-card-elevated rounded-3xl relative overflow-hidden",
        className
      )}
    >
      {/* Step Guided Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-navy-750 pb-5">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-goldAccent flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cream" />
            <span>{t("stepPrefix").toUpperCase()} {activeStepIndex + 1} {t("ofTotal").toUpperCase()} {totalSteps}</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slateText-primary tracking-tight mt-0.5">
            {t("stepGuidanceTitle")}
          </h3>
          <p className="text-xs sm:text-sm text-slateText-secondary font-medium mt-1">
            {t("stepGuidanceSubtitle")}
          </p>
        </div>

        {/* Reset Progress Button */}
        {completedStepIndices.length > 0 && (
          <button
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 text-xs font-bold text-slateText-muted hover:text-goldAccent transition-colors touch-target px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-750"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t("btnStartOver")}</span>
          </button>
        )}
      </div>

      {/* Progress Dots Bar */}
      <div className="flex items-center justify-between max-w-md mx-auto gap-2 py-2">
        {displayActions.map((_, idx) => {
          const isDone = completedStepIndices.includes(idx);
          const isActive = idx === activeStepIndex;

          return (
            <React.Fragment key={idx}>
              <button
                onClick={() => handleStepJump(idx)}
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all border-2 touch-target",
                  isActive
                    ? "border-goldAccent bg-goldAccent text-navy-950 scale-110 shadow-lg shadow-goldAccent/30"
                    : isDone
                    ? "border-risk-low-text bg-risk-low-bg text-risk-low-text"
                    : "border-navy-700 bg-navy-900 text-slateText-muted"
                )}
                title={`Jump to step ${idx + 1}`}
              >
                {isDone ? "✓" : idx + 1}
              </button>
              {idx < totalSteps - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all",
                    completedStepIndices.includes(idx) ? "bg-risk-low-text" : "bg-navy-750"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ACTIVE STEP FOCUSED HERO CARD */}
      <div className="bg-navy-900 border-2 border-goldAccent/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-card transition-all">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-12 w-12 rounded-2xl bg-goldAccent/20 border border-goldAccent/50 text-goldAccent flex items-center justify-center font-mono font-black text-xl shadow-md shrink-0">
              0{activeStepIndex + 1}
            </span>
            <div>
              <span className="text-xs font-bold text-goldAccent uppercase tracking-wide block">{t("currentActionLabel")}</span>
              <h4 className="text-xl sm:text-2xl font-black text-cream">
                {t("stepPrefix")} {activeStepIndex + 1}
              </h4>
            </div>
          </div>

          {/* Voice Audio Button for Current Step */}
          <Button
            variant="outline"
            size="sm"
            leftIcon={isSpeaking ? <VolumeX className="h-4 w-4 text-goldAccent" /> : <Volume2 className="h-4 w-4 text-goldAccent" />}
            onClick={handleHearStep}
            className="border-goldAccent/40 hover:bg-goldAccent/10 text-xs font-bold shrink-0"
          >
            {isSpeaking ? t("btnPauseVoice") : t("btnHearStep")}
          </Button>
        </div>

        {/* Step Text Explanation */}
        <p className="text-lg sm:text-xl font-extrabold text-slateText-primary leading-relaxed bg-navy-850 p-5 rounded-2xl border border-navy-750">
          {currentActionText}
        </p>

        {/* Action Controls & Navigation */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="default"
            disabled={activeStepIndex === 0}
            onClick={handlePrevStep}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
            className="text-slateText-secondary hover:text-cream font-bold"
          >
            {t("btnPreviousStep")}
          </Button>

          {/* Primary Confirmation CTA: "I've done this →" */}
          <Button
            variant="gold"
            size="lg"
            rightIcon={<ArrowRight className="h-5 w-5 stroke-[2.5]" />}
            onClick={handleNextStep}
            className="shadow-xl text-base font-black px-6"
          >
            {activeStepIndex === totalSteps - 1 ? t("btnCompleteGuidance") : t("btnDoneStep")}
          </Button>
        </div>
      </div>

      {/* COMPLETED STEPS SUMMARY LIST */}
      {completedStepIndices.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-navy-750">
          <span className="text-xs font-bold text-slateText-muted uppercase tracking-wider block">
            {t("completedStepsTitle")} ({completedStepIndices.length}/{totalSteps})
          </span>
          <div className="space-y-2">
            {completedStepIndices.map((stepIdx) => (
              <div
                key={stepIdx}
                onClick={() => handleStepJump(stepIdx)}
                className="p-3.5 rounded-xl bg-navy-900/80 border border-risk-low-border/60 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold cursor-pointer hover:bg-navy-900 transition-colors"
              >
                <div className="flex items-center gap-2 text-risk-low-text">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span className="font-extrabold">{t("stepPrefix")} {stepIdx + 1}:</span>
                  <span className="text-slateText-secondary line-clamp-1">{displayActions[stepIdx]}</span>
                </div>
                <span className="text-[11px] font-bold text-slateText-muted shrink-0 underline">{t("btnReread")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Privacy Reassurance Footer */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-navy-750 flex items-center gap-3 text-xs sm:text-sm text-slateText-secondary leading-relaxed font-medium">
        <Lock className="h-5 w-5 text-goldAccent shrink-0" />
        <span>{t("securityReassuranceFooter")}</span>
      </div>
    </Card>
  );
};
