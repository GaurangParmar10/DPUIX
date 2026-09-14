# DigitalBridge — Multimodal Analysis Fix

This build preserves the existing UI/UX and focuses on analysis correctness.

Key fixes:
- Real Gemini multimodal model is the source of truth; no silent hard-coded mock fallback.
- Follow-up questions now send conversation history to the model.
- Latest follow-up question is explicitly highest priority.
- The screenshot is re-read on every follow-up.
- Concrete step-by-step guidance is required, using exact visible controls when available.
- The model must not invent buttons, dialogs, permissions, URLs, or screen states.
- Current/app-specific knowledge can use Google Search grounding.
- Image MIME type is preserved instead of always sending PNG.
- Explicit OTP requests can return a visible OTP, but the application must never fabricate one.
- Existing HistoryService secret redaction remains in place.
- Existing dashboard/navbar/visual styling is intentionally unchanged.

Environment:
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.7-flash   # optional; this is the default

## Latest Root-Cause Fixes (September 2026)

- Fixed the critical upload bug in `ScreenUploadFlow.tsx`: real files were being
  stored as `blob:` object URLs and that URL was being sent to `/api/analyze` as
  if it were base64 image data. The Gemini vision API therefore could not receive
  the actual screenshot bytes. Files are now converted to real data URLs before
  analysis.
- Added browser-side image preparation/recompression so large screenshots stay
  within the inline-image request budget while retaining useful resolution for
  UI text and OCR.
- Sample SVG screenshots are rasterized to PNG before analysis instead of being
  mislabeled as PNG while still containing SVG text.
- Added a server-side guard that rejects non-base64 image payloads instead of
  silently attempting to analyze them.
- Added a server-side inline image-size guard with a clear user-facing error.
- Gemini API authentication now uses the `x-goog-api-key` header instead of
  putting the API key in the request URL.
- Strengthened the multimodal system instruction so the latest user question
  controls the response, follow-ups re-read the screenshot, and task questions
  receive concrete next actions rather than generic safety filler.
- Initial analysis now seeds `chatHistory`, so the first follow-up has the
  original question and assistant response as conversational context.
- Disabled the misleading hard-coded mock analysis provider, including its fake
  OTP value. Production analysis must use the real multimodal provider.
