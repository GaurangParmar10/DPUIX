"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAccessibility } from "@/context/AccessibilityContext";
import { AlertTriangle, RefreshCw, ImageIcon } from "lucide-react";

export interface AnalysisErrorViewProps {
  errorMessage?: string;
  onRetry: () => void;
  onChooseNewImage: () => void;
}

export const AnalysisErrorView: React.FC<AnalysisErrorViewProps> = ({
  errorMessage,
  onRetry,
  onChooseNewImage,
}) => {
  const { t } = useAccessibility();
  const displayError = errorMessage || t("errorViewDefaultMsg");

  return (
    <Card className="p-8 space-y-6 border-2 border-red-500/40 bg-navy-800 text-center max-w-xl mx-auto shadow-2xl">
      <div className="h-16 w-16 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mx-auto shadow-md">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-2xl font-extrabold text-slateText-primary">
          {t("errorViewTitle")}
        </h2>
        <p className="text-base text-slateText-secondary leading-relaxed">
          {displayError}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-navy-900 border border-navy-700 text-left space-y-1 text-xs text-slateText-secondary">
        <p className="font-bold text-slateText-primary">{t("errorTipsHeader")}</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("errorTip1")}</li>
          <li>{t("errorTip2")}</li>
        </ul>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <Button
          variant="primary"
          fullWidth
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={onRetry}
        >
          {t("btnTryAgain")}
        </Button>

        <Button
          variant="secondary"
          fullWidth
          leftIcon={<ImageIcon className="h-4 w-4" />}
          onClick={onChooseNewImage}
        >
          {t("btnChooseAnotherImage")}
        </Button>
      </div>
    </Card>
  );
};
