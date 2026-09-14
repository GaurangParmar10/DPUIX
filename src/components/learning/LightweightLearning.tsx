"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Lock, Smartphone, AlertTriangle, Sparkles } from "lucide-react";

export const LightweightLearning: React.FC = () => {
  const { t } = useAccessibility();

  const lessons = [
    {
      icon: Lock,
      title: "What is an OTP?",
      desc: "An OTP is a temporary 6-digit code meant for your eyes only. Legitimate bank support will NEVER call asking you to read it out loud.",
    },
    {
      icon: Smartphone,
      title: "Open official apps directly",
      desc: "If a message asks you to log in or verify an account, open your official app directly instead of tapping links inside text messages.",
    },
    {
      icon: AlertTriangle,
      title: "Urgency is a warning sign",
      desc: "Messages claiming your account will be blocked within 10 minutes are designed to create panic. Take a moment to verify independently.",
    },
  ];

  return (
    <section className="space-y-4 py-4 border-t border-navy-700/60 pt-8">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-tealAccent" />
        <h2 className="text-xl sm:text-2xl font-bold text-slateText-primary">
          {t("learnSomethingUseful")}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lessons.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-5 space-y-3 border border-navy-700 bg-navy-800">
              <div className="h-10 w-10 rounded-xl bg-tealAccent/15 text-tealAccent flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slateText-primary">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed">{item.desc}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
