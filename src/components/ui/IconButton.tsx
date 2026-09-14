"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string; // Mandatory accessible ARIA label
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, icon, variant = "ghost", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "min-h-[40px] min-w-[40px] p-2",
      md: "min-h-[48px] min-w-[48px] p-3",
      lg: "min-h-[56px] min-w-[56px] p-4",
    };

    const variantClasses = {
      primary: "bg-tealAccent text-navy-950 hover:bg-tealAccent-hover",
      secondary: "bg-navy-800 text-slateText-primary border border-navy-700 hover:bg-navy-700",
      ghost: "text-slateText-secondary hover:text-slateText-primary hover:bg-navy-800",
      outline: "border border-navy-700 text-slateText-primary hover:bg-navy-800",
    };

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-tealAccent active:scale-95 disabled:opacity-50 touch-target",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
