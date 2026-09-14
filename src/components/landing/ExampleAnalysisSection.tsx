"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RiskIndicator } from "@/components/ui/RiskIndicator";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Volume2, VolumeX, ShieldCheck, CheckCircle2, AlertOctagon } from "lucide-react";

export const ExampleAnalysisSection: React.FC = () => {
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  const sampleScript =
    "Example DigitalBridge Explanation. What is this? This notification is asking permission to read your text messages and contacts. Is this safe? High Risk. Standard photo editing apps should never ask for text message permissions. What should you do? First, deny permission. Second, uninstall the app if it requires full phone access. Third, download apps only from official stores.";

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(sampleScript);
    }
  };

  return (
    <section className="py-12 md:py-16 space-y-8 max-w-5xl mx-auto border-t border-navy-700/60">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-widest text-tealAccent">PRODUCT PREVIEW</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slateText-primary tracking-tight">
          See what an analysis looks like
        </h2>
        <p className="text-base sm:text-lg text-slateText-secondary leading-relaxed">
          Structured around three simple questions so you never feel lost.
        </p>
      </div>

      <Card className="border-2 border-navy-700 bg-navy-800 p-6 md:p-8 space-y-6 shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-navy-700 pb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-tealAccent/15 text-tealAccent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slateText-primary">App Permission Request Analysis</h3>
              <p className="text-xs text-slateText-muted">Fictional sample analysis • App requesting full phone access</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={isSpeaking ? <VolumeX className="h-4 w-4 text-tealAccent" /> : <Volume2 className="h-4 w-4 text-tealAccent" />}
            onClick={handleToggleVoice}
          >
            {isSpeaking ? "Pause Narration" : "Hear Explanation 🔊"}
          </Button>
        </div>

        {/* Section 1: WHAT IS THIS? */}
        <div className="space-y-2 bg-navy-900/80 p-5 rounded-2xl border border-navy-700">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-tealAccent" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-tealAccent">WHAT IS THIS?</h4>
          </div>
          <p className="text-lg font-semibold text-slateText-primary leading-relaxed">
            This popup is asking for permission to read all your SMS text messages and phone contact list.
          </p>
        </div>

        {/* Section 2: IS THIS SAFE? */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-400">IS THIS SAFE?</h4>
          <RiskIndicator
            level="high"
            customExplanation="HIGH RISK: A photo editor app does NOT need permission to read your private text messages. Sharing SMS permission can expose your bank OTPs."
          />
        </div>

        {/* Section 3: WHAT SHOULD I DO? */}
        <div className="space-y-3 bg-navy-900/80 p-5 rounded-2xl border border-navy-700">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">WHAT SHOULD I DO?</h4>

          <div className="grid gap-3">
            <div className="p-3.5 rounded-xl bg-navy-800 border border-navy-750 flex items-start gap-3">
              <span className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">01</span>
              <div>
                <p className="text-base font-bold text-slateText-primary">Tap &quot;Deny&quot; or &quot;Don&apos;t Allow&quot; on the screen.</p>
                <p className="text-sm text-slateText-secondary">Do not allow this app to read your personal SMS messages.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-800 border border-navy-750 flex items-start gap-3">
              <span className="h-7 w-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">02</span>
              <div>
                <p className="text-base font-bold text-slateText-primary">Uninstall suspicious apps.</p>
                <p className="text-sm text-slateText-secondary">If an app refuses to open without SMS access, remove it from your phone.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prohibited Actions */}
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-200 flex items-center gap-3">
          <AlertOctagon className="h-6 w-6 text-red-400 shrink-0" />
          <p className="text-sm font-medium">
            <strong className="text-red-300">WHAT NOT TO DO:</strong> Never tap &quot;Allow All Permissions&quot; when installing unknown apps.
          </p>
        </div>
      </Card>
    </section>
  );
};
