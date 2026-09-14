"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { DailySafetyQuiz } from "@/components/safety/DailySafetyQuiz";
import { DigitalDictionaryModal } from "@/components/learning/DigitalDictionaryModal";
import { useAccessibility } from "@/context/AccessibilityContext";
import {
  BookOpen,
  Lock,
  Smartphone,
  AlertTriangle,
  Link2,
  CheckCircle2,
  HelpCircle,
  BookMarked,
  Sparkles,
} from "lucide-react";

export default function LearnPage() {
  const { t } = useAccessibility();
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

  const lessons = [
    {
      id: "otp",
      icon: Lock,
      title: t("lessonOtpTitle"),
      tag: t("lessonOtpTag"),
      summary: t("lessonOtpSummary"),
      points: [
        t("lessonOtpP1"),
        t("lessonOtpP2"),
        t("lessonOtpP3"),
      ],
    },
    {
      id: "messages",
      icon: AlertTriangle,
      title: t("lessonMsgTitle"),
      tag: t("lessonMsgTag"),
      summary: t("lessonMsgSummary"),
      points: [
        t("lessonMsgP1"),
        t("lessonMsgP2"),
        t("lessonMsgP3"),
      ],
    },
    {
      id: "permissions",
      icon: Smartphone,
      title: t("lessonPermTitle"),
      tag: t("lessonPermTag"),
      summary: t("lessonPermSummary"),
      points: [
        t("lessonPermP1"),
        t("lessonPermP2"),
        t("lessonPermP3"),
      ],
    },
    {
      id: "links",
      icon: Link2,
      title: t("lessonLinkTitle"),
      tag: t("lessonLinkTag"),
      summary: t("lessonLinkSummary"),
      points: [
        t("lessonLinkP1"),
        t("lessonLinkP2"),
        t("lessonLinkP3"),
      ],
    },
    {
      id: "unsure",
      icon: HelpCircle,
      title: t("lessonUnsureTitle"),
      tag: t("lessonUnsureTag"),
      summary: t("lessonUnsureSummary"),
      points: [
        t("lessonUnsureP1"),
        t("lessonUnsureP2"),
        t("lessonUnsureP3"),
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-navy-850 border-2 border-goldAccent/70 rounded-3xl p-6 sm:p-8 space-y-4 shadow-card">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-navy-750 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-goldAccent text-navy-950 flex items-center justify-center font-black shadow-md">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-cream tracking-tight">
                {t("learnTitle")}
              </h1>
              <p className="text-xs sm:text-sm text-slateText-secondary font-medium mt-0.5">
                {t("learnSubtitle")}
              </p>
            </div>
          </div>

          {/* My Digital Dictionary CTA */}
          <button
            onClick={() => setIsDictionaryOpen(true)}
            className="px-5 py-3 rounded-2xl bg-goldAccent text-navy-950 font-black text-sm hover:bg-goldAccent-hover transition-all flex items-center gap-2 shadow-lg touch-target"
          >
            <BookMarked className="h-5 w-5" />
            <span>{t("myDigitalDictionaryBtn")}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-goldAccent font-bold bg-navy-900 px-4 py-2.5 rounded-2xl border border-navy-750">
          <Sparkles className="h-4 w-4 shrink-0 text-cream" />
          <span>{t("noTechJargonNotice")}</span>
        </div>
      </div>

      {/* Digital Dictionary Modal */}
      <DigitalDictionaryModal isOpen={isDictionaryOpen} onClose={() => setIsDictionaryOpen(false)} />

      {/* Feature 1: Polished Daily Safety Quiz Component */}
      <DailySafetyQuiz />

      {/* Practical Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson) => {
          const Icon = lesson.icon;
          return (
            <Card key={lesson.id} className="p-6 space-y-4 border border-navy-700 bg-navy-800 rounded-2xl shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-tealAccent/15 text-tealAccent flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-navy-900 border border-navy-750 text-tealAccent">
                    {lesson.tag}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slateText-primary">{lesson.title}</h2>
                <p className="text-xs sm:text-sm font-medium text-slateText-secondary leading-relaxed">{lesson.summary}</p>

                <div className="pt-2 space-y-2 border-t border-navy-750">
                  {lesson.points.map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slateText-primary font-medium">
                      <CheckCircle2 className="h-4 w-4 text-tealAccent shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
