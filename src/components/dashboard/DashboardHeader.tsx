"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Sunset } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";

export const DashboardHeader: React.FC = () => {
  const { t } = useAccessibility();
  const [greeting, setGreeting] = useState("Good day");
  const [TimeIcon, setTimeIcon] = useState<React.ComponentType<{ className?: string }>>(Sun);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setTimeIcon(() => Sun);
    } else if (hour < 17) {
      setGreeting("Good afternoon");
      setTimeIcon(() => Sunset);
    } else {
      setGreeting("Good evening");
      setTimeIcon(() => Moon);
    }
  }, []);

  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center gap-2 text-tealAccent text-sm font-extrabold uppercase tracking-wider">
        <TimeIcon className="h-4 w-4" />
        <span>{greeting}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slateText-primary tracking-tight">
        {t("dashboardTitle")}
      </h1>

      <p className="text-base sm:text-lg text-slateText-secondary max-w-2xl leading-relaxed">
        {t("dashboardSubtitle")}
      </p>
    </div>
  );
};
