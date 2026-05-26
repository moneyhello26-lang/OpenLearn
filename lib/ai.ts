import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API;

if (!apiKey) {
  throw new Error("GEMINI_API environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export type AIModel = "gemini-pro" | "gemini-1.5-pro" | "gemini-1.5-flash";

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
  model: AIModel = "gemini-1.5-flash",
  options: AIGenerateOptions = {}
): Promise<string> {
  try {
    const generativeModel = genAI.getGenerativeModel({ model });

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

    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error(`Failed to generate AI response: ${error}`);
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
  model: AIModel = "gemini-1.5-flash",
  options: AIGenerateOptions = {}
): Promise<string> {
  try {
    const generativeModel = genAI.getGenerativeModel({ model });

    const generationConfig = {
      temperature: options.temperature ?? 0.7,
      topK: options.topK ?? 40,
      topP: options.topP ?? 0.95,
      maxOutputTokens: options.maxTokens ?? 2048,
    };

    const contents = messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const result = await generativeModel.generateContent({
      contents,
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error(`Failed to generate chat response: ${error}`);
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

  return generateAIResponse(prompt, "gemini-1.5-pro", { temperature: 0.5 });
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

  return generateAIResponse(prompt, "gemini-1.5-flash", { temperature: 0.8 });
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

  return generateAIResponse(prompt, "gemini-1.5-pro", { temperature: 0.5 });
}

/**
 * Analyze and moderate content
 */
export async function analyzeContent(content: string): Promise<{
  isSafe: boolean;
  category: string;
  confidence: number;
  suggestions?: string;
}> {
  const prompt = `Analyze the following content for safety and appropriateness. Respond in JSON format with: isSafe (boolean), category (educational/inappropriate/spam/other), confidence (0-1), and suggestions if needed.

Content: "${content}"

Respond only with valid JSON.`;

  try {
    const response = await generateAIResponse(prompt, "gemini-1.5-flash", {
      temperature: 0.3,
    });

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      isSafe: true,
      category: "unknown",
      confidence: 0.5,
    };
  } catch (error) {
    console.error("Error analyzing content:", error);
    return {
      isSafe: true,
      category: "error",
      confidence: 0,
    };
  }
}
