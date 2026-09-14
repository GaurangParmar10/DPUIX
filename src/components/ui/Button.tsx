"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline" | "gold";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "default",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base styles ensuring minimum 48px-56px touch targets for accessibility
    const baseStyles =
      "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-tealAccent focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none tracking-wide text-base";

    const variants = {
      primary:
        "bg-tealAccent text-navy-950 hover:bg-tealAccent-hover active:scale-[0.98] shadow-lg shadow-tealAccent/20 font-extrabold",
      secondary:
        "bg-navy-750 text-slateText-primary border border-navy-700 hover:bg-navy-700 hover:border-slate-500 active:scale-[0.98]",
      gold:
        "bg-goldAccent text-navy-950 hover:bg-goldAccent-hover active:scale-[0.98] shadow-lg shadow-goldAccent/20 font-extrabold",
      ghost:
        "bg-transparent text-slateText-secondary hover:text-slateText-primary hover:bg-navy-750 active:scale-[0.98]",
      destructive:
        "bg-risk-high-bg border border-risk-high-border text-risk-high-text hover:bg-red-950/90 active:scale-[0.98] font-bold",
      outline:
        "bg-transparent border-2 border-tealAccent/50 text-tealAccent hover:bg-tealAccent/15 hover:border-tealAccent active:scale-[0.98] font-bold",
    };

    const sizes = {
      default: "min-h-[50px] px-6 py-3 text-base font-bold",
      sm: "min-h-[44px] px-4 py-2.5 text-sm font-bold",
      lg: "min-h-[56px] px-8 py-4 text-lg font-extrabold rounded-2xl",
      icon: "min-h-[48px] min-w-[48px] p-2.5 aspect-square justify-center",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-current" aria-hidden="true" />
            <span>Processing...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2.5">
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
