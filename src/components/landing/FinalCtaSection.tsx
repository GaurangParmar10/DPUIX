"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 max-w-4xl mx-auto border-t border-navy-700/60">
      <Card variant="highlight" className="p-8 md:p-12 text-center space-y-6 bg-navy-850 border-2 border-tealAccent/40">
        <div className="h-16 w-16 rounded-2xl bg-tealAccent/15 text-tealAccent flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <div className="space-y-3 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slateText-primary tracking-tight">
            Something confusing on your screen?
          </h2>
          <p className="text-lg text-slateText-secondary leading-relaxed">
            Show it to DigitalBridge. We&apos;ll explain what it means, check for warning signs, and guide you through what to do next.
          </p>
        </div>

        <div className="pt-2 max-w-sm mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="h-5 w-5" />}
            onClick={() => {
              window.location.href = "/understand";
            }}
          >
            Understand a Screen Now
          </Button>
        </div>
      </Card>
    </section>
  );
};
