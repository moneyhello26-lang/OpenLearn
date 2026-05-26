// lib/index.ts
/**
 * Централизованный экспорт всех AI функций и утилит
 * 
 * Используй: import { generateAIResponse, useAskAI } from "@/lib"
 * Вместо: import { generateAIResponse } from "@/lib/ai"
 *         import { useAskAI } from "@/lib/useAI"
 */

// Основные функции
export {
  generateAIResponse,
  generateChatResponse,
  findUniversities,
  generateDescription,
  answerQuestion,
  analyzeContent,
  type AIModel,
} from "@/lib/ai";

// Утилиты
export {
  generateJSON,
  classifyText,
  summarizeText,
  translateText,
  generateIdeas,
  checkGrammar,
  generateQuestions,
  compareTexts,
  structureData,
  generateSEODescription,
  generateContent,
  askMultiple,
  generatePerspectives,
} from "@/lib/ai-utils";

// React Hooks
export {
  useAIRequest,
  useUniversityFinder,
  useAskAI,
  useGenerateDescription,
} from "@/lib/useAI";

// Examples
export * from "@/lib/ai.examples.complete";
