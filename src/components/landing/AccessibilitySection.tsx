"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Type, Volume2, Eye, Globe, Touchpad, Smartphone, Sparkles } from "lucide-react";

export const AccessibilitySection: React.FC = () => {
  const { textScale, setTextScale, voicePlayback, toggleVoicePlayback, highContrast, toggleHighContrast } = useAccessibility();

  const features = [
    {
      icon: Type,
      title: "Larger Readable Typography",
      desc: "Instant text size controls. Switch between Normal, Large, and Extra Large text modes anytime without breaking screen layouts.",
    },
    {
      icon: Volume2,
      title: "Voice Explanations Aloud",
      desc: "Prefer listening? Tap the voice button on any screen to hear explanations read out loud in clear, natural speech.",
    },
    {
      icon: Eye,
      title: "High Contrast Viewing",
      desc: "Designed for eye comfort and high contrast visibility so warnings and steps stand out clearly day or night.",
    },
    {
      icon: Globe,
      title: "Regional Language Support",
      desc: "Understand explanations in English, Hindi, Spanish, Bengali, Marathi, and Tamil.",
    },
    {
      icon: Touchpad,
      title: "Large Touch Targets",
      desc: "All buttons and controls are at least 48×48px so they are easy to press without accidental taps.",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Thumb Navigation",
      desc: "Purpose-built for smartphones with thumb-friendly controls and zero tiny fonts.",
    },
  ];

  return (
    <section className="py-12 md:py-16 space-y-10 max-w-6xl mx-auto border-t border-navy-700/60">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-widest text-tealAccent">ACCESSIBILITY FOR ALL</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slateText-primary tracking-tight">
          Technology should work for everyone
        </h2>
        <p className="text-base sm:text-lg text-slateText-secondary leading-relaxed">
          Accessibility isn&apos;t an afterthought. It&apos;s built into every button, screen, and explanation.
        </p>
      </div>

      {/* Interactive Quick Try Controls */}
      <Card variant="highlight" className="p-6 md:p-8 space-y-4 max-w-3xl mx-auto text-center bg-navy-850">
        <div className="flex items-center justify-center gap-2 text-tealAccent font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Try Accessibility Controls Live Right Now</span>
        </div>

        <p className="text-sm sm:text-base text-slateText-secondary">
          Click these controls to test how the entire landing page instantly scales text, boosts contrast, or toggles voice reading:
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
          {/* Text Resizer Buttons */}
          <div className="flex items-center bg-navy-900 border border-navy-700 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setTextScale("normal")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${textScale === "normal" ? "bg-tealAccent text-navy-950" : "text-slateText-secondary"}`}
            >
              Normal Text
            </button>
            <button
              type="button"
              onClick={() => setTextScale("large")}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${textScale === "large" ? "bg-tealAccent text-navy-950" : "text-slateText-secondary"}`}
            >
              Large Text (A+)
            </button>
            <button
              type="button"
              onClick={() => setTextScale("xlarge")}
              className={`px-3 py-2 rounded-lg text-base font-extrabold transition-all ${textScale === "xlarge" ? "bg-tealAccent text-navy-950" : "text-slateText-secondary"}`}
            >
              XL Text (A++)
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={toggleHighContrast}
            leftIcon={<Eye className="h-4 w-4" />}
          >
            {highContrast ? "High Contrast Active" : "Toggle High Contrast"}
          </Button>
        </div>
      </Card>

      {/* Grid of features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-6 space-y-3 border border-navy-700 hover:border-navy-600 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-tealAccent/15 text-tealAccent flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slateText-primary">{item.title}</h3>
              <p className="text-sm text-slateText-secondary leading-relaxed">{item.desc}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
