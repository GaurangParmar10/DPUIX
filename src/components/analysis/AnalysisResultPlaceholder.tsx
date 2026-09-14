"use client";

import React from "react";
import { StructuredAnalysisResponse } from "@/types/analysis";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { Button } from "@/components/ui/Button";
import { useAccessibility } from "@/context/AccessibilityContext";
import { CheckCircle2, ShieldCheck, Volume2, ArrowLeft, Sparkles } from "lucide-react";

export interface AnalysisResultPlaceholderProps {
  analysis: StructuredAnalysisResponse;
  onReset: () => void;
}

export const AnalysisResultPlaceholder: React.FC<AnalysisResultPlaceholderProps> = ({
  analysis,
  onReset,
}) => {
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  const handleSpeak = () => {
    if (isSpeaking) stopSpeaking();
    else {
      speakText(
        `What is this? ${analysis.summary}. Is this safe? ${analysis.riskTitle}. What should you do? ${analysis.recommendedActions.join(". ")}`
      );
    }
  };

  const riskLevelMap = {
    LOW: "low",
    CAUTION: "medium",
    HIGH: "high",
    SUSPICIOUS: "high",
    UNKNOWN: "medium",
  } as const;

  return (
    <Card className="p-6 sm:p-8 space-y-6 border-2 border-tealAccent/40 bg-navy-800 shadow-2xl max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-navy-700 pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="emerald" icon={<CheckCircle2 className="h-4 w-4" />}>
            Phase 6 AI Engine Verified
          </Badge>
          <span className="text-xs text-slateText-muted hidden sm:inline">Category: {analysis.category}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Volume2 className="h-4 w-4 text-tealAccent" />}
          onClick={handleSpeak}
        >
          {isSpeaking ? "Pause Narration" : "Hear Result 🔊"}
        </Button>
      </div>

      {/* 1. WHAT IS THIS? */}
      <div className="space-y-1.5 bg-navy-900/90 p-4 rounded-xl border border-navy-700">
        <span className="text-xs font-extrabold uppercase tracking-wider text-tealAccent">1. WHAT IS THIS?</span>
        <p className="text-base font-semibold text-slateText-primary leading-relaxed">{analysis.summary}</p>
      </div>

      {/* 2. IS THIS SAFE? */}
      <div className="space-y-1">
        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">2. IS THIS SAFE?</span>
        <RiskIndicator
          level={riskLevelMap[analysis.riskLevel]}
          customExplanation={analysis.riskReasons.join(" ")}
          size="sm"
        />
      </div>

      {/* 3. WHAT SHOULD I DO? */}
      <div className="space-y-2 bg-navy-900/90 p-4 rounded-xl border border-navy-700">
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">3. WHAT SHOULD I DO?</span>
        <ul className="space-y-2 text-sm text-slateText-primary font-medium">
          {analysis.recommendedActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="h-6 w-6 rounded-lg bg-tealAccent/20 text-tealAccent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action to test another screen */}
      <div className="pt-2 flex justify-between items-center border-t border-navy-700">
        <p className="text-xs text-slateText-muted">Structured data successfully produced by AI Analysis Engine.</p>
        <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={onReset}>
          Analyze Another Screen
        </Button>
      </div>
    </Card>
  );
};
