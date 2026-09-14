"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glowColor?: string;
  enableTilt?: boolean;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className,
  depth = 15,
  glowColor = "rgba(212, 175, 107, 0.25)",
  enableTilt = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotateX = ((mouseY - height / 2) / (height / 2)) * -depth;
    const rotateY = ((mouseX - width / 2) / (width / 2)) * depth;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);

    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    if (!enableTilt) return;
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.15s ease",
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-3xl overflow-hidden transition-all border-2 border-navy-750 bg-navy-850 p-6 shadow-card hover:shadow-card-elevated hover:border-goldAccent/50 group",
        className
      )}
      {...props}
    >
      {/* 3D Dynamic Specular Light Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          opacity: glarePosition.opacity,
        }}
      />

      {/* 3D Ambient Glow Aura */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          boxShadow: `0 0 30px ${glowColor}`,
        }}
      />

      {/* Card Content (Preserves 3D Depth) */}
      <div className="relative z-20 transition-transform duration-200 group-hover:translate-z-4">
        {children}
      </div>
    </div>
  );
};
