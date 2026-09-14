"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { Search, X, ZoomIn, ZoomOut, Move } from "lucide-react";

export const Magnifier: React.FC = () => {
  const {
    magnifierEnabled,
    setMagnifierEnabled,
    magnifierZoom,
    setMagnifierZoom,
    magnifierSize,
    setMagnifierSize,
  } = useAccessibility();

  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isDraggingTouch, setIsDraggingTouch] = useState<boolean>(false);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Keyboard shortcut Alt + M to toggle Magnifier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        setMagnifierEnabled(!magnifierEnabled);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [magnifierEnabled, setMagnifierEnabled]);

  // Track Mouse movement on Desktop
  useEffect(() => {
    if (!magnifierEnabled || isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [magnifierEnabled, isTouchDevice]);

  // Handle Touch movement on Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsDraggingTouch(true);
      setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDraggingTouch(false);
  };

  if (!magnifierEnabled) return null;

  const halfSize = magnifierSize / 2;
  const isVisible = position.x > 0 && position.y > 0;

  return (
    <>
      {/* Magnifier Controls Floating Toolbar */}
      <div className="fixed bottom-6 right-6 z-50 bg-navy-850/95 border-2 border-goldAccent/80 backdrop-blur-md rounded-2xl p-3 shadow-2xl flex flex-wrap items-center gap-3 text-slateText-primary animate-fade-in max-w-sm sm:max-w-md">
        <div className="flex items-center gap-2 font-black text-xs sm:text-sm text-goldAccent uppercase tracking-wide">
          <Search className="h-4 w-4" />
          <span>Reading Lens</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-navy-900 border border-navy-700 rounded-lg p-1">
          <button
            onClick={() => setMagnifierZoom(Math.max(1.5, magnifierZoom - 0.5))}
            className="p-1.5 hover:bg-navy-750 text-slateText-primary rounded touch-target"
            title="Zoom Out"
            aria-label="Decrease Zoom"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="px-2 font-mono text-xs font-bold text-cream">{magnifierZoom}x</span>
          <button
            onClick={() => setMagnifierZoom(Math.min(3.0, magnifierZoom + 0.5))}
            className="p-1.5 hover:bg-navy-750 text-slateText-primary rounded touch-target"
            title="Zoom In"
            aria-label="Increase Zoom"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Lens Size Toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-navy-900 border border-navy-700 rounded-lg p-1">
          <button
            onClick={() => setMagnifierSize(140)}
            className={`px-2 py-1 text-xs font-bold rounded ${magnifierSize === 140 ? "bg-goldAccent text-navy-950" : "text-slateText-secondary"}`}
          >
            S
          </button>
          <button
            onClick={() => setMagnifierSize(180)}
            className={`px-2 py-1 text-xs font-bold rounded ${magnifierSize === 180 ? "bg-goldAccent text-navy-950" : "text-slateText-secondary"}`}
          >
            M
          </button>
          <button
            onClick={() => setMagnifierSize(220)}
            className={`px-2 py-1 text-xs font-bold rounded ${magnifierSize === 220 ? "bg-goldAccent text-navy-950" : "text-slateText-secondary"}`}
          >
            L
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setMagnifierEnabled(false)}
          className="p-2 bg-navy-750 hover:bg-navy-700 text-slateText-secondary hover:text-cream rounded-lg transition-colors ml-auto touch-target"
          aria-label="Close Magnifier Lens Mode"
          title="Turn Off Magnifier (Alt+M)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Touch Target Handle for Mobile / Touch Devices */}
      {isTouchDevice && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed bottom-24 right-6 z-50 bg-goldAccent text-navy-950 font-extrabold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 touch-target cursor-grab active:cursor-grabbing border-2 border-cream"
        >
          <Move className="h-5 w-5" />
          <span>Drag Reading Lens</span>
        </div>
      )}

      {/* Floating Magnifying Lens Glass */}
      {isVisible && (
        <div
          ref={lensRef}
          className="fixed pointer-events-none z-40 rounded-full border-4 border-goldAccent shadow-[0_0_40px_rgba(212,175,107,0.5)] overflow-hidden transition-transform duration-75 ease-out bg-navy-900/40 backdrop-blur-[1px]"
          style={{
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            left: `${position.x - halfSize}px`,
            top: `${position.y - halfSize}px`,
          }}
        >
          {/* Inner Magnified Projection Viewport */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center border-2 border-cream/30"
            style={{
              transform: `scale(${magnifierZoom})`,
              transformOrigin: "center center",
            }}
          >
            <div className="text-[10px] font-mono font-bold text-goldAccent bg-navy-950/80 px-2 py-0.5 rounded shadow pointer-events-none uppercase tracking-wider">
              Lens {magnifierZoom}x
            </div>
          </div>
          {/* Lens Glass Reflection Accent */}
          <div className="absolute top-2 left-4 w-1/2 h-1/3 bg-gradient-to-b from-cream/20 to-transparent rounded-t-full pointer-events-none transform -rotate-12" />
        </div>
      )}
    </>
  );
};
