"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Understanding your screen...",
  submessage = "This takes just a moment",
  size = "md",
  className,
}) => {
  const circleSizes = {
    sm: "h-8 w-8 border-2",
    md: "h-12 w-12 border-3",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center gap-4", className)}>
      <div className="relative flex items-center justify-center">
        {/* Calm pulsing background ring */}
        <div className="absolute inset-0 rounded-full bg-tealAccent/10 animate-ping opacity-25" />
        
        {/* Spinning indicator */}
        <div
          className={cn(
            "rounded-full border-navy-700 border-t-tealAccent animate-spin",
            circleSizes[size]
          )}
          role="status"
          aria-label="Loading"
        />
      </div>

      <div className="space-y-1">
        <p className="text-lg font-semibold text-slateText-primary">{message}</p>
        {submessage && <p className="text-sm text-slateText-secondary">{submessage}</p>}
      </div>
    </div>
  );
};
