"use client";

import React, { useState } from "react";
import { Search, BookMarked, X, Sparkles, Check, HelpCircle } from "lucide-react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { cn } from "@/lib/utils";

export interface DictionaryTerm {
  term: string;
  category: string;
  technicalDef: string;
  simpleDef: string;
  whatToDo: string;
  whatToAvoid: string;
}

export const DigitalDictionaryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState("");
  const [explainLikeNew, setExplainLikeNew] = useState(true);

  const dictionaryTerms: DictionaryTerm[] = [
    {
      term: t("dictTerm1Name"),
      category: t("dictTerm1Category"),
      technicalDef: t("dictTerm1TechnicalDef"),
      simpleDef: t("dictTerm1SimpleDef"),
      whatToDo: t("dictTerm1WhatToDo"),
      whatToAvoid: t("dictTerm1WhatToAvoid"),
    },
    {
      term: t("dictTerm2Name"),
      category: t("dictTerm2Category"),
      technicalDef: t("dictTerm2TechnicalDef"),
      simpleDef: t("dictTerm2SimpleDef"),
      whatToDo: t("dictTerm2WhatToDo"),
      whatToAvoid: t("dictTerm2WhatToAvoid"),
    },
    {
      term: t("dictTerm3Name"),
      category: t("dictTerm3Category"),
      technicalDef: t("dictTerm3TechnicalDef"),
      simpleDef: t("dictTerm3SimpleDef"),
      whatToDo: t("dictTerm3WhatToDo"),
      whatToAvoid: t("dictTerm3WhatToAvoid"),
    },
    {
      term: t("dictTerm4Name"),
      category: t("dictTerm4Category"),
      technicalDef: t("dictTerm4TechnicalDef"),
      simpleDef: t("dictTerm4SimpleDef"),
      whatToDo: t("dictTerm4WhatToDo"),
      whatToAvoid: t("dictTerm4WhatToAvoid"),
    },
    {
      term: t("dictTerm5Name"),
      category: t("dictTerm5Category"),
      technicalDef: t("dictTerm5TechnicalDef"),
      simpleDef: t("dictTerm5SimpleDef"),
      whatToDo: t("dictTerm5WhatToDo"),
      whatToAvoid: t("dictTerm5WhatToAvoid"),
    },
  ];

  const [selectedTermIndex, setSelectedTermIndex] = useState(0);
  const selectedTerm = dictionaryTerms[selectedTermIndex] || dictionaryTerms[0];

  if (!isOpen) return null;

  const filteredTerms = dictionaryTerms.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-navy-850 border-2 border-goldAccent/80 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-navy-750 flex items-center justify-between gap-4 bg-navy-900">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-goldAccent text-navy-950 flex items-center justify-center font-black">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-goldAccent tracking-widest">{t("referenceGuide")}</span>
              <h2 className="text-xl sm:text-2xl font-black text-cream">{t("digitalDictionaryTitle")}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slateText-muted hover:text-cream hover:bg-navy-800 transition-colors touch-target"
            aria-label="Close Digital Dictionary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls: Search Bar & Toggle */}
        <div className="p-4 sm:p-6 border-b border-navy-750 bg-navy-850 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slateText-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchTermsPlaceholder")}
                className="w-full bg-navy-900 border border-navy-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold text-cream focus:outline-none focus:border-goldAccent placeholder:text-slateText-muted"
              />
            </div>

            {/* "Explain like I'm new" Mode Switch */}
            <button
              onClick={() => setExplainLikeNew(!explainLikeNew)}
              className={cn(
                "touch-target px-4 py-2.5 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-2 shrink-0",
                explainLikeNew
                  ? "bg-goldAccent text-navy-950 border-goldAccent shadow-md"
                  : "bg-navy-900 text-slateText-secondary border-navy-750"
              )}
            >
              <Sparkles className="h-4 w-4" />
              <span>{t("explainLikeNew")} {explainLikeNew ? t("on") : t("off")}</span>
            </button>
          </div>
        </div>

        {/* Dictionary Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Term List Sidebar */}
          <div className="md:col-span-5 border-r border-navy-750 overflow-y-auto p-3 space-y-2 max-h-60 md:max-h-none">
            {filteredTerms.map((item, idx) => {
              const isSelected = selectedTerm.term === item.term;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    const realIndex = dictionaryTerms.findIndex((t) => t.term === item.term);
                    if (realIndex !== -1) setSelectedTermIndex(realIndex);
                  }}
                  className={cn(
                    "p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-1",
                    isSelected
                      ? "bg-navy-800 border-goldAccent text-cream shadow-sm"
                      : "bg-navy-900/60 border-navy-750 text-slateText-secondary hover:border-navy-700 hover:text-cream"
                  )}
                >
                  <span className="text-[10px] font-extrabold uppercase text-goldAccent block">{item.category}</span>
                  <span className="text-sm font-extrabold block">{item.term}</span>
                </div>
              );
            })}
          </div>

          {/* Term Detail Panel */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-6 bg-navy-900/40">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-goldAccent block mb-1">
                {selectedTerm.category}
              </span>
              <h3 className="text-2xl font-black text-cream">{selectedTerm.term}</h3>
            </div>

            {/* Definition Box */}
            <div className="p-5 rounded-2xl bg-navy-850 border-2 border-navy-750 space-y-2">
              <span className="text-xs font-extrabold uppercase text-goldAccent block">
                {explainLikeNew ? t("simpleExplanationTitle") : t("technicalDefinitionTitle")}
              </span>
              <p className="text-base font-extrabold text-cream leading-relaxed">
                {explainLikeNew ? selectedTerm.simpleDef : selectedTerm.technicalDef}
              </p>
            </div>

            {/* What to do & What to avoid */}
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-risk-low-bg border border-risk-low-border flex items-start gap-3">
                <Check className="h-5 w-5 text-risk-low-text shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold uppercase text-risk-low-text block">{t("whatToDoLabel")}</span>
                  <p className="text-xs sm:text-sm font-bold text-cream mt-0.5">{selectedTerm.whatToDo}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-risk-high-bg border border-risk-high-border flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-risk-high-text shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-extrabold uppercase text-risk-high-text block">{t("whatToAvoidLabel")}</span>
                  <p className="text-xs sm:text-sm font-bold text-cream mt-0.5">{selectedTerm.whatToAvoid}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
