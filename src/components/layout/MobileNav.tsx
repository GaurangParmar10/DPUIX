"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, HelpCircle, History, BookOpen, Settings } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { cn } from "@/lib/utils";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { t } = useAccessibility();

  const mobileNavItems = [
    { href: "/dashboard", label: t("navDashboard"), icon: Compass },
    { href: "/understand", label: t("navUnderstand"), icon: HelpCircle, isPrimary: true },
    { href: "/history", label: t("navHistory"), icon: History },
    { href: "/learn", label: t("navLearn"), icon: BookOpen },
    { href: "/settings", label: t("navSettings"), icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-xl border-t border-navy-700/80 px-2 py-2 shadow-2xl safe-area-pb"
    >
      <div className="flex items-center justify-between max-w-md mx-auto px-1">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={t("btnUnderstandScreen")}
                className={cn(
                  "flex flex-col items-center justify-center min-h-[56px] min-w-[64px] px-3.5 py-1.5 rounded-2xl bg-tealAccent text-navy-950 font-black shadow-lg shadow-tealAccent/25 active:scale-95 transition-all -mt-4 border-4 border-navy-900 touch-target-lg text-center",
                  isActive && "ring-3 ring-tealAccent ring-offset-2 ring-offset-navy-900"
                )}
              >
                <Icon className="h-6 w-6 stroke-[2.5]" />
                <span className="text-[10px] font-black tracking-tight mt-0.5 max-w-[70px] leading-tight truncate">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-h-[48px] min-w-[54px] px-2 py-1.5 rounded-2xl text-xs font-bold transition-all touch-target",
                isActive
                  ? "text-tealAccent font-black bg-navy-800 border border-tealAccent/30"
                  : "text-slateText-secondary hover:text-slateText-primary active:scale-95"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-tealAccent" : "text-slateText-muted")} />
              <span className="truncate max-w-[64px] text-[11px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
