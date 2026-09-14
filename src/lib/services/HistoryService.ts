import { StructuredAnalysisResponse, RiskLevel } from "@/types/analysis";

export interface HistoryItem {
  id: string;
  createdAt: string; // Human-readable date string
  timestamp: number; // Unix timestamp for sorting
  title: string;
  category: string;
  riskLevel: RiskLevel;
  riskTitle: string;
  summary: string;
  riskReasons: string[];
  recommendedActions: string[];
  prohibitedActions: string[];
  limitations: string[];
  isSaved?: boolean; // True if user explicitly clicked "Save for later"
  version: number;
}

const STORAGE_KEY = "digitalbridge_history_v1";

/**
 * Sanitize raw secrets (6-digit OTPs, PINs, passwords) before saving
 */
function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\b\d{6}\b/g, "[CODE PROTECTED]")
    .replace(/\b(otp|pin|password|cvv):\s*\d+/gi, "$1: [PROTECTED]");
}

function sanitizeArray(items: string[] = []): string[] {
  return items.map((item) => sanitizeText(item));
}

export class HistoryService {
  /**
   * Save a structured analysis response to local storage
   */
  static saveAnalysis(
    analysis: StructuredAnalysisResponse,
    customTitle?: string,
    isExplicitSave: boolean = true
  ): HistoryItem | null {
    if (typeof window === "undefined") return null;

    try {
      const history = this.getHistory();

      const newItem: HistoryItem = {
        id: `db_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        createdAt: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        timestamp: Date.now(),
        title: sanitizeText(customTitle || analysis.summary || "Screen Analysis"),
        category: analysis.category || "Unknown",
        riskLevel: analysis.riskLevel || "UNKNOWN",
        riskTitle: sanitizeText(analysis.riskTitle || "Safety Assessment"),
        summary: sanitizeText(analysis.summary || ""),
        riskReasons: sanitizeArray(analysis.riskReasons),
        recommendedActions: sanitizeArray(analysis.recommendedActions),
        prohibitedActions: sanitizeArray(analysis.prohibitedActions),
        limitations: sanitizeArray(analysis.limitations),
        isSaved: isExplicitSave,
        version: 1,
      };

      // Prevent exact duplicates within 10 seconds
      const existingIdx = history.findIndex(
        (item) =>
          item.title === newItem.title &&
          Math.abs(item.timestamp - newItem.timestamp) < 10000
      );

      if (existingIdx !== -1) {
        history[existingIdx].isSaved = history[existingIdx].isSaved || isExplicitSave;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return history[existingIdx];
      }

      const updatedHistory = [newItem, ...history];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return newItem;
    } catch (error) {
      console.warn("[HistoryService] Failed to save analysis to localStorage:", error);
      return null;
    }
  }

  /**
   * Retrieve all saved history items sorted newest first
   */
  static getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      // Validate & filter malformed entries
      return parsed
        .filter((item) => item && typeof item === "object" && item.id && item.summary)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (error) {
      console.warn("[HistoryService] Failed to read history from localStorage:", error);
      return [];
    }
  }

  /**
   * Toggle saved status for a specific item
   */
  static toggleSaved(id: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      const history = this.getHistory();
      const item = history.find((i) => i.id === id);
      if (item) {
        item.isSaved = !item.isSaved;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return true;
      }
      return false;
    } catch (error) {
      console.warn("[HistoryService] Failed to toggle saved status:", error);
      return false;
    }
  }

  /**
   * Get a single history item by ID
   */
  static getAnalysis(id: string): HistoryItem | null {
    const history = this.getHistory();
    return history.find((item) => item.id === id) || null;
  }

  /**
   * Delete a single history item by ID
   */
  static deleteAnalysis(id: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      const history = this.getHistory();
      const filtered = history.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.warn("[HistoryService] Failed to delete history item:", error);
      return false;
    }
  }

  /**
   * Clear all history items
   */
  static clearHistory(): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.warn("[HistoryService] Failed to clear history:", error);
      return false;
    }
  }
}
