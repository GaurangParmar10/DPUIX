"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hoverable" | "bordered" | "highlight";
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", interactive = false, onClick, ...props }, ref) => {
    const baseClasses =
      "bg-navy-800 border border-navy-700 rounded-2xl p-6 transition-all duration-200 shadow-card";

    const variantClasses = {
      default: "",
      hoverable:
        "hover:border-navy-600 hover:bg-navy-750 cursor-pointer active:scale-[0.99]",
      bordered: "border-2 border-navy-600",
      highlight: "border-tealAccent/40 bg-navy-800/90 shadow-[0_0_20px_rgba(6,182,212,0.1)]",
    };

    return (
      <div
        ref={ref}
        tabIndex={interactive || onClick ? 0 : undefined}
        role={interactive || onClick ? "button" : undefined}
        onClick={onClick}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && onClick) {
            e.preventDefault();
            onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          baseClasses,
          variantClasses[variant],
          (interactive || onClick) && "cursor-pointer focus-visible:ring-3 focus-visible:ring-tealAccent outline-none",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
