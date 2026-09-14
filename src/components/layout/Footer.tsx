"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";

export const Footer: React.FC = () => {
  const { t } = useAccessibility();

  return (
    <footer className="bg-navy-950 border-t border-navy-700/80 pt-12 pb-16 text-slateText-secondary text-sm">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-navy-700/60 pb-8">
          {/* Logo & Tagline */}
          <div className="space-y-2 max-w-md">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-tealAccent/15 border border-tealAccent/30 flex items-center justify-center text-tealAccent">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-slateText-primary tracking-tight">
                Digital<span className="text-tealAccent">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-slateText-secondary leading-relaxed font-medium">
              {t("footerTagline")}
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
            <Link href="/dashboard" className="hover:text-tealAccent transition-colors">
              {t("navDashboard")}
            </Link>
            <Link href="/understand" className="hover:text-tealAccent transition-colors">
              {t("navUnderstand")}
            </Link>
            <Link href="/learn" className="hover:text-tealAccent transition-colors">
              {t("digitalLiteracy")}
            </Link>
            <Link href="/history" className="hover:text-tealAccent transition-colors">
              {t("navHistory")}
            </Link>
            <Link href="/settings" className="hover:text-tealAccent transition-colors">
              {t("accessibilitySettings")}
            </Link>
          </div>
        </div>

        {/* Bottom copyright & privacy statement */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slateText-muted font-semibold">
          <p>{t("footerCopyright")}</p>
          <div className="flex items-center gap-1.5 text-goldAccent font-black">
            <span>{t("footerBuiltFor")}</span>
            <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400/20" />
          </div>
        </div>
      </div>
    </footer>
  );
};
