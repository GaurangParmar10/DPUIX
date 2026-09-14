export type RiskLevel = "LOW" | "CAUTION" | "HIGH" | "SUSPICIOUS" | "UNKNOWN";

export type ResponseType =
  | "SCREEN_DESCRIPTION"
  | "OCR"
  | "DIRECT_ANSWER"
  | "STEP_BY_STEP"
  | "SAFETY_ASSESSMENT"
  | "TROUBLESHOOTING"
  | "EXPLANATION"
  | "UI_NAVIGATION"
  | "GENERAL_TASK_GUIDANCE";

export interface StructuredAnalysisResponse {
  responseType?: ResponseType;
  directAnswer?: string;
  summary: string; // WHAT IS THIS? (Plain English explanation)
  category:
    | "SMS / Message"
    | "OTP / Verification"
    | "Banking / Payment"
    | "App Permission"
    | "System Warning"
    | "Error Message"
    | "Login / Account"
    | "Delivery / Order"
    | "Unknown";
  riskLevel: RiskLevel; // IS THIS SAFE?
  riskTitle: string; // Human title for risk state
  riskReasons: string[]; // Clear bullet rationale for risk assessment
  whyAmISeeingThis?: string; // WHY AM I SEEING THIS? Contextual explanation
  recommendedActions: string[]; // WHAT SHOULD I DO? (Step-by-step guidance)
  prohibitedActions: string[]; // WHAT NOT TO DO
  detectedElements: string[]; // Key text or button elements detected on screen
  ocrText?: string; // Clean visible text transcription when requested
  visibleOtp?: string; // Transient visible OTP code (ONLY shown in response, NEVER persisted)
  confidence: number | null; // 0.0 to 1.0 confidence score, or null
  limitations?: string[]; // Notes on image clarity, blurriness, or cropped context
  userQuestion?: string; // Optional user question/concern context
  explanation?: string; // Detailed conceptual or task explanation
  chatHistory?: Array<{ sender: "user" | "assistant"; text: string }>; // Multi-turn conversation history
  isQuotaExceeded?: boolean; // True if quota rate limit was encountered
  serviceNotice?: string; // User-friendly service notice banner message
}

export interface AnalysisOptions {
  language?: string; // Language code: "en", "hi", "es", "bn", "mr", "ta"
  userQuestion?: string; // Optional user question / concern
  followUpQuestion?: string; // Optional follow-up question in multi-turn conversation
  chatHistory?: Array<{ sender: "user" | "assistant"; text: string }>; // Conversation history
  useMock?: boolean; // Force mock provider for testing
}

