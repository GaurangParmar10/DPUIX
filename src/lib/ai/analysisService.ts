import { StructuredAnalysisResponse, AnalysisOptions } from "@/types/analysis";
import { getMockAnalysis } from "@/lib/ai/mockProvider";

/**
 * Clean client-side analysis service abstraction.
 * UI components call this method to analyze screenshots via backend AI providers.
 */
export async function analyzeScreen(
  imageDataUrl: string,
  options: AnalysisOptions = {}
): Promise<StructuredAnalysisResponse> {
  const isSamplePreset = imageDataUrl.startsWith("data:image/svg+xml");

  if (options.useMock) {
    return getMockAnalysis(imageDataUrl, options);
  }

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: imageDataUrl,
        language: options.language || "en",
        userQuestion: options.userQuestion,
        followUpQuestion: options.followUpQuestion,
        chatHistory: options.chatHistory,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      const errMsg =
        errJson?.message ||
        "DigitalBridge couldn't analyze this screenshot right now. The AI vision service is temporarily unavailable.";

      // Use local engine fallback ONLY for sample SVG preset screens when offline
      if (isSamplePreset) {
        console.warn("[AnalysisService] Sample preset analysis offline fallback.");
        return getMockAnalysis(imageDataUrl, options);
      }

      throw new Error(errMsg);
    }

    const data = await response.json();
    if (data.error) {
      if (isSamplePreset) return getMockAnalysis(imageDataUrl, options);
      throw new Error(data.message || data.error);
    }

    return data as StructuredAnalysisResponse;
  } catch (error) {
    if (isSamplePreset) {
      console.warn("[AnalysisService] Fetch error for sample preset. Using local engine.");
      return getMockAnalysis(imageDataUrl, options);
    }
    throw error;
  }
}

