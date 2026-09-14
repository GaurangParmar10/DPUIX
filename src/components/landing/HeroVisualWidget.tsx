"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, Sparkles, Smartphone, Eye, Volume2 } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { cn } from "@/lib/utils";

export const HeroVisualWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"before" | "after">("after");
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  const handleSpeakSample = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(
        "DigitalBridge Explanation. What is this? This message asks you to verify your mobile account details. Is this safe? Be careful, some details require attention. What should you do? First, check who sent the message. Second, open the official app directly. Third, never share your OTP or password."
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Interactive Mode Toggle Bar */}
      <div
        className="bg-navy-900 border border-navy-700 rounded-2xl p-1.5 flex items-center justify-between gap-2 shadow-inner"
        role="tablist"
        aria-label="Before and After DigitalBridge Visual Demonstration"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "before"}
          onClick={() => setActiveTab("before")}
          className={cn(
            "flex-1 touch-target min-h-[48px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2",
            activeTab === "before"
              ? "bg-navy-750 text-slateText-primary border border-navy-600 shadow-md"
              : "text-slateText-muted hover:text-slateText-secondary"
          )}
        >
          <Smartphone className="h-4 w-4 text-amber-400" />
          <span>Confusing Screen (Before)</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "after"}
          onClick={() => setActiveTab("after")}
          className={cn(
            "flex-1 touch-target min-h-[48px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2",
            activeTab === "after"
              ? "bg-tealAccent text-navy-950 shadow-md shadow-tealAccent/20 font-extrabold"
              : "text-slateText-muted hover:text-slateText-secondary"
          )}
        >
          <Sparkles className="h-4 w-4" />
          <span>DigitalBridge Answer (After)</span>
        </button>
      </div>

      {/* Visual Display Container */}
      <div className="relative min-h-[420px] transition-all duration-300">
        {activeTab === "before" ? (
          /* BEFORE: Confusing Phone Screen Mockup */
          <Card className="border-2 border-amber-500/30 bg-navy-850 p-5 sm:p-6 space-y-4 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-navy-700 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <span>CONFUSING SMS / POPUP MESSAGE</span>
              </div>
              <span className="text-xs text-slateText-muted">Received 2m ago</span>
            </div>

            {/* Simulated Confusing SMS Content */}
            <div className="bg-navy-900 border border-navy-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slateText-primary">From: +91-XXXXX-9821</span>
                <Badge variant="amber" size="sm">Urgent Request</Badge>
              </div>

              <p className="text-base text-slateText-secondary font-mono leading-relaxed bg-navy-950/60 p-3.5 rounded-xl border border-navy-800">
                &quot;ALERT: Your mobile verification token #892011 is pending authorization. Click http://verify-secure-act.info/auth immediately or access will be restricted.&quot;
              </p>

              <div className="pt-1 flex items-center justify-between text-xs text-slateText-muted">
                <span>User thought: &quot;Is this real? What happens if I click?&quot;</span>
              </div>
            </div>

            {/* Prompt CTA to Switch */}
            <div className="pt-2 flex items-center justify-between bg-navy-900/60 rounded-xl p-3 border border-navy-700">
              <p className="text-xs sm:text-sm text-slateText-secondary">
                Confused or scared to press? Show this screen to DigitalBridge.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("after")}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                See Clear Answer
              </Button>
            </div>
          </Card>
        ) : (
          /* AFTER: DigitalBridge Simple Explanation */
          <Card className="border-2 border-tealAccent/40 bg-navy-800 p-5 sm:p-6 space-y-5 shadow-2xl animate-in fade-in duration-200">
            {/* Header Status */}
            <div className="flex items-center justify-between border-b border-navy-700 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-tealAccent" />
                <span className="text-sm font-bold text-slateText-primary">DIGITALBRIDGE ANALYSIS COMPLETE</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Volume2 className="h-4 w-4 text-tealAccent" />}
                onClick={handleSpeakSample}
                className="text-xs"
              >
                {isSpeaking ? "Pause Narration" : "Hear Explanation 🔊"}
              </Button>
            </div>

            {/* 1. WHAT IS THIS? */}
            <div className="space-y-1.5 bg-navy-900/80 p-4 rounded-xl border border-navy-700">
              <span className="text-xs font-extrabold uppercase tracking-wider text-tealAccent">1. WHAT IS THIS?</span>
              <p className="text-base font-medium text-slateText-primary leading-relaxed">
                This message is asking you to verify your mobile account using a website link.
              </p>
            </div>

            {/* 2. IS THIS SAFE? */}
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">2. IS THIS SAFE?</span>
              <RiskIndicator
                level="medium"
                size="sm"
                customExplanation="BE CAREFUL: The message uses an unofficial web link. Official companies rarely send random links asking for urgent login."
              />
            </div>

            {/* 3. WHAT SHOULD I DO? */}
            <div className="space-y-2 bg-navy-900/80 p-4 rounded-xl border border-navy-700">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">3. WHAT SHOULD I DO?</span>

              <ul className="space-y-2 text-sm text-slateText-primary font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="h-6 w-6 rounded-lg bg-tealAccent/20 text-tealAccent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">01</span>
                  <span>Do NOT click the link inside the SMS message.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-6 w-6 rounded-lg bg-tealAccent/20 text-tealAccent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">02</span>
                  <span>Open your official app directly on your phone instead.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-6 w-6 rounded-lg bg-tealAccent/20 text-tealAccent font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">03</span>
                  <span>Never share your 6-digit OTP or password with anyone calling you.</span>
                </li>
              </ul>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
