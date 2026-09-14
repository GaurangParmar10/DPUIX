"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card3D } from "@/components/ui/Card3D";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Compass,
} from "lucide-react";

export default function LandingPage() {
  const { t } = useAccessibility();

  return (
    <div className="space-y-16 py-6 animate-in fade-in duration-300">
      {/* 1. Calm Reassuring Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto pt-4 pb-4">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-goldAccent/15 border border-goldAccent/40 text-goldAccent text-xs font-black uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-cream animate-pulse" />
            <span>{t("landingHeroBadge")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slateText-primary tracking-tight leading-[1.1]">
            {t("landingHeroTitle1")} <br />
            <span className="text-goldAccent">{t("landingHeroTitle2")}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-cream leading-relaxed max-w-xl font-medium">
            {t("heroSubtitle")}
          </p>

          {/* Primary CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link href="/understand">
              <Button
                variant="gold"
                size="lg"
                rightIcon={<ArrowRight className="h-6 w-6 stroke-[2.5]" />}
                className="text-xl py-4 px-8 shadow-xl shadow-goldAccent/20 touch-target-lg font-black w-full sm:w-auto hover:scale-105 transition-transform"
              >
                {t("btnUnderstandScreen")}
              </Button>
            </Link>

            <a href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="text-lg py-4 px-6 border-navy-700 text-slateText-secondary hover:text-cream hover:bg-navy-800 w-full sm:w-auto font-extrabold"
              >
                {t("landingHowItWorks")}
              </Button>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex items-center gap-4 text-xs sm:text-sm font-bold text-slateText-secondary flex-wrap border-t border-navy-750">
            <div className="flex items-center gap-1.5 text-goldAccent font-black">
              <ShieldCheck className="h-5 w-5" />
              <span>{t("landingTrustPrivate")}</span>
            </div>
            <span>•</span>
            <span>{t("landingTrustNoPasswords")}</span>
            <span>•</span>
            <span>{t("landingTrustPlainLanguage")}</span>
          </div>
        </div>

        {/* Hero Authentic Human Family 3D Interactive Card Visual */}
        <div className="lg:col-span-5 flex justify-center">
          <Card3D
            depth={18}
            glowColor="rgba(212, 175, 107, 0.35)"
            className="w-full max-w-md p-3 bg-navy-800 border-2 border-goldAccent/50 shadow-2xl space-y-3"
          >
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-navy-950 border border-navy-750 shadow-inner flex items-center justify-center">
              {/* Authentic family photo visual with 3D depth sheen */}
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src="/family_trust.jpg"
                alt="Older adult and younger family member using smartphone together with confidence"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = "/media__1788410745082.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent flex flex-col justify-end p-4 text-left">
                <span className="text-xs font-black uppercase text-goldAccent tracking-wide flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("familyTrustBadge")}
                </span>
                <p className="text-sm font-extrabold text-cream">{t("familyTrustTitle")}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-navy-900/90 border border-navy-750 text-xs sm:text-sm font-bold text-cream text-left flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-risk-low-text shrink-0" />
              <span>{t("familyTrustDesc")}</span>
            </div>
          </Card3D>
        </div>
      </section>

      {/* 2. How DigitalBridge Helps — 3 Interactive 3D Feature Cards */}
      <section id="how-it-works" className="space-y-8 max-w-5xl mx-auto pt-4">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-goldAccent">{t("coreProductExperience")}</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slateText-primary tracking-tight">
            {t("threeQuestionsTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card3D depth={12} glowColor="rgba(212, 175, 107, 0.3)">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-goldAccent text-navy-950 font-black flex items-center justify-center text-xl shadow-md">
                  <HelpCircle className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-black text-cream">{t("whatIsThis")}</h3>
              </div>
              <p className="text-base text-slateText-secondary leading-relaxed font-medium">
                {t("whatIsThisCardDesc")}
              </p>
            </div>
          </Card3D>

          {/* Card 2 */}
          <Card3D depth={12} glowColor="rgba(212, 175, 107, 0.3)">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-goldAccent text-navy-950 font-black flex items-center justify-center text-xl shadow-md">
                  <ShieldAlert className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-black text-cream">{t("isThisSafe")}</h3>
              </div>
              <p className="text-base text-slateText-secondary leading-relaxed font-medium">
                {t("isThisSafeCardDesc")}
              </p>
            </div>
          </Card3D>

          {/* Card 3 */}
          <Card3D depth={12} glowColor="rgba(212, 175, 107, 0.3)">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-goldAccent text-navy-950 font-black flex items-center justify-center text-xl shadow-md">
                  <Compass className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-black text-cream">{t("whatShouldIDo")}</h3>
              </div>
              <p className="text-base text-slateText-secondary leading-relaxed font-medium">
                {t("whatShouldIDoCardDesc")}
              </p>
            </div>
          </Card3D>
        </div>
      </section>

      {/* 3. Reassuring Privacy Note */}
      <section className="max-w-3xl mx-auto">
        <Card3D depth={8} glowColor="rgba(111, 156, 196, 0.25)" className="p-6 sm:p-8 space-y-3 border-2 border-navy-750 text-center">
          <div className="flex items-center justify-center gap-2 text-slateText-primary font-black text-lg">
            <Lock className="h-6 w-6 text-goldAccent" />
            <span>{t("privacyBoxTitle")}</span>
          </div>
          <p className="text-sm sm:text-base text-slateText-secondary leading-relaxed font-medium">
            {t("privacyBoxDesc")}
          </p>
        </Card3D>
      </section>
    </div>
  );
}
