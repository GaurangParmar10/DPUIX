"use client";

import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAccessibility } from "@/context/AccessibilityContext";
import { analyzeScreen } from "@/lib/ai/analysisService";
import { StructuredAnalysisResponse } from "@/types/analysis";
import { AnalysisLoadingView } from "@/components/analysis/AnalysisLoadingView";
import { AnalysisErrorView } from "@/components/analysis/AnalysisErrorView";
import { AnalysisResultView } from "@/components/result/AnalysisResultView";
import {
  UploadCloud,
  ImageIcon,
  RefreshCw,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { cn, compressImageForMobile } from "@/lib/utils";

export interface SamplePreset {
  id: string;
  title: string;
  tag: string;
  description: string;
  dataUrl: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "digilocker-permission",
    title: "DigiLocker Permission Request",
    tag: "DigiLocker",
    description: "DigiLocker asking for notification permissions with Open Settings & Cancel options.",
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='100%' height='100%' fill='%230E1116'/><rect x='20' y='20' width='560' height='320' rx='16' fill='%23151D2A' stroke='%23263449' stroke-width='2'/><text x='40' y='60' fill='%233EB489' font-family='sans-serif' font-size='18' font-weight='bold'>DigiLocker</text><rect x='40' y='85' width='520' height='160' rx='12' fill='%230A0D12' stroke='%2333445E'/><text x='60' y='120' fill='%23F3F4F6' font-family='sans-serif' font-size='16' font-weight='bold'>Permissions Required</text><text x='60' y='150' fill='%2394A3B8' font-family='sans-serif' font-size='14'>DigiLocker needs the following permissions to work properly:</text><text x='60' y='180' fill='%233EB489' font-family='sans-serif' font-size='14'>• Notifications</text><text x='60' y='210' fill='%2394A3B8' font-family='sans-serif' font-size='13'>Please enable them in the app settings.</text><text x='60' y='285' fill='%2394A3B8' font-family='sans-serif' font-size='14'>Buttons: [ Cancel ]            [ Open Settings ]</text></svg>",
  },
  {
    id: "bank-sms",
    title: "Suspicious Bank SMS",
    tag: "Bank Message",
    description: "SMS claiming bank account will be blocked unless urgent link is tapped.",
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='100%' height='100%' fill='%230E1116'/><rect x='20' y='20' width='560' height='320' rx='16' fill='%23151D2A' stroke='%23263449' stroke-width='2'/><text x='40' y='60' fill='%23E5A93C' font-family='sans-serif' font-size='16' font-weight='bold'>URGENT BANK NOTIFICATION</text><rect x='40' y='85' width='520' height='150' rx='12' fill='%230A0D12' stroke='%2333445E'/><text x='60' y='125' fill='%23F3F4F6' font-family='sans-serif' font-size='15'>ALERT: Your mobile verification token %23892011 is pending</text><text x='60' y='155' fill='%23F3F4F6' font-family='sans-serif' font-size='15'>authorization. Click http://verify-secure-act.info/auth</text><text x='60' y='185' fill='%23F3F4F6' font-family='sans-serif' font-size='15'>immediately or access will be restricted.</text><text x='40' y='280' fill='%2394A3B8' font-family='sans-serif' font-size='13'>Sender: +91-XXXXX-9821 • SMS Message</text></svg>",
  },
  {
    id: "otp-scam",
    title: "OTP Verification Code",
    tag: "OTP Code",
    description: "Popup asking for your 6-digit banking OTP code.",
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='100%' height='100%' fill='%230E1116'/><rect x='20' y='20' width='560' height='320' rx='16' fill='%23151D2A' stroke='%23263449' stroke-width='2'/><text x='40' y='60' fill='%23E5A93C' font-family='sans-serif' font-size='16' font-weight='bold'>ENTER VERIFICATION CODE</text><rect x='40' y='85' width='520' height='150' rx='12' fill='%230A0D12' stroke='%2333445E'/><text x='60' y='125' fill='%23F3F4F6' font-family='sans-serif' font-size='15'>Please share your 6-digit OTP code sent to your phone</text><text x='60' y='155' fill='%23F3F4F6' font-family='sans-serif' font-size='15'>to unlock your online account privileges.</text><text x='60' y='195' fill='%2394A3B8' font-family='sans-serif' font-size='14'>Code input: [ _ _ _ _ _ _ ]</text><text x='40' y='280' fill='%23F87171' font-family='sans-serif' font-size='13'>⚠️ Warning: Never share OTPs over phone calls</text></svg>",
  },
  {
    id: "app-permission",
    title: "App Permission Request",
    tag: "App Permission",
    description: "Photo editing application asking for full SMS & contacts permission.",
    dataUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'><rect width='100%' height='100%' fill='%230E1116'/><rect x='20' y='20' width='560' height='320' rx='16' fill='%23151D2A' stroke='%23263449' stroke-width='2'/><text x='40' y='60' fill='%23F87171' font-family='sans-serif' font-size='16' font-weight='bold'>APP PERMISSION REQUEST</text><rect x='40' y='85' width='520' height='150' rx='12' fill='%230A0D12' stroke='%2333445E'/><text x='60' y='125' fill='%23F3F4F6' font-family='sans-serif' font-size='15'>&quot;PhotoFX Editor&quot; wants access to:</text><text x='60' y='155' fill='%23F87171' font-family='sans-serif' font-size='15'>• Read all SMS text messages &amp; OTP codes</text><text x='60' y='185' fill='%23F87171' font-family='sans-serif' font-size='15'>• Read contacts list &amp; call history</text><text x='40' y='280' fill='%233EB489' font-family='sans-serif' font-size='14'>Buttons: [ Allow All Permissions ]   [ Deny ]</text></svg>",
  },
];

type AnalysisState = "SELECT" | "PREVIEW" | "ANALYZING" | "RESULT" | "ERROR";

export const ScreenUploadFlow: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<string>("Screenshot");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [flowState, setFlowState] = useState<AnalysisState>("SELECT");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<StructuredAnalysisResponse | null>(null);

  const { language, t } = useAccessibility();

  useEffect(() => {
    return () => {
      if (selectedImage && selectedImage.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImage);
      }
    };
  }, [selectedImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, file.name);
  };

  const processFile = (file: File, name: string) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("That file format isn't supported. Please choose a PNG, JPG, or WEBP screenshot.");
      setFlowState("ERROR");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg("That screenshot is too large. Please choose an image under 25MB.");
      setFlowState("ERROR");
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const rawDataUrl = reader.result as string;
      // Compress image for fast mobile upload and serverless API compatibility
      const compressedDataUrl = await compressImageForMobile(rawDataUrl);
      setSelectedImage(compressedDataUrl);
      setImageMeta(name || "Selected Screenshot");
      setFlowState("PREVIEW");
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read the image file. Please try selecting your screenshot again.");
      setFlowState("ERROR");
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: SamplePreset) => {
    setErrorMsg(null);
    setSelectedImage(preset.dataUrl);
    setImageMeta(preset.title);
    setFlowState("PREVIEW");
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserQuestion(val);
    if (val.length > 1000) {
      setQuestionError("That question is a little too long. Please keep it under 1000 characters.");
    } else {
      setQuestionError(null);
    }
  };

  const handleRemoveImage = () => {
    if (selectedImage && selectedImage.startsWith("blob:")) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(null);
    setImageMeta("Screenshot");
    setUserQuestion("");
    setQuestionError(null);
    setErrorMsg(null);
    setAnalysisResult(null);
    setFlowState("SELECT");
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage) return;

    if (userQuestion.length > 1000) {
      setQuestionError("That question is a little too long. Please keep it under 1000 characters.");
      return;
    }

    setFlowState("ANALYZING");
    setErrorMsg(null);

    try {
      // Ensure image is lightweight base64 for mobile network transfer
      const imagePayload = await compressImageForMobile(selectedImage);

      const questionPayload = userQuestion.trim()
        ? userQuestion.trim()
        : imageMeta && imageMeta !== "Screenshot" && imageMeta !== "Selected Screenshot"
        ? `Screen analysis for: ${imageMeta}`
        : undefined;

      const result = await analyzeScreen(imagePayload, {
        language,
        userQuestion: questionPayload,
      });
      if (!result.chatHistory || result.chatHistory.length === 0) {
        result.chatHistory = [
          { sender: "user", text: userQuestion.trim() || "What is this screen?" },
          { sender: "assistant", text: result.summary },
        ];
      }
      setAnalysisResult(result);
      setFlowState("RESULT");
    } catch (err: any) {
      console.error("[ScreenUploadFlow] Analysis error:", err);
      setErrorMsg(
        err?.message ||
          "DigitalBridge couldn't analyze this screenshot right now. The AI vision service is temporarily unavailable. Please try again in a moment."
      );
      setFlowState("ERROR");
    }
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
    if (file) processFile(file, file.name);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4 animate-in fade-in duration-300">
      {/* Single Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        aria-label="Choose screenshot from device"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 3-Step Guided Breadcrumb Progress Indicator */}
      <div className="bg-navy-850 border-2 border-navy-750 rounded-2xl p-3.5 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-xl mx-auto gap-2">
          {/* Step 1 */}
          <div className={cn("flex items-center gap-2 text-xs sm:text-sm font-extrabold transition-all", flowState === "SELECT" ? "text-tealAccent" : "text-slateText-muted")}>
            <span className={cn("h-7 w-7 rounded-full flex items-center justify-center font-mono text-xs border-2 font-bold", flowState === "SELECT" ? "border-tealAccent bg-tealAccent-bg text-tealAccent" : "border-tealAccent bg-tealAccent text-navy-950")}>
              {flowState !== "SELECT" ? "✓" : "1"}
            </span>
            <span>{t("uploadStep1")}</span>
          </div>

          <span className="h-0.5 flex-1 bg-navy-750" />

          {/* Step 2 */}
          <div className={cn("flex items-center gap-2 text-xs sm:text-sm font-extrabold transition-all", flowState === "PREVIEW" ? "text-tealAccent" : flowState === "ANALYZING" || flowState === "RESULT" ? "text-tealAccent" : "text-slateText-muted")}>
            <span className={cn("h-7 w-7 rounded-full flex items-center justify-center font-mono text-xs border-2 font-bold", flowState === "PREVIEW" ? "border-tealAccent bg-tealAccent-bg text-tealAccent" : flowState === "ANALYZING" || flowState === "RESULT" ? "border-tealAccent bg-tealAccent text-navy-950" : "border-navy-650 bg-navy-900 text-slateText-muted")}>
              {flowState === "ANALYZING" || flowState === "RESULT" ? "✓" : "2"}
            </span>
            <span>{t("uploadStep2")}</span>
          </div>

          <span className="h-0.5 flex-1 bg-navy-750" />

          {/* Step 3 */}
          <div className={cn("flex items-center gap-2 text-xs sm:text-sm font-extrabold transition-all", flowState === "ANALYZING" || flowState === "RESULT" ? "text-tealAccent" : "text-slateText-muted")}>
            <span className={cn("h-7 w-7 rounded-full flex items-center justify-center font-mono text-xs border-2 font-bold", flowState === "RESULT" ? "border-tealAccent bg-tealAccent text-navy-950" : flowState === "ANALYZING" ? "border-tealAccent bg-tealAccent-bg text-tealAccent" : "border-navy-650 bg-navy-900 text-slateText-muted")}>
              3
            </span>
            <span>{t("uploadStep3")}</span>
          </div>
        </div>
      </div>

      {/* Header Info */}
      {flowState !== "ANALYZING" && flowState !== "RESULT" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-tealAccent font-black text-xs uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            <span>{t("screenUnderstandingHelper")}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slateText-primary tracking-tight">
            {t("uploadTitle")}
          </h1>
          <p className="text-base sm:text-xl text-slateText-secondary leading-relaxed max-w-2xl font-medium">
            {t("uploadSubtitle")}
          </p>
        </div>
      )}

      {/* STATE 1: SELECT SCREEN IMAGE */}
      {flowState === "SELECT" && (
        <div className="space-y-10">
          <Card
            variant={dragActive ? "highlight" : "default"}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "p-8 sm:p-14 flex flex-col items-center justify-center text-center transition-all duration-200 bg-navy-800 border-3 border-dashed border-navy-700 shadow-card-elevated rounded-3xl",
              dragActive ? "border-tealAccent bg-tealAccent-bg/50" : "hover:border-navy-600"
            )}
          >
            <div className="h-20 w-20 rounded-3xl bg-navy-900 border-2 border-navy-700 text-tealAccent flex items-center justify-center mb-5 shadow-md">
              <UploadCloud className="h-10 w-10" />
            </div>

            <p className="text-xl font-extrabold text-slateText-primary mb-1">
              {t("dropScreenshotHere")}
            </p>
            <p className="text-xs sm:text-sm text-slateText-secondary font-medium mb-8">
              {t("imageSupportNotice")}
            </p>

            <div className="flex items-center gap-3 w-full max-w-xs justify-center mb-6">
              <span className="h-px bg-navy-700 flex-1" />
              <span className="text-xs font-black text-slateText-muted uppercase tracking-widest">{t("orDivider")}</span>
              <span className="h-px bg-navy-700 flex-1" />
            </div>

            {/* Single Prominent 56px Primary Button */}
            <div className="w-full max-w-sm mx-auto">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                leftIcon={<ImageIcon className="h-6 w-6" />}
                onClick={() => fileInputRef.current?.click()}
                className="py-4 text-lg font-black shadow-xl shadow-tealAccent/25 touch-target-lg"
              >
                {t("btnChooseFromPhotos")}
              </Button>
            </div>
          </Card>

          {/* Sample Screens Preset Row */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-extrabold text-slateText-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-goldAccent" />
              <span>{t("sampleHeader")}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {SAMPLE_PRESETS.map((preset) => (
                <Card
                  key={preset.id}
                  variant="hoverable"
                  interactive
                  onClick={() => handleSelectPreset(preset)}
                  className="p-4 space-y-3 border-2 border-navy-700 hover:border-tealAccent/50 flex flex-col items-center text-center group rounded-2xl shadow-sm"
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-navy-950 border border-navy-750 flex items-center justify-center p-1.5 shadow-inner">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img
                      src={preset.dataUrl}
                      alt={preset.title}
                      className="max-h-20 w-auto object-contain rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-slateText-primary group-hover:text-tealAccent transition-colors">
                    {preset.tag}
                  </span>
                </Card>
              ))}
            </div>
            <p className="text-xs text-slateText-secondary text-center font-medium">{t("sampleScreensNotice")}</p>
          </div>
        </div>
      )}

      {/* STATE 2: PREVIEW & OPTIONAL USER QUESTION */}
      {flowState === "PREVIEW" && selectedImage && (
        <Card className="p-6 sm:p-8 space-y-6 border-2 border-tealAccent/50 bg-navy-800 shadow-card-elevated rounded-3xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-navy-700 pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2.5 text-tealAccent font-black text-lg">
              <CheckCircle2 className="h-6 w-6 text-tealAccent" />
              <span>{t("screenshotLoaded")}</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={() => fileInputRef.current?.click()}
                className="font-bold"
              >
                {t("btnReplace")}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={handleRemoveImage}
              >
                {t("btnRemove")}
              </Button>
            </div>
          </div>

          {/* Screen Image Preview */}
          <div className="space-y-2">
            <div className="relative w-full max-h-[400px] overflow-hidden rounded-2xl border-2 border-navy-700 bg-navy-950 flex items-center justify-center p-3 shadow-inner">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={selectedImage}
                alt="Selected screenshot preview"
                className="max-h-[360px] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>
          </div>

          {/* OPTIONAL USER QUESTION FIELD */}
          <div className="p-5 sm:p-6 rounded-2xl bg-navy-900 border-2 border-navy-750 space-y-3">
            <div className="space-y-1">
              <label
                htmlFor="optional-user-question"
                className="text-base font-extrabold text-slateText-primary flex items-center gap-2"
              >
                <MessageSquare className="h-5 w-5 text-tealAccent" />
                <span>{t("optionalQuestionLabel")}</span>
              </label>
              <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed">
                {t("optionalQuestionHelper")}
              </p>
            </div>

            <Input
              id="optional-user-question"
              type="text"
              value={userQuestion}
              onChange={handleQuestionChange}
              placeholder={t("optionalQuestionPlaceholder")}
              error={questionError || undefined}
              className="bg-navy-950 border-navy-700 text-base py-3"
            />
          </div>

          <div className="p-4 rounded-2xl bg-navy-900/80 border border-navy-750 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-tealAccent shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed font-medium">
              {t("privacyUploadNotice")}
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight className="h-6 w-6" />}
              onClick={handleStartAnalysis}
              className="text-xl py-4 shadow-xl shadow-tealAccent/25 font-black touch-target-lg"
            >
              {t("btnUnderstandThisScreen")}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={handleRemoveImage}
              className="font-bold"
            >
              {t("btnChooseDifferentScreenshot")}
            </Button>
          </div>
        </Card>
      )}

      {/* STATE 3: ANALYZING */}
      {flowState === "ANALYZING" && (
        <AnalysisLoadingView imageThumbnail={selectedImage || undefined} />
      )}

      {/* STATE 4: RESULT VIEW */}
      {flowState === "RESULT" && analysisResult && (
        <AnalysisResultView
          analysis={analysisResult}
          originalImage={selectedImage}
          onReset={handleRemoveImage}
        />
      )}

      {/* STATE 5: ERROR */}
      {flowState === "ERROR" && (
        <AnalysisErrorView
          errorMessage={errorMsg || undefined}
          onRetry={handleStartAnalysis}
          onChooseNewImage={handleRemoveImage}
        />
      )}
    </div>
  );
};
