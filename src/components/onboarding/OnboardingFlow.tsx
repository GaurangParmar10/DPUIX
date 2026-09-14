"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const OnboardingFlow: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { speakText, isSpeaking, stopSpeaking, t } = useAccessibility();

  const handleComplete = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("db_onboarding_complete", "true");
    }
    router.push("/dashboard");
  };

  const steps = [
    {
      id: 1,
      title: t("onboardingWelcomeTitle"),
      subtitle: t("brandSubtitle"),
      content: (
        <div className="space-y-4 text-left">
          <p className="text-base text-slateText-primary leading-relaxed">
            {t("onboardingWelcomeIntro")}
          </p>
          <div className="p-4 rounded-xl bg-navy-900 border border-navy-700 space-y-2">
            <p className="text-sm font-bold text-slateText-primary">{t("onboardingWhatDbDoes")}</p>
            <ul className="space-y-2 text-xs sm:text-sm text-slateText-secondary">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-tealAccent shrink-0 mt-0.5" />
                <span>{t("onboardingFeature1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-tealAccent shrink-0 mt-0.5" />
                <span>{t("onboardingFeature2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-tealAccent shrink-0 mt-0.5" />
                <span>{t("onboardingFeature3")}</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: t("onboardingStep2Title"),
      subtitle: t("onboardingStep2Sub"),
      content: (
        <div className="space-y-3 text-left">
          <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-700 flex items-start gap-3">
            <div className="h-7 w-7 rounded-lg bg-tealAccent/20 text-tealAccent font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="text-sm font-bold text-slateText-primary">{t("whatIsThis")}</p>
              <p className="text-xs text-slateText-secondary">{t("onboardingQ1Sub")}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-700 flex items-start gap-3">
            <div className="h-7 w-7 rounded-lg bg-amber-400/20 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="text-sm font-bold text-slateText-primary">{t("isThisSafe")}</p>
              <p className="text-xs text-slateText-secondary">{t("onboardingQ2Sub")}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-700 flex items-start gap-3">
            <div className="h-7 w-7 rounded-lg bg-tealAccent/20 text-tealAccent font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="text-sm font-bold text-slateText-primary">{t("whatShouldIDo")}</p>
              <p className="text-xs text-slateText-secondary">{t("onboardingQ3Sub")}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: t("onboardingStep3Title"),
      subtitle: t("onboardingStep3Sub"),
      content: (
        <div className="space-y-4 text-left">
          <p className="text-xs sm:text-sm text-slateText-secondary">
            {t("onboardingStep3Helper")}
          </p>
          <AccessibilityToolbar />
        </div>
      ),
    },
    {
      id: 4,
      title: t("onboardingStep4Title"),
      subtitle: t("onboardingStep4Sub"),
      content: (
        <div className="space-y-4 text-center py-2">
          <div className="h-16 w-16 rounded-2xl bg-tealAccent/15 text-tealAccent flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <p className="text-base font-bold text-slateText-primary">
            {t("onboardingStep4Desc")}
          </p>
        </div>
      ),
    },
  ];

  const activeStep = steps.find((s) => s.id === currentStep) || steps[0];

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-6">
      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2" role="progressbar" aria-valuenow={currentStep} aria-valuemax={4}>
        {steps.map((s) => (
          <div
            key={s.id}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              s.id === currentStep ? "w-8 bg-tealAccent" : s.id < currentStep ? "w-2.5 bg-tealAccent/50" : "w-2.5 bg-navy-700"
            )}
          />
        ))}
      </div>

      <Card className="p-6 sm:p-8 space-y-6 border-2 border-navy-700 bg-navy-800 shadow-2xl text-center">
        <div className="space-y-2 border-b border-navy-700 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary">{activeStep.title}</h1>
          <p className="text-sm text-slateText-secondary">{activeStep.subtitle}</p>
        </div>

        {activeStep.content}

        <div className="pt-4 flex items-center justify-between gap-3 border-t border-navy-700 flex-wrap">
          {currentStep > 1 ? (
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => setCurrentStep(currentStep - 1)}>
              {t("btnBack")}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleComplete}>
              {t("btnSkipGuide")}
            </Button>
          )}

          {currentStep < 4 ? (
            <Button variant="primary" size="default" rightIcon={<ArrowRight className="h-4 w-4" />} onClick={() => setCurrentStep(currentStep + 1)}>
              {t("btnContinue")}
            </Button>
          ) : (
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />} onClick={handleComplete}>
              {t("btnUnderstandScreen")}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
