"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { AccessibilityToolbar } from "@/components/accessibility/AccessibilityToolbar";
import { Sparkles } from "lucide-react";

export const QuickAccessibility: React.FC = () => {
  return (
    <section className="space-y-3 py-2 border-t border-navy-700/60 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-slateText-primary flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-tealAccent" />
          <span>Quick Viewing & Voice Tools</span>
        </h2>
      </div>

      <Card className="p-4 sm:p-5 border border-navy-700 bg-navy-850 space-y-3">
        <p className="text-xs sm:text-sm text-slateText-secondary">
          Adjust your text size, enable voice read aloud, or change language anytime:
        </p>
        <AccessibilityToolbar />
      </Card>
    </section>
  );
};
