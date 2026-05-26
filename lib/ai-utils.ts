// lib/ai-utils.ts
import { generateAIResponse, generateChatResponse } from "@/lib/ai";

/**
 * Утилиты для удобного использования AI в разных контекстах
 */

/**
 * Генерирует JSON ответ от AI
 * @param prompt Промпт для AI
 * @param schema Пример структуры JSON
 * @returns Распарсенный JSON
 */
export async function generateJSON<T = Record<string, unknown>>(
  prompt: string,
  schema?: T
): Promise<T> {
  const schemaStr = schema
    ? `\n\nОтвет должен быть валидным JSON в формате:\n${JSON.stringify(schema, null, 2)}`
    : "\n\nОтвет должен быть валидным JSON.";

  const response = await generateAIResponse(
    `${prompt}${schemaStr}\n\nОтвечай ТОЛЬКО JSON без дополнительного текста.`,
    "gemini-1.5-flash",
    { temperature: 0.1 }
  );

  try {
    // Пытаемся найти JSON в ответе
    const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response);
  } catch (error) {
    console.error("Failed to parse JSON response:", response, error);
    throw new Error("Failed to generate valid JSON response");
  }
}

/**
 * Классифицирует текст на одну из предоставленных категорий
 */
export async function classifyText(
  text: string,
  categories: string[]
): Promise<{ category: string; confidence: number }> {
  const prompt = `Классифицируй следующий текст в одну из категорий: ${categories.join(", ")}

Текст: "${text}"

Ответь JSON:
{
  "category": "выбранная_категория",
  "confidence": 0.95
}`;

  return generateJSON(prompt);
}

/**
 * Суммаризирует текст
 */
export async function summarizeText(
  text: string,
  maxLength: number = 200
): Promise<string> {
  const prompt = `Создай краткое резюме следующего текста максимум ${maxLength} символов:

${text}`;

  return generateAIResponse(prompt, "gemini-1.5-flash", {
    temperature: 0.3,
    maxTokens: Math.ceil(maxLength / 4),
  });
}

/**
 * Переводит текст
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  const prompt = `Переведи следующий текст на ${targetLang}:

${text}`;

  return generateAIResponse(prompt, "gemini-1.5-flash", {
    temperature: 0.1,
    maxTokens: text.length,
  });
}

/**
 * Генерирует идеи на основе описания
 */
export async function generateIdeas(
  description: string,
  count: number = 5
): Promise<string[]> {
  const prompt = `Сгенерируй ${count} оригинальных идей на основе: "${description}"

Ответь JSON массивом строк:
["идея 1", "идея 2", ...]`;

  try {
    const result = await generateJSON(prompt);
    return Array.isArray(result) ? result : Object.values(result).flat();
  } catch (error) {
    console.error("Failed to generate ideas:", error);
    return [];
  }
}

/**
 * Проверяет грамматику и стиль текста
 */
export async function checkGrammar(text: string): Promise<{
  corrected: string;
  issues: Array<{ original: string; suggestion: string; explanation: string }>;
}> {
  const prompt = `Проверь грамматику и стиль текста. Ответь JSON:
{
  "corrected": "исправленный текст",
  "issues": [
    {
      "original": "неправильный фрагмент",
      "suggestion": "исправленный фрагмент", 
      "explanation": "объяснение ошибки"
    }
  ]
}

Текст: "${text}"`;

  return generateJSON(prompt);
}

/**
 * Генерирует вопросы для текста
 */
export async function generateQuestions(
  text: string,
  count: number = 5
): Promise<string[]> {
  const prompt = `На основе текста сгенерируй ${count} интересных и полезных вопросов:

${text}

Ответь JSON массивом:
["вопрос 1", "вопрос 2", ...]`;

  try {
    const result = await generateJSON(prompt);
    return Array.isArray(result) ? result : Object.values(result).flat();
  } catch (error) {
    console.error("Failed to generate questions:", error);
    return [];
  }
}

/**
 * Сравнивает два текста
 */
export async function compareTexts(
  text1: string,
  text2: string
): Promise<{ similarities: string[]; differences: string[] }> {
  const prompt = `Сравни два текста и выдели сходства и различия:

Текст 1: "${text1}"
Текст 2: "${text2}"

Ответь JSON:
{
  "similarities": ["сходство 1", "сходство 2"],
  "differences": ["различие 1", "различие 2"]
}`;

  return generateJSON(prompt);
}

/**
 * Структурирует неструктурированные данные
 */
export async function structureData(
  unstructuredText: string,
  expectedStructure: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const prompt = `Из следующего неструктурированного текста извлеки информацию и структурируй её согласно схеме:

Текст: "${unstructuredText}"

Схема структуры:
${JSON.stringify(expectedStructure, null, 2)}

Ответь ТОЛЬКО валидным JSON без дополнительного текста.`;

  return generateJSON(prompt, expectedStructure);
}

/**
 * Генерирует SEO описание
 */
export async function generateSEODescription(
  title: string,
  keywords: string[]
): Promise<{ metaDescription: string; keywords: string[] }> {
  const prompt = `Создай SEO оптимизированное описание для страницы:
Заголовок: "${title}"
Ключевые слова: ${keywords.join(", ")}

Требования:
- Meta description: 150-160 символов
- Включить основные ключевые слова
- Быть привлекательным для пользователя

Ответь JSON:
{
  "metaDescription": "текст",
  "keywords": ["ключевое слово", ...]
}`;

  return generateJSON(prompt);
}

/**
 * Генерирует контент на основе шаблона
 */
export async function generateContent(
  template: string,
  variables: Record<string, string>
): Promise<string> {
  const varsStr = Object.entries(variables)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const prompt = `Сгенерируй контент на основе шаблона и переменных:

Шаблон: ${template}

Переменные:
${varsStr}`;

  return generateAIResponse(prompt, "gemini-1.5-flash", {
    temperature: 0.7,
    maxTokens: 2048,
  });
}

/**
 * Реализует мультиопроса запрос (несколько вопросов сразу)
 */
export async function askMultiple(
  questions: string[]
): Promise<Record<string, string>> {
  const prompt = `Ответь на следующие вопросы:

${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Ответь JSON объектом:
{
  "question_1": "ответ",
  "question_2": "ответ",
  ...
}`;

  return generateJSON(prompt);
}

/**
 * Генерирует конфликтующие точки зрения на тему
 */
export async function generatePerspectives(
  topic: string,
  perspectives: number = 3
): Promise<Array<{ perspective: string; arguments: string[] }>> {
  const prompt = `Сгенерируй ${perspectives} разных точек зрения на тему: "${topic}"

Для каждой точки зрения:
1. Краткое описание
2. 3-4 аргумента

Ответь JSON:
[
  {
    "perspective": "название",
    "arguments": ["аргумент 1", "аргумент 2"]
  }
]`;

  try {
    const result = await generateJSON(prompt);
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Failed to generate perspectives:", error);
    return [];
  }
}
