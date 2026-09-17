import { NextRequest, NextResponse } from "next/server";
import { StructuredAnalysisResponse } from "@/types/analysis";
import { getMockAnalysis } from "@/lib/ai/mockProvider";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  hi: "Hindi (हिन्दी)",
  mr: "Marathi (मराठी)",
  es: "Spanish (Español)",
  bn: "Bengali (বাংলা)",
  ta: "Tamil (தமிழ்)",
};

function buildSystemPrompt(languageCode: string = "en"): string {
  const languageName = LANGUAGE_NAMES[languageCode] || "English";

  return `
You are DigitalBridge, an empathetic, highly intelligent multimodal digital assistant designed for parents, older adults, and digitally inexperienced users.

CRITICAL REQUIREMENT — MULTILINGUAL OUTPUT:
The user's selected interface language is "${languageCode}" (${languageName}).
YOU MUST GENERATE ALL TEXT FIELDS IN YOUR JSON RESPONSE (summary, directAnswer, riskTitle, riskReasons, whyAmISeeingThis, recommendedActions, prohibitedActions, explanation, limitations) ENTIRELY IN ${languageName.toUpperCase()}!

CRITICAL REQUIREMENT — REAL MULTIMODAL INTELLIGENCE & DIRECT ANSWERS:
1. DigitalBridge is a general-purpose multimodal assistant. DO NOT act as a simple category classifier or return generic template responses.
2. ABSOLUTELY UNACCEPTABLE TEMPLATE RESPONSES:
   Never use generic boilerplate phrases like "Read the visible prompt carefully" or "Tap the primary action".
3. FOR EVERY REQUEST:
   a. Inspect the ACTUAL screenshot carefully.
   b. Perform OCR and read all readable text on screen.
   c. Identify the application, website, service, or operating system when possible (e.g. DigiLocker, Instagram, Android Settings, Windows, ChatGPT, Banking App, SMS message, etc.).
   d. Identify visible buttons, input fields, menus, dialogs, warnings, icons, and controls.
   e. Understand the user's exact question (or follow-up question in a multi-turn conversation).
   f. Answer the user's question DIRECTLY as the very first sentence of "summary" AND in "directAnswer".
      - If user asks "Should I allow this?", state directly based on the exact permission requested and visible buttons.
      - If user asks "How do I login?", inspect the actual login screen and give numbered steps using visible input fields and button labels.
      - If user asks "What is written here?", return actual OCR text from the image in "ocrText" and "summary".
      - If user asks "What is the OTP?", extract the actual visible 6-digit OTP code into "visibleOtp" and "directAnswer".
      - If user asks "Where should I click?" or "What should I press?", name the exact visible button immediately.
      - If user asks "Is this safe?" or "Is this a scam?", evaluate using visible evidence.
   g. Provide numbered actionable steps in "recommendedActions" using EXACT VISIBLE BUTTON LABELS ONLY (e.g. "OPEN SETTINGS", "CANCEL", "Log In", "Allow", "Deny").

OUTPUT FORMAT (JSON ONLY IN ${languageName.toUpperCase()}):
Return ONLY a raw JSON object with NO markdown wrapper (no \`\`\`json):
{
  "responseType": "STEP_BY_STEP" | "DIRECT_ANSWER" | "OCR" | "SAFETY_ASSESSMENT" | "TROUBLESHOOTING" | "UI_NAVIGATION" | "EXPLANATION" | "SCREEN_DESCRIPTION" | "GENERAL_TASK_GUIDANCE",
  "directAnswer": "Direct 1-sentence answer in ${languageName}",
  "summary": "DIRECT ANSWER in sentence 1, followed by screen-specific explanation in ${languageName}",
  "category": "App Permission" | "OTP / Verification" | "Banking / Payment" | "System Warning" | "Error Message" | "Login / Account" | "Delivery / Order" | "SMS / Message" | "Unknown",
  "riskLevel": "LOW" | "CAUTION" | "HIGH" | "SUSPICIOUS" | "UNKNOWN",
  "riskTitle": "Short human safety title in ${languageName}",
  "riskReasons": ["Visible evidence reason 1 in ${languageName}", "Reason 2 in ${languageName}"],
  "whyAmISeeingThis": "Screen-specific explanation in ${languageName}",
  "recommendedActions": ["1. Tap 'EXACT_BUTTON_LABEL' in ${languageName}...", "2. Step two in ${languageName}..."],
  "prohibitedActions": ["Contextual safety tip 1 in ${languageName}"],
  "detectedElements": ["App: Name", "Dialog: Title", "Button: EXACT_LABEL"],
  "ocrText": "Optional extracted visible text transcription",
  "visibleOtp": "Optional transient 6-digit OTP code if visible and explicitly requested",
  "explanation": "Optional detailed task explanation in ${languageName}",
  "confidence": 0.95,
  "limitations": ["Notes on screen context or image clarity in ${languageName}"]
}
`;
}

/**
 * 1. FREE GOOGLE GEMINI 1.5 FLASH VISION PROVIDER
 */
async function analyzeWithGemini(
  imageBase64: string,
  mimeType: string,
  userPrompt: string,
  systemPrompt: string,
  language: string
): Promise<{ result: StructuredAnalysisResponse | null; lastError?: string }> {
  const rawKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  const geminiApiKey = (rawKey || "").trim().replace(/^["']|["']$/g, "");
  if (!geminiApiKey || geminiApiKey.startsWith("your_")) {
    console.warn("[DigitalBridge API] GEMINI_API_KEY is missing or unconfigured in environment variables.");
    return { result: null, lastError: "GEMINI_API_KEY missing in environment variables" };
  }

  const base64Clean = imageBase64.replace(/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,/, "");
  const payload = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/png",
              data: base64Clean,
            },
          },
          {
            text: `${systemPrompt}\n\n${userPrompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
    },
  };

  const configuredModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const modelCandidates = Array.from(
    new Set([configuredModel, "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3-flash-preview", "gemini-2.5-flash"])
  );

  let lastError = "";

  for (const modelName of modelCandidates) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`;

    try {
      console.log(`[DigitalBridge API] Trying Google Gemini Vision (${modelName})...`);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleaned = rawText
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();
          const parsed: StructuredAnalysisResponse = JSON.parse(cleaned);
          console.log(`[DigitalBridge API] Successfully analyzed screenshot with Google Gemini Vision (${modelName})!`);
          return { result: parsed };
        }
      } else {
        const errText = await res.text();
        lastError = `Gemini (${modelName}) ${res.status}: ${errText.substring(0, 200)}`;
        console.warn(`[DigitalBridge API] ${lastError}`);
      }
    } catch (err: any) {
      lastError = `Gemini (${modelName}) fetch error: ${err?.message || String(err)}`;
      console.warn(`[DigitalBridge API] ${lastError}`);
    }
  }

  return { result: null, lastError };
}

/**
 * 2. FREE GROQ LLAMA-3.2 VISION PROVIDER
 */
async function analyzeWithGroq(
  image: string,
  userPrompt: string,
  systemPrompt: string
): Promise<StructuredAnalysisResponse | null> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey || groqApiKey.startsWith("your_")) return null;

  const groqModel = process.env.GROQ_MODEL || "llama-3.2-11b-vision-preview";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const payload = {
    model: groqModel,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: image } },
          { type: "text", text: userPrompt },
        ],
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  };

  try {
    console.log(`[DigitalBridge API] Trying Groq Vision (${groqModel})...`);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (rawText) {
        const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
        const parsed: StructuredAnalysisResponse = JSON.parse(cleaned);
        console.log("[DigitalBridge API] Successfully analyzed with Groq Vision!");
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[DigitalBridge API] Groq provider error:", err);
  }

  return null;
}

/**
 * 3. ALIBABA QWEN3-VL VISION PROVIDER
 */
async function analyzeWithQwen(
  image: string,
  userPrompt: string,
  systemPrompt: string
): Promise<StructuredAnalysisResponse | null> {
  const qwenApiKey = process.env.QWEN_API_KEY;
  if (!qwenApiKey || qwenApiKey.startsWith("your_")) return null;

  const qwenModel = process.env.QWEN_MODEL || "qwen3-vl-flash";
  const qwenBaseUrl = (
    process.env.QWEN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1"
  ).replace(/\/+$/, "");

  const payload = {
    model: qwenModel,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: image } },
          { type: "text", text: userPrompt },
        ],
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  };

  try {
    console.log(`[DigitalBridge API] Trying Qwen3-VL (${qwenModel})...`);
    const res = await fetch(`${qwenBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${qwenApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (rawText) {
        const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
        const parsed: StructuredAnalysisResponse = JSON.parse(cleaned);
        console.log("[DigitalBridge API] Successfully analyzed with Qwen3-VL!");
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[DigitalBridge API] Qwen provider error:", err);
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "INVALID_JSON", message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { image, language = "en", userQuestion, followUpQuestion, chatHistory } = body;

    // 1. Image Presence Check
    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "NO_IMAGE", message: "No image provided. Please upload a valid screenshot." },
        { status: 400 }
      );
    }

    // 2. Reject Browser Object / Blob URLs explicitly
    if (image.startsWith("blob:") || image.includes("URL.createObjectURL")) {
      return NextResponse.json(
        {
          error: "INVALID_IMAGE_PAYLOAD",
          message: "Browser object (blob) URLs are not accepted. The client must send a Base64 Data URL.",
        },
        { status: 400 }
      );
    }

    // 3. Data URL Format Check
    if (!image.startsWith("data:")) {
      return NextResponse.json(
        {
          error: "INVALID_IMAGE_FORMAT",
          message: "Image must be a valid Data URL (e.g., data:image/png;base64,...).",
        },
        { status: 400 }
      );
    }

    // 4. Question Length Check
    const activeQuestion = (followUpQuestion || userQuestion || "").trim();
    if (activeQuestion.length > 1000) {
      return NextResponse.json(
        {
          error: "QUESTION_TOO_LONG",
          message: "Question is too long. Please keep it under 1000 characters.",
        },
        { status: 400 }
      );
    }

    // 5. Sample Preset Detection
    const isSamplePreset = image.startsWith("data:image/svg+xml");

    // 6. Non-Preset Image Payload & Size Validation
    let mimeType = "image/png";
    if (!isSamplePreset) {
      const mimeMatch = image.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,/);
      if (mimeMatch && mimeMatch[1]) {
        mimeType = mimeMatch[1];
      }

      const base64Data = image.replace(/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,/, "");
      const approxSizeBytes = (base64Data.length * 3) / 4;
      if (approxSizeBytes > 15 * 1024 * 1024) {
        return NextResponse.json(
          {
            error: "PAYLOAD_TOO_LARGE",
            message: "Screenshot size exceeds the 15MB limit. Please choose a smaller image.",
          },
          { status: 400 }
        );
      }
    }

    // Handle Sample Presets via Mock Provider
    if (isSamplePreset) {
      console.log("[DigitalBridge API] Processing sample preset screen.");
      const mockResult = getMockAnalysis(image, {
        language,
        userQuestion: activeQuestion,
        chatHistory,
      });
      return NextResponse.json(mockResult);
    }

    const systemPrompt = buildSystemPrompt(language);

    let chatHistoryText = "";
    if (Array.isArray(chatHistory) && chatHistory.length > 0) {
      chatHistoryText =
        "\n\nPrevious Conversation History:\n" +
        chatHistory
          .map(
            (item: { sender: string; text: string }) =>
              `${item.sender === "user" ? "USER" : "ASSISTANT"}: ${item.text}`
          )
          .join("\n");
    }

    const userPromptText = activeQuestion
      ? `User Question: "${activeQuestion}"${chatHistoryText}\n\nInspect the screenshot carefully and answer this question directly in line 1 based on visible evidence.`
      : `Inspect the screenshot and explain what it is, what it is asking, and what to do step-by-step using exact visible button labels.${chatHistoryText}`;

    // =========================================================================
    // MULTI-PROVIDER CASCADE: 1. GEMINI (FREE) -> 2. GROQ (FREE) -> 3. QWEN -> 4. SMART ENGINE
    // =========================================================================

    // Try Google Gemini (100% Free Tier)
    const { result: geminiResult, lastError: geminiError } = await analyzeWithGemini(
      image,
      mimeType,
      userPromptText,
      systemPrompt,
      language
    );
    if (geminiResult) {
      if (activeQuestion) geminiResult.userQuestion = activeQuestion;
      if (chatHistory) geminiResult.chatHistory = chatHistory;
      return NextResponse.json(geminiResult);
    }

    // Try Groq Vision (100% Free Tier)
    const groqResult = await analyzeWithGroq(image, userPromptText, systemPrompt);
    if (groqResult) {
      if (activeQuestion) groqResult.userQuestion = activeQuestion;
      if (chatHistory) groqResult.chatHistory = chatHistory;
      return NextResponse.json(groqResult);
    }

    // Try Qwen3-VL
    const qwenResult = await analyzeWithQwen(image, userPromptText, systemPrompt);
    if (qwenResult) {
      if (activeQuestion) qwenResult.userQuestion = activeQuestion;
      if (chatHistory) qwenResult.chatHistory = chatHistory;
      return NextResponse.json(qwenResult);
    }

    // Fallback: Smart Multimodal Intelligence Engine (100% Free & Guarantees smooth response)
    console.log(`[DigitalBridge API] Fallback triggered. Gemini error: ${geminiError || "None"}`);
    const mockResult = getMockAnalysis(image, {
      language,
      userQuestion: activeQuestion,
      chatHistory,
    });

    if (geminiError) {
      mockResult.serviceNotice = `[Vercel Diagnosis] Gemini API provider did not respond: ${geminiError}`;
    }

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error("[DigitalBridge API] Unexpected server error:", error);
    return NextResponse.json(
      {
        error: "ANALYSIS_ERROR",
        message: "DigitalBridge encountered an error processing this request. Please try again.",
      },
      { status: 500 }
    );
  }
}

