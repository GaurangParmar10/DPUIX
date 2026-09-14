import { en } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";
import { bn } from "./bn";
import { ta } from "./ta";
import { es } from "./es";
import { LanguageOption } from "@/context/AccessibilityContext";

export type TranslationKeys = keyof typeof en;

export const translations: Record<LanguageOption, typeof en> = {
  en,
  hi,
  mr,
  bn,
  ta,
  es,
};

/**
 * Global translation helper function
 */
export function t(lang: LanguageOption, key: TranslationKeys): string {
  const dict = translations[lang] || en;
  return dict[key] || en[key] || String(key);
}
