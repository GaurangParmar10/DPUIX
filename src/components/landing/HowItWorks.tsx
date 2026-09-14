"use client";

import React from "react";
import { Upload, Cpu, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "SHOW IT",
      desc: "Upload a screenshot or take a photo of the confusing message or popup screen.",
      icon: Upload,
    },
    {
      number: "02",
      title: "UNDERSTAND IT",
      desc: "DigitalBridge analyzes the text and visual layout into human-friendly concepts.",
      icon: Cpu,
    },
    {
      number: "03",
      title: "CHECK IT",
      desc: "We check for common warning signs like unknown web links or urgent OTP demands.",
      icon: ShieldCheck,
    },
    {
      number: "04",
      title: "KNOW WHAT TO DO",
      desc: "Follow clear numbered steps on what actions to take and what to avoid.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="how-it-works" className="py-12 md:py-16 space-y-10 max-w-6xl mx-auto border-t border-navy-700/60 scroll-mt-24">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slateText-primary tracking-tight">
          How DigitalBridge works in 4 simple steps
        </h2>
        <p className="text-base sm:text-lg text-slateText-secondary leading-relaxed">
          No complicated setup or tech knowledge needed. Just show us your screen.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Card key={step.number} className="p-6 space-y-4 border border-navy-700 relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-tealAccent/15 text-tealAccent flex items-center justify-center font-bold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-slateText-muted opacity-30 font-mono">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-tealAccent tracking-wider">
                  {step.title}
                </h3>

                <p className="text-sm text-slateText-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slateText-muted">
                  <ArrowRight className="h-5 w-5 text-navy-600" />
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
};
