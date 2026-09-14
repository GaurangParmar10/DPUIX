"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

export type StatusVariant = "info" | "success" | "warning" | "error";

export interface StatusMessageProps {
  variant?: StatusVariant;
  title: string;
  description?: string;
  onDismiss?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  variant = "info",
  title,
  description,
  onDismiss,
  action,
  className,
}) => {
  const meta = {
    info: {
      bg: "bg-navy-800 border-navy-700 text-slateText-primary",
      iconBg: "text-tealAccent bg-tealAccent/15",
      Icon: Info,
    },
    success: {
      bg: "bg-emerald-950/20 border-emerald-500/30 text-emerald-100",
      iconBg: "text-emerald-400 bg-emerald-500/20",
      Icon: CheckCircle2,
    },
    warning: {
      bg: "bg-amber-950/20 border-amber-500/30 text-amber-100",
      iconBg: "text-amber-400 bg-amber-500/20",
      Icon: AlertTriangle,
    },
    error: {
      bg: "bg-red-950/25 border-red-500/35 text-red-100",
      iconBg: "text-red-400 bg-red-500/20",
      Icon: AlertCircle,
    },
  }[variant];

  const Icon = meta.Icon;

  return (
    <div
      className={cn("rounded-2xl border p-5 flex gap-4 items-start shadow-card relative", meta.bg, className)}
      role="alert"
    >
      <div className={cn("p-2.5 rounded-xl shrink-0 flex items-center justify-center", meta.iconBg)}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>

      <div className="flex-1 pr-6 space-y-1">
        <h4 className="text-base font-semibold tracking-wide">{title}</h4>
        {description && <p className="text-sm text-slateText-secondary leading-relaxed">{description}</p>}
        {action && <div className="pt-2">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notice"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slateText-secondary hover:text-slateText-primary hover:bg-navy-700 transition-colors touch-target min-h-[40px] min-w-[40px]"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};
