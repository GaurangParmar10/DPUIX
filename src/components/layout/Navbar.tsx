"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Compass, HelpCircle, History, BookOpen, Settings, Sparkles } from "lucide-react";
import { AccessibilityMenu } from "@/components/accessibility/AccessibilityMenu";
import { useAccessibility } from "@/context/AccessibilityContext";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useAccessibility();
  const [showFirstTimeBanner, setShowFirstTimeBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isComplete = localStorage.getItem("db_onboarding_complete");
      if (isComplete !== "true" && pathname !== "/onboarding") {
        setShowFirstTimeBanner(true);
      } else {
        setShowFirstTimeBanner(false);
      }
    }
  }, [pathname]);

  const navItems = [
    { href: "/dashboard", label: t("navDashboard"), icon: Compass },
    { href: "/understand", label: t("navUnderstand"), icon: HelpCircle },
    { href: "/history", label: t("navHistory"), icon: History },
    { href: "/learn", label: t("navLearn"), icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-navy-900/90 backdrop-blur-md border-b border-navy-700/80 shadow-md">
      {/* First-Time Gentle Guide Banner */}
      {showFirstTimeBanner && (
        <div className="bg-tealAccent-bg border-b border-tealAccent/30 py-2.5 px-4 text-center text-xs sm:text-sm font-bold text-tealAccent flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-goldAccent" />
          <span>{t("newToApp")}</span>
          <Link
            href="/onboarding"
            className="underline font-extrabold text-slateText-primary hover:text-goldAccent ml-1"
          >
            {t("startGentleGuide")}
          </Link>
        </div>
      )}

      {/* Clean Uncrowded Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-tealAccent rounded-2xl p-1 shrink-0"
        >
          <div className="h-11 w-11 rounded-2xl bg-tealAccent-bg border border-tealAccent/40 flex items-center justify-center text-tealAccent group-hover:bg-tealAccent/25 transition-all shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slateText-primary block leading-none">
              Digital<span className="text-tealAccent">Bridge</span>
            </span>
            <span className="text-xs font-semibold text-slateText-secondary hidden md:block mt-0.5">
              {t("brandSubtitle")}
            </span>
          </div>
        </Link>

        {/* Center: Primary Application Navigation Links (Icons ~18px) */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "touch-target min-h-[48px] px-4 rounded-2xl text-sm font-bold flex items-center gap-2.5 transition-all",
                  isActive
                    ? "bg-navy-800 text-tealAccent font-extrabold border-2 border-tealAccent/40 shadow-sm"
                    : "text-slateText-secondary hover:text-slateText-primary hover:bg-navy-800/80"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-tealAccent" : "text-slateText-muted")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Settings Icon Link + Compact Accessibility Menu Popover */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/settings"
            aria-label={t("navSettings")}
            className={cn(
              "touch-target min-h-[48px] min-w-[48px] rounded-2xl flex items-center justify-center border-2 transition-all",
              pathname === "/settings"
                ? "bg-navy-800 border-tealAccent text-tealAccent font-extrabold shadow-sm"
                : "bg-navy-800 border-navy-700 text-slateText-secondary hover:text-slateText-primary hover:bg-navy-750"
            )}
            title={t("navSettings")}
          >
            <Settings className="h-5 w-5 stroke-[2.2]" />
          </Link>

          <AccessibilityMenu />
        </div>
      </div>
    </header>
  );
};
