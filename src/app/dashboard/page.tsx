"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DailySafetyTip } from "@/components/dashboard/DailySafetyTip";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  ImageIcon,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  BookOpen,
  Sparkles,
  Search,
  Key,
  CreditCard,
  Lock,
  Smartphone,
} from "lucide-react";

export default function DashboardPage() {
  const { t } = useAccessibility();
  const [greetingKey, setGreetingKey] = useState<"greetingMorning" | "greetingAfternoon" | "greetingEvening" | "greetingDay">("greetingDay");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingKey("greetingMorning");
    else if (hour < 17) setGreetingKey("greetingAfternoon");
    else setGreetingKey("greetingEvening");
  }, []);

  const popularTopics = [
    { labelKey: "topicOtp", icon: Key, href: "/learn?topic=otp" },
    { labelKey: "topicUpi", icon: CreditCard, href: "/learn?topic=upi" },
    { labelKey: "topicPermissions", icon: ShieldCheck, href: "/learn?topic=permissions" },
    { labelKey: "topicQr", icon: Search, href: "/learn?topic=qr" },
    { labelKey: "topicKyc", icon: Lock, href: "/learn?topic=kyc" },
    { labelKey: "topicShopping", icon: Smartphone, href: "/learn?topic=shopping" },
  ] as const;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 animate-in fade-in duration-300">
      {/* Personal Help Center Greeting Card */}
      <Card variant="highlight" className="p-6 sm:p-10 space-y-6 bg-navy-850 border-2 border-goldAccent/70 shadow-card-elevated rounded-3xl">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-goldAccent text-xs font-black uppercase tracking-widest">
            <Sparkles className="h-4 w-4 text-cream" />
            <span>{t("helpCenterBadge")}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slateText-primary tracking-tight">
            {t(greetingKey)}, {t("friend")}.
          </h1>
          <p className="text-lg sm:text-xl text-cream leading-relaxed max-w-2xl font-medium">
            {t("helpCenterQuestion")}
          </p>
        </div>

        {/* 3 Primary Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Action 1 */}
          <Link href="/understand">
            <div className="p-6 rounded-2xl bg-navy-900 border-2 border-goldAccent hover:bg-goldAccent/15 transition-all space-y-3 cursor-pointer group shadow-lg h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-xl bg-goldAccent text-navy-950 flex items-center justify-center font-black">
                  <ImageIcon className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-black text-cream group-hover:text-goldAccent transition-colors">
                  {t("dashCard1Title")}
                </h3>
                <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed font-medium">
                  {t("dashCard1Desc")}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-goldAccent pt-2">
                <span>{t("dashCard1Action")}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Action 2 */}
          <Link href="/understand">
            <div className="p-6 rounded-2xl bg-navy-900 border-2 border-navy-750 hover:border-goldAccent/60 hover:bg-navy-850 transition-all space-y-3 cursor-pointer group shadow-lg h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-xl bg-navy-800 border border-navy-700 text-brandBlue-light flex items-center justify-center font-black">
                  <MessageSquare className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-black text-cream group-hover:text-goldAccent transition-colors">
                  {t("dashCard2Title")}
                </h3>
                <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed font-medium">
                  {t("dashCard2Desc")}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-brandBlue-light pt-2">
                <span>{t("dashCard2Action")}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Action 3 */}
          <Link href="/learn">
            <div className="p-6 rounded-2xl bg-navy-900 border-2 border-navy-750 hover:border-goldAccent/60 hover:bg-navy-850 transition-all space-y-3 cursor-pointer group shadow-lg h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-12 w-12 rounded-xl bg-navy-800 border border-navy-700 text-risk-low-text flex items-center justify-center font-black">
                  <BookOpen className="h-6 w-6 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-black text-cream group-hover:text-goldAccent transition-colors">
                  {t("dashCard3Title")}
                </h3>
                <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed font-medium">
                  {t("dashCard3Desc")}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-risk-low-text pt-2">
                <span>{t("dashCard3Action")}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Popular Topics Bar */}
      <div className="space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-slateText-muted block">
          {t("popularTopics")}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {popularTopics.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <Link key={idx} href={topic.href}>
                <div className="px-4 py-2.5 rounded-xl bg-navy-850 border border-navy-750 hover:border-goldAccent text-xs font-bold text-cream flex items-center gap-2 shrink-0 transition-colors touch-target">
                  <Icon className="h-4 w-4 text-goldAccent shrink-0" />
                  <span>{t(topic.labelKey)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recently Understood Explanations */}
      <RecentActivity />

      {/* Today's Safety Tip */}
      <DailySafetyTip />
    </div>
  );
}
