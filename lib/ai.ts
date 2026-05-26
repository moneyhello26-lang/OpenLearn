import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API || "";

let _genAI: GoogleGenerativeAI | null = null;
function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    if (!apiKey) {
      throw new Error("GEMINI_API environment variable is not set. Add it to .env.local");
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

export type AIModel = "gemma-4-26b-a4b-it" | "gemini-pro-latest" | "gemini-flash-latest";

interface AIGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  topP?: number;
}

/**
 * Generate text using Google Gemini API
 * @param prompt The prompt to send to the AI
 * @param model The model to use (default: gemini-1.5-flash for speed)
 * @param options Additional generation options
 * @returns The generated text response
 */
export async function generateAIResponse(
  prompt: string,
  model: AIModel = "gemma-4-26b-a4b-it",
  options: AIGenerateOptions = {}
): Promise<string> {
  if (!apiKey) {
    // Graceful fallback when no API key is provided
    console.warn("GEMINI_API is not set. Returning mock AI response.");
    await new Promise(r => setTimeout(r, 1500)); // Simulate network latency
    if (prompt.includes("category")) return JSON.stringify({ isSafe: true, category: "Educational", confidence: 0.98 });
    if (prompt.includes("JSON")) return JSON.stringify({ data: "Mock JSON response" });
    return "💡 Это демонстрационный ответ, так как API-ключ Gemini не настроен. Пожалуйста, добавьте `GEMINI_API=ваш_ключ` в файл `.env.local`, чтобы включить настоящую генерацию.";
  }

  try {
    const generativeModel = getGenAI().getGenerativeModel({ model });

    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      topK: options.topK ?? 40,
      topP: options.topP ?? 0.95,
      maxOutputTokens: options.maxTokens ?? 2048,
    };

    const result = await generativeModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (prompt.includes("category")) return JSON.stringify({ isSafe: true, category: "Error", confidence: 0 });
    const msg = error instanceof Error ? error.message : String(error);
    return `💡 Ошибка API: ${msg}`;
  }
}

/**
 * Generate chat response with conversation history
 * @param messages Array of messages in conversation
 * @param model The model to use
 * @param options Additional generation options
 */
export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  model: AIModel = "gemma-4-26b-a4b-it",
  options: AIGenerateOptions = {}
): Promise<string> {
  if (!apiKey) {
    console.warn("GEMINI_API is not set. Returning mock Chat response.");
    await new Promise(r => setTimeout(r, 1200));
    return "🤖 *Демо-режим*: Ваш API ключ не настроен. Я искусственный интеллект-заглушка. Чтобы общаться со мной по-настоящему, добавьте `GEMINI_API` в `.env.local`.";
  }

  try {
    const generativeModel = getGenAI().getGenerativeModel({ model });

    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      topK: options.topK ?? 40,
      topP: options.topP ?? 0.95,
      maxOutputTokens: options.maxTokens ?? 2048,
    };

    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content }],
    }));

    const result = await generativeModel.generateContent({
      contents,
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return `🤖 *Ошибка API*: ${msg}`;
  }
}

/**
 * Find suitable universities based on student profile
 */
export async function findUniversities(studentProfile: {
  gpa: number;
  sat?: number;
  ielts?: number;
  specialization: string;
  countryPreference?: string;
}): Promise<string> {
  const prompt = `You are an expert university admission consultant. Based on the following student profile, recommend 5-10 suitable universities with brief explanations.

Student Profile:
- GPA: ${studentProfile.gpa}
- SAT Score: ${studentProfile.sat || "Not provided"}
- IELTS Score: ${studentProfile.ielts || "Not provided"}
- Desired Specialization: ${studentProfile.specialization}
- Country Preference: ${studentProfile.countryPreference || "No preference"}

Please provide:
1. University name
2. Why it's a good fit
3. Application requirements
4. Estimated acceptance rate for this profile

Format the response in a clear, readable way.`;

  return generateAIResponse(prompt, "gemma-4-26b-a4b-it", { temperature: 0.5 });
}

/**
 * Generate book/course description using AI
 */
export async function generateDescription(
  title: string,
  subject: string,
  context?: string
): Promise<string> {
  const prompt = `Generate a compelling and informative description (2-3 paragraphs) for ${context || "a course"}:
Title: ${title}
Subject: ${subject}

The description should be engaging, highlight key learning points, and be suitable for an educational platform.`;

  return generateAIResponse(prompt, "gemma-4-26b-a4b-it", { temperature: 0.8 });
}

/**
 * Answer user questions with context
 */
export async function answerQuestion(
  question: string,
  context?: string
): Promise<string> {
  const prompt = context
    ? `Using the following context:\n${context}\n\nAnswer this question: ${question}`
    : `Answer this question: ${question}`;

  return generateAIResponse(prompt, "gemma-4-26b-a4b-it", { temperature: 0.5 });
}

/**
 * Analyze and moderate content
 */
export async function analyzeContent(content: string): Promise<{
  ieltsBand?: string;
  toeflScore?: string;
  feedback?: string;
  error?: string;
}> {
  const prompt = `You are an expert IELTS and TOEFL examiner. Evaluate the following essay/text. 
Calculate an approximate IELTS Band Score (0-9) and a TOEFL iBT Writing Score (0-30).
Provide brief feedback on vocabulary, grammar, and coherence.

Content: "${content}"

Respond ONLY with valid JSON in this exact format:
{
  "ieltsBand": "7.0",
  "toeflScore": "24",
  "feedback": "Your detailed feedback here..."
}`;

  try {
    const response = await generateAIResponse(prompt, "gemma-4-26b-a4b-it", {
      temperature: 0.3,
    });

    if (response.includes("Ошибка API:")) {
      return { error: response };
    }

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return { error: "Failed to parse AI response into JSON." };
  } catch (error) {
    console.error("Error analyzing content:", error);
    return { error: "An unexpected error occurred during analysis." };
  }
}
