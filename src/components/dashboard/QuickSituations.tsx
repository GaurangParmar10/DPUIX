"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Lock, ShieldAlert, CreditCard, Smartphone, AlertTriangle, ArrowRight } from "lucide-react";

export const QuickSituations: React.FC = () => {
  const router = useRouter();

  const situations = [
    {
      icon: Lock,
      title: "Strange SMS or OTP code",
      tag: "OTPs & Codes",
      desc: "Received a 6-digit verification code you didn't ask for.",
    },
    {
      icon: ShieldAlert,
      title: "App permission request",
      tag: "Permissions",
      desc: "An app is asking to read your contacts or text messages.",
    },
    {
      icon: CreditCard,
      title: "Bank or UPI alert",
      tag: "Payments",
      desc: "A message claiming your account will be blocked.",
    },
    {
      icon: Smartphone,
      title: "Confusing button or form",
      tag: "Screen Buttons",
      desc: "Not sure which option to tap on a website or form.",
    },
    {
      icon: AlertTriangle,
      title: "Phone warning popup",
      tag: "Device Alerts",
      desc: "Popup warning about full storage or virus scan.",
    },
  ];

  return (
    <section className="space-y-4 py-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slateText-primary">
          What can DigitalBridge help explain?
        </h2>
        <span className="text-xs font-semibold text-slateText-muted">
          Tap any situation to test
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {situations.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              variant="hoverable"
              interactive
              onClick={() => router.push("/understand")}
              className="p-5 flex flex-col justify-between space-y-3 group border border-navy-700 hover:border-tealAccent/40"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-tealAccent/15 text-tealAccent flex items-center justify-center group-hover:bg-tealAccent/25 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-navy-900 border border-navy-700 text-tealAccent">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slateText-primary group-hover:text-tealAccent transition-colors">
                  &quot;{item.title}&quot;
                </h3>

                <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-xs font-bold text-tealAccent group-hover:translate-x-1 transition-transform">
                <span>Check this type of screen</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
