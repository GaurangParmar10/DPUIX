"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useAccessibility } from "@/context/AccessibilityContext";
import { QuizService, QuizQuestion, QuizProgress } from "@/lib/services/QuizService";
import { TranslationKeys } from "@/locales";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const DailySafetyQuiz: React.FC = () => {
  const { t } = useAccessibility();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [progress, setProgress] = useState<QuizProgress | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; title: string; text: string } | null>(null);

  useEffect(() => {
    const qList = QuizService.getDailyQuestions();
    const currentProgress = QuizService.getProgress();
    setQuestions(qList);
    setProgress(currentProgress);
  }, []);

  if (!progress || questions.length === 0) return null;

  const currentQuestionIdx = Math.min(progress.currentStep, questions.length - 1);
  const currentQuestionRaw = questions[currentQuestionIdx];

  const getLocalizedQuestion = (q: QuizQuestion, idx: number): QuizQuestion => {
    const qNum = idx + 1;
    const qKey = `quizQ${qNum}Question` as TranslationKeys;
    const catKey = `quizQ${qNum}Category` as TranslationKeys;
    const expKey = `quizQ${qNum}Explanation` as TranslationKeys;
    const opt1Key = `quizQ${qNum}Opt1` as TranslationKeys;
    const opt2Key = `quizQ${qNum}Opt2` as TranslationKeys;
    const opt3Key = `quizQ${qNum}Opt3` as TranslationKeys;

    const question = t(qKey) !== qKey ? t(qKey) : q.question;
    const category = t(catKey) !== catKey ? t(catKey) : q.category;
    const explanation = t(expKey) !== expKey ? t(expKey) : q.explanation;
    const opt1 = t(opt1Key) !== opt1Key ? t(opt1Key) : q.options[0]?.label;
    const opt2 = t(opt2Key) !== opt2Key ? t(opt2Key) : q.options[1]?.label;
    const opt3 = t(opt3Key) !== opt3Key ? t(opt3Key) : q.options[2]?.label;

    return {
      ...q,
      question,
      category,
      explanation,
      options: [
        { ...q.options[0], label: opt1 },
        { ...q.options[1], label: opt2 },
        { ...q.options[2], label: opt3 },
      ],
    };
  };

  const currentQuestion = currentQuestionRaw ? getLocalizedQuestion(currentQuestionRaw, currentQuestionIdx) : null;
  const isCompleted = progress.isCompleted || progress.currentStep >= 3;

  const handleSelectOption = (optionId: number, isCorrect: boolean) => {
    if (isProcessing || isCompleted || selectedOptionId !== null || !currentQuestion) return;

    setIsProcessing(true);
    setSelectedOptionId(optionId);

    const correctOption = currentQuestion.options.find((o) => o.isCorrect);

    const feedbackObj = {
      isCorrect,
      title: isCorrect
        ? `🎉 ${t("correctAnswerTag")}`
        : `✨ ${t("yourSelectionTag")}`,
      text: isCorrect
        ? `${currentQuestion.explanation}`
        : `${t("correctAnswerTag")}: "${correctOption?.label}". ${currentQuestion.explanation}`,
    };
    setFeedback(feedbackObj);

    const updatedAnswers = {
      ...progress.answers,
      [currentQuestion.id]: { selectedOptionId: optionId, isCorrect },
    };
    const nextStep = progress.currentStep + 1;
    const updatedScore = progress.score + (isCorrect ? 1 : 0);
    const updatedIsCompleted = nextStep >= 3;

    const updatedProgress: QuizProgress = {
      ...progress,
      currentStep: nextStep,
      answers: updatedAnswers,
      score: updatedScore,
      isCompleted: updatedIsCompleted,
    };

    const delay = isCorrect ? 1400 : 2600;

    setTimeout(() => {
      QuizService.saveProgress(updatedProgress);
      setProgress(updatedProgress);
      setSelectedOptionId(null);
      setFeedback(null);
      setIsProcessing(false);
    }, delay);
  };

  return (
    <Card variant="highlight" className="p-6 sm:p-8 space-y-6 bg-navy-850 border-2 border-goldAccent/70 rounded-3xl shadow-card-elevated">
      {/* Header & Step Indicator */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-navy-750 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-goldAccent text-navy-950 flex items-center justify-center font-black shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-cream tracking-tight">
              {t("dailySafetyCheckTitle")}
            </h2>
            <p className="text-xs text-slateText-secondary font-medium">
              {t("dailySafetyCheckSubtitle")}
            </p>
          </div>
        </div>

        {/* Question Progress Dots */}
        {!isCompleted && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-goldAccent">
              {t("questionPrefix")} {currentQuestionIdx + 1} {t("ofTotal")} 3
            </span>
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-3 w-3 rounded-full transition-all duration-300",
                    idx < currentQuestionIdx
                      ? "bg-risk-low-text"
                      : idx === currentQuestionIdx
                      ? "bg-goldAccent animate-pulse ring-2 ring-goldAccent/40"
                      : "bg-navy-750"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QUIZ ACTIVE VIEW */}
      {!isCompleted && currentQuestion ? (
        <div className="space-y-5">
          {/* Question Category & Text */}
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-goldAccent">
              {currentQuestion.category}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-cream leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const showResult = selectedOptionId !== null;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isProcessing || showResult}
                  onClick={() => handleSelectOption(option.id, option.isCorrect)}
                  className={cn(
                    "touch-target min-h-[52px] w-full p-4 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all text-left flex items-start gap-3 shadow-sm",
                    showResult
                      ? option.isCorrect
                        ? "bg-risk-low-bg border-risk-low-text text-risk-low-text font-black shadow-lg shadow-risk-low-text/20 ring-2 ring-risk-low-text/50 scale-[1.01]"
                        : isSelected
                        ? "bg-risk-high-bg border-risk-high-text text-risk-high-text font-bold"
                        : "bg-navy-900 border-navy-750 text-slateText-muted opacity-40"
                      : "bg-navy-900 border-navy-750 text-cream hover:border-goldAccent/70 hover:bg-navy-800"
                  )}
                >
                  {/* Status Indicator Icon */}
                  <span className="shrink-0 mt-0.5 font-bold">
                    {showResult ? (
                      option.isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-risk-low-text stroke-[3]" />
                      ) : isSelected ? (
                        <XCircle className="h-6 w-6 text-risk-high-text stroke-[3]" />
                      ) : (
                        <span className="h-6 w-6 rounded-full border-2 border-navy-700 flex items-center justify-center text-xs font-mono">
                          {option.id}
                        </span>
                      )
                    ) : (
                      <span className="h-6 w-6 rounded-full border-2 border-navy-700 flex items-center justify-center text-xs font-mono">
                        {option.id}
                      </span>
                    )}
                  </span>

                  <div className="flex-1 space-y-1">
                    <span className="leading-snug text-sm sm:text-base">{option.label}</span>

                    {/* ALWAYS SHOW GREEN TAG FOR CORRECT ANSWER */}
                    {showResult && option.isCorrect && (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-risk-low-text bg-risk-low-bg px-2.5 py-0.5 rounded-full border border-risk-low-border mt-1">
                        {t("correctAnswerTag")}
                      </span>
                    )}

                    {showResult && isSelected && !option.isCorrect && (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-risk-high-text bg-risk-high-bg px-2.5 py-0.5 rounded-full border border-risk-high-border mt-1">
                        {t("yourSelectionTag")}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* APPRECIATION & LEARNING FEEDBACK BANNER */}
          {feedback && (
            <div
              className={cn(
                "p-5 rounded-2xl border-2 space-y-2 animate-in fade-in duration-200 shadow-lg",
                feedback.isCorrect
                  ? "bg-risk-low-bg border-risk-low-text text-risk-low-text"
                  : "bg-navy-900 border-goldAccent text-cream"
              )}
            >
              <div className="flex items-center gap-2 font-black text-base">
                {feedback.isCorrect ? <CheckCircle2 className="h-5 w-5 text-risk-low-text shrink-0" /> : <Sparkles className="h-5 w-5 text-goldAccent shrink-0" />}
                <span>{feedback.title}</span>
              </div>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slateText-primary">
                {feedback.text}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* QUIZ COMPLETED VIEW WITH APPRECIATION */
        <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="h-16 w-16 rounded-2xl bg-goldAccent text-navy-950 flex items-center justify-center mx-auto shadow-xl">
            <ShieldCheck className="h-9 w-9 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black text-cream">
              {t("quizCompletedTitle")}
            </h3>
            <p className="text-sm sm:text-base font-medium text-slateText-secondary max-w-md mx-auto">
              {t("quizCompletedSubtitle")}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-navy-900 border-2 border-goldAccent text-goldAccent font-black text-lg shadow-md">
            <span>{t("quizScoreLabel")} {progress.score} / 3</span>
          </div>

          <p className="text-xs font-bold text-slateText-muted max-w-sm mx-auto">
            {t("comeBackTomorrow")}
          </p>
        </div>
      )}
    </Card>
  );
};
