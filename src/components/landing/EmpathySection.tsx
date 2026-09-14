"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { HelpCircle, Lock, ShieldAlert, Smartphone, ArrowRight } from "lucide-react";

export const EmpathySection: React.FC = () => {
  const situations = [
    {
      icon: Lock,
      question: "What is this OTP message?",
      context: "A 6-digit code arrived on your phone, but you didn't request a password reset.",
      tag: "Verification & OTPs",
    },
    {
      icon: ShieldAlert,
      question: "Why is this app asking for permission?",
      context: "An application is requesting access to your contacts, camera, or full phone control.",
      tag: "App Permissions",
    },
    {
      icon: HelpCircle,
      question: "Is this payment message real?",
      context: "An SMS says your bank account will be blocked unless you tap a web link immediately.",
      tag: "Bank & UPI Alerts",
    },
    {
      icon: Smartphone,
      question: "What button am I supposed to press?",
      context: "A popup showed up while shopping online or filling out an official form.",
      tag: "Online Forms & Screens",
    },
  ];

  return (
    <section className="py-12 md:py-16 space-y-8 max-w-6xl mx-auto border-t border-navy-700/60">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slateText-primary tracking-tight">
          Not sure what that screen means?
        </h2>
        <p className="text-base sm:text-lg text-slateText-secondary leading-relaxed">
          You&apos;re not alone. Digital messages and phone popups can feel overwhelming, especially when they tell you to act quickly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {situations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card
              key={idx}
              variant="hoverable"
              interactive
              onClick={() => {
                window.location.href = "/understand";
              }}
              className="flex flex-col justify-between p-5 space-y-4 group"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-xl bg-tealAccent/15 text-tealAccent flex items-center justify-center group-hover:bg-tealAccent/25 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-navy-900 border border-navy-700 text-xs font-semibold text-tealAccent">
                  {item.tag}
                </span>
                <h3 className="text-lg font-bold text-slateText-primary group-hover:text-tealAccent transition-colors">
                  &quot;{item.question}&quot;
                </h3>
                <p className="text-sm text-slateText-secondary leading-relaxed">
                  {item.context}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-tealAccent group-hover:translate-x-1 transition-transform">
                <span>Check a screen like this</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
