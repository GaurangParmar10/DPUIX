"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { BookOpen, ShieldCheck, ListOrdered, Volume2 } from "lucide-react";

export const SolutionPillars: React.FC = () => {
  const pillars = [
    {
      step: "01",
      title: "UNDERSTAND",
      heading: "Simple explanations, zero jargon",
      description: "DigitalBridge reads what is on your screen and explains it in plain human terms without technical terms like OCR, tokens, or permissions.",
      icon: BookOpen,
      accent: "text-tealAccent bg-tealAccent/15 border-tealAccent/30",
    },
    {
      step: "02",
      title: "SAFETY",
      heading: "Know if you should be careful",
      description: "We highlight potential security red flags — like unofficial links or requests for secret OTPs — so you can stay safe before tapping.",
      icon: ShieldCheck,
      accent: "text-amber-400 bg-amber-500/15 border-amber-500/30",
    },
    {
      step: "03",
      title: "GUIDANCE",
      heading: "Clear step-by-step action plan",
      description: "You won't have to guess what to press next. DigitalBridge gives you numbered steps on exactly what to do and what to avoid.",
      icon: ListOrdered,
      accent: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    },
    {
      step: "04",
      title: "ACCESSIBILITY",
      heading: "Built for every sight and voice",
      description: "Listen to explanations out loud with built-in voice narration, switch to extra large text sizes, or view explanations in your regional language.",
      icon: Volume2,
      accent: "text-cyan-300 bg-cyan-500/15 border-cyan-500/30",
    },
  ];

  return (
    <section className="py-12 md:py-16 space-y-10 max-w-6xl mx-auto border-t border-navy-700/60">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slateText-primary tracking-tight">
          How DigitalBridge makes technology understandable
        </h2>
        <p className="text-base sm:text-lg text-slateText-secondary leading-relaxed">
          Four core pillars designed to reduce digital anxiety and give you complete confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Card key={pillar.title} className="p-6 md:p-8 space-y-4 border border-navy-700 hover:border-navy-600 transition-colors">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl border ${pillar.accent} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-extrabold text-slateText-muted opacity-40 font-mono">
                  {pillar.step}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-tealAccent">
                  {pillar.title}
                </span>
                <h3 className="text-xl font-bold text-slateText-primary">
                  {pillar.heading}
                </h3>
                <p className="text-base text-slateText-secondary leading-relaxed pt-1">
                  {pillar.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
