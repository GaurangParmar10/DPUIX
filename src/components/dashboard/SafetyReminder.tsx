"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, AlertCircle } from "lucide-react";

export const SafetyReminder: React.FC = () => {
  return (
    <Card className="p-5 sm:p-6 border border-amber-500/30 bg-amber-950/15 rounded-2xl flex flex-col sm:flex-row items-start gap-4 shadow-sm">
      <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 flex items-center justify-center">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <span>Before you act</span>
        </h3>
        <p className="text-sm text-slateText-secondary leading-relaxed">
          If any message or phone call asks for your 6-digit OTP, banking password, or UPI PIN, pause immediately. Bank officials and customer support will <strong className="text-slateText-primary">NEVER</strong> ask for your secret OTP over the phone.
        </p>
      </div>
    </Card>
  );
};
