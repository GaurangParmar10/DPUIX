"use client";

import React from "react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <div className="py-6 sm:py-10 flex items-center justify-center min-h-[75vh]">
      <OnboardingFlow />
    </div>
  );
}
