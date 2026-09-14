"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Lock, EyeOff, AlertCircle } from "lucide-react";

export const TrustSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 space-y-8 max-w-5xl mx-auto border-t border-navy-700/60">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-widest text-tealAccent">SAFETY & PRIVACY COMMITMENT</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slateText-primary tracking-tight">
          Understand before you act
        </h2>
        <p className="text-base sm:text-lg text-slateText-secondary leading-relaxed">
          DigitalBridge helps you spot potential warning signs, but we believe in honest guidance, not false promises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 space-y-3 border border-navy-700 bg-navy-800">
          <div className="h-12 w-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slateText-primary">Honest Safety Warnings</h3>
          <p className="text-sm text-slateText-secondary leading-relaxed">
            We flag common scam patterns and unverified web links. However, DigitalBridge will never guarantee that a screen is 100% safe — always verify requests with official apps.
          </p>
        </Card>

        <Card className="p-6 space-y-3 border border-navy-700 bg-navy-800">
          <div className="h-12 w-12 rounded-xl bg-tealAccent/15 text-tealAccent flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slateText-primary">Private Screen Processing</h3>
          <p className="text-sm text-slateText-secondary leading-relaxed">
            Screenshots uploaded to DigitalBridge are processed securely to generate your explanation and are never stored publicly or shared with third parties.
          </p>
        </Card>

        <Card className="p-6 space-y-3 border border-navy-700 bg-navy-800">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <EyeOff className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slateText-primary">You Are In Control</h3>
          <p className="text-sm text-slateText-secondary leading-relaxed">
            DigitalBridge gives you clear information and step-by-step guidance, empowering you to make informed digital choices with complete confidence.
          </p>
        </Card>
      </div>
    </section>
  );
};
