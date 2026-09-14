"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "teal" | "emerald" | "amber" | "rose" | "slate";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  variant = "teal",
  size = "md",
  icon,
  ...props
}) => {
  const variantClasses = {
    teal: "bg-tealAccent/15 text-tealAccent border-tealAccent/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    rose: "bg-red-500/15 text-red-400 border-red-500/30",
    slate: "bg-navy-750 text-slateText-secondary border-navy-700",
  };

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs font-medium rounded-md",
    md: "px-3 py-1 text-sm font-semibold rounded-lg",
    lg: "px-4 py-1.5 text-base font-semibold rounded-xl",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border font-sans tracking-wide select-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
