"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HelpCircle, Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 bg-navy-850 border-2 border-goldAccent/60 text-center space-y-6 rounded-3xl shadow-2xl">
        <div className="h-16 w-16 rounded-2xl bg-goldAccent/20 text-goldAccent flex items-center justify-center mx-auto border border-goldAccent/40 shadow-md">
          <HelpCircle className="h-9 w-9 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black uppercase text-goldAccent tracking-widest block">Page Not Found</span>
          <h1 className="text-3xl font-black text-cream tracking-tight">We Couldn&apos;t Find That Page</h1>
          <p className="text-sm font-medium text-slateText-secondary leading-relaxed">
            That screen or link doesn&apos;t seem to exist. Let&apos;s get you back to understanding your technology safely.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link href="/">
            <Button
              variant="gold"
              size="lg"
              fullWidth
              leftIcon={<Home className="h-5 w-5" />}
              className="font-black text-base py-3.5"
            >
              Return to Homepage
            </Button>
          </Link>

          <Link href="/understand">
            <Button
              variant="outline"
              size="default"
              fullWidth
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              className="text-slateText-secondary hover:text-cream border-navy-700"
            >
              Back to Screen Helper
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
