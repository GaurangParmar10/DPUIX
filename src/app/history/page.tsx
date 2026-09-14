"use client";

import React from "react";
import { HistoryListView } from "@/components/history/HistoryListView";
import { LightweightLearning } from "@/components/learning/LightweightLearning";

export default function HistoryPage() {
  return (
    <div className="space-y-8 py-2 max-w-5xl mx-auto">
      <HistoryListView />
      <LightweightLearning />
    </div>
  );
}
