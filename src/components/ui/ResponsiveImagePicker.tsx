"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UploadCloud, Image as ImageIcon, Camera, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ResponsiveImagePickerProps {
  onImageSelected?: (file: File, dataUrl: string) => void;
  selectedImage?: string | null;
  onClear?: () => void;
  className?: string;
}

export const ResponsiveImagePicker: React.FC<ResponsiveImagePickerProps> = ({
  onImageSelected,
  selectedImage,
  onClear,
  className,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (PNG, JPG, or screenshot).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("This image is too large. Please pick a smaller image.");
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string" && onImageSelected) {
        onImageSelected(file, reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="Upload screenshot or photo from device library"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        aria-label="Take a photo with camera"
        className="hidden"
        onChange={handleFileChange}
      />

      {!selectedImage ? (
        <Card
          variant={dragActive ? "highlight" : "default"}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed p-6 md:p-10 flex flex-col items-center justify-center text-center transition-all duration-200",
            dragActive ? "border-tealAccent bg-tealAccent/10" : "border-navy-700 bg-navy-800/80 hover:border-navy-600"
          )}
        >
          {/* Upload Icon */}
          <div className="h-16 w-16 rounded-2xl bg-tealAccent/15 text-tealAccent flex items-center justify-center mb-4 shadow-sm">
            <UploadCloud className="h-8 w-8" />
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-slateText-primary mb-2">
            Show DigitalBridge what&apos;s on your screen
          </h3>

          <p className="text-base text-slateText-secondary max-w-md mb-6 leading-relaxed">
            Upload a screenshot or photo of any confusing app, SMS, OTP, or error screen.
          </p>

          {/* Action Buttons for Mobile & Desktop */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <Button
              variant="primary"
              fullWidth
              leftIcon={<ImageIcon className="h-5 w-5" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Screenshot or Photo
            </Button>

            <Button
              variant="secondary"
              fullWidth
              leftIcon={<Camera className="h-5 w-5" />}
              onClick={() => cameraInputRef.current?.click()}
            >
              Take a Photo
            </Button>
          </div>

          <p className="text-xs text-slateText-muted mt-4">
            Supports PNG, JPG, WEBP • Max 15MB • Safe & Private
          </p>
        </Card>
      ) : (
        /* Image Preview Box */
        <Card className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>Screen image loaded successfully</span>
            </div>

            {onClear && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={onClear}
              >
                Choose Another Screen
              </Button>
            )}
          </div>

          <div className="relative w-full max-h-[400px] overflow-hidden rounded-xl border border-navy-700 bg-navy-900 flex items-center justify-center p-2">
            {/* eslint-disable-next-html-element-suppression */}
            {/* Standard img tag used for direct DataURL previews */}
            <img
              src={selectedImage}
              alt="Uploaded screen preview"
              className="max-h-[380px] w-auto object-contain rounded-lg shadow-md"
            />
          </div>
        </Card>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
