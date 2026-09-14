"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-base font-medium text-slateText-primary flex items-center gap-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-4 text-slateText-muted pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full min-h-[48px] px-4 py-3 bg-navy-900 border border-navy-700 rounded-xl text-slateText-primary placeholder:text-slateText-muted text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tealAccent focus:border-tealAccent disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-4 text-slateText-muted pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p className="text-sm font-medium text-red-400 flex items-center gap-1" role="alert">
            <span>⚠️</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-sm text-slateText-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
