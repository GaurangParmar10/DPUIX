"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HeroVisualWidget } from "@/components/landing/HeroVisualWidget";
import { ShieldCheck, ArrowRight, HelpCircle, Sparkles } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 space-y-10 max-w-6xl mx-auto">
      {/* Text & Headline Header */}
      <div className="text-center space-y-5 max-w-3xl mx-auto px-2">
        <div className="inline-flex items-center justify-center">
          <Badge variant="teal" size="lg" icon={<Sparkles className="h-4 w-4" />}>
            Digital Accessibility & Safety Assistant
          </Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slateText-primary tracking-tight leading-[1.15]">
          Technology doesn&apos;t have to be <span className="text-tealAccent">confusing.</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slateText-secondary leading-relaxed max-w-2xl mx-auto">
          Show DigitalBridge what&apos;s on your screen. We&apos;ll help explain what it means, check for potential warning signs, and guide you step-by-step through what to do next.
        </p>

        {/* Hero Call to Actions */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="h-5 w-5" />}
            onClick={() => {
              window.location.href = "/understand";
            }}
          >
            Understand a Screen
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            leftIcon={<HelpCircle className="h-5 w-5" />}
            onClick={() => {
              const el = document.getElementById("how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See How It Works
          </Button>
        </div>
      </div>

      {/* Hero Visual Transformation Widget */}
      <div className="pt-4">
        <HeroVisualWidget />
      </div>
    </section>
  );
};
