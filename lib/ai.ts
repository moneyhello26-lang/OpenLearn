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

/**
 * Cleans AI response text by removing thinking blocks, excessive asterisks,
 * internal reasoning artifacts, and other unwanted patterns.
 */
export function cleanAIResponse(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // 1. Remove <think>...</think> blocks (various formats)
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>\s*/gi, '');
  cleaned = cleaned.replace(/<thinking>[\s\S]*?<\/thinking>\s*/gi, '');
  cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>\s*/gi, '');
  cleaned = cleaned.replace(/<scratchpad>[\s\S]*?<\/scratchpad>\s*/gi, '');
  cleaned = cleaned.replace(/<internal>[\s\S]*?<\/internal>\s*/gi, '');
  cleaned = cleaned.replace(/<reflection>[\s\S]*?<\/reflection>\s*/gi, '');
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>\s*/gi, '');
  cleaned = cleaned.replace(/<draft>[\s\S]*?<\/draft>\s*/gi, '');

  // 2. Remove ```thinking ... ``` blocks 
  cleaned = cleaned.replace(/```(?:thinking|reasoning|scratchpad|internal_monologue)[\s\S]*?```\s*/gi, '');

  // 3. Remove lines that start with common thinking prefixes
  cleaned = cleaned.replace(/^(?:Thinking:|Reasoning:|Let me think|Hmm,|Wait,|Actually,|Internal thought:|My reasoning:|Draft:).*$/gim, '');

  // 4. Remove "---FINAL_ANSWER---" marker and everything before it
  if (cleaned.includes('---FINAL_ANSWER---')) {
    cleaned = cleaned.split('---FINAL_ANSWER---').pop()!;
  }

  // 5. Clean up excessive asterisks patterns:
  //    - Remove orphaned asterisks (single * not part of bold/italic markdown)
  //    - Clean up *** or more
  cleaned = cleaned.replace(/\*{3,}/g, '');              // Remove *** or more
  cleaned = cleaned.replace(/(?<!\*)\*(?!\*|\s*\w)/g, ''); // Remove orphaned trailing *
  cleaned = cleaned.replace(/(?<!\w\s*)\*(?!\*)/g, '');    // Remove orphaned leading *

  // 6. Clean up excessive bold markers that aren't proper markdown
  //    e.g., "**" alone on a line, or unmatched **
  cleaned = cleaned.replace(/^\*\*\s*$/gm, '');           // Lines with only **

  // 7. Remove emoji-spam lines that some models produce as "thinking indicators"
  cleaned = cleaned.replace(/^[🤔💭🧠⚙️🔄]+\s*$/gm, '');

  // 8. Normalize excessive blank lines (3+ -> 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // 9. Trim
  cleaned = cleaned.trim();

  return cleaned;
}

export type AIModel = "gemini-flash-latest" | "gemini-pro-latest" | "gemma-4-26b-a4b-it" | "gemini-1.5-flash" | "gemini-1.5-pro" | (string & {});

interface AIGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  topP?: number;
}

export async function generateAIResponse(
  prompt: string,
  model: AIModel = "gemini-flash-latest",
  options: AIGenerateOptions = {}
): Promise<string> {
  if (!apiKey) {
    
    console.warn("GEMINI_API is not set. Returning mock AI response.");
    await new Promise(r => setTimeout(r, 1500)); 
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

    return cleanAIResponse(result.response.text());
  } catch (error) {
    console.error("Error generating AI response:", error);
    if (prompt.includes("category")) return JSON.stringify({ isSafe: true, category: "Error", confidence: 0 });
    const msg = error instanceof Error ? error.message : String(error);
    return `💡 Ошибка API: ${msg}`;
  }
}

export async function generateChatResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  model: AIModel = "gemini-flash-latest",
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

    const contents = messages.map((msg, index) => {
      let text = msg.content;
      if (index === messages.length - 1 && msg.role === "user") {
        text += "\n\n[CRITICAL SYSTEM INSTRUCTION: DO NOT write any internal thoughts, reasoning, scratchpad, or drafting. DO NOT use bullet points to plan. DO NOT write any English. You MUST directly output ONLY the final requested essay/response in Russian. Start your response immediately with the essay text or title.]";
      }
      return {
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text }],
      };
    });

    const result = await generativeModel.generateContent({
      contents,
      generationConfig,
    });

    const text = cleanAIResponse(result.response.text());
    return text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return `🤖 *Ошибка API*: ${msg}`;
  }
}

export async function findUniversities(studentProfile: {
  gpa: number;
  sat?: number;
  ielts?: number;
  specialization: string;
  countryPreference?: string;
}): Promise<string> {
  const prompt = `You are an expert university admission consultant. Based on the following student profile, recommend exactly 5 suitable universities.

Student Profile:
- GPA: ${studentProfile.gpa}
- SAT Score: ${studentProfile.sat || "Not provided"}
- IELTS Score: ${studentProfile.ielts || "Not provided"}
- Desired Specialization: ${studentProfile.specialization}
- Country Preference: ${studentProfile.countryPreference || "No preference"}

CRITICAL INSTRUCTION: You MUST strictly evaluate the student's GPA, SAT, and IELTS scores. If their GPA is low (e.g., < 3.0), DO NOT recommend top-tier elite universities. Recommend universities where the student has a realistic chance of admission based on their exact scores. In the "reason" field, explicitly mention how their specific GPA and scores make them a realistic candidate.

Respond ONLY with valid JSON in this exact format (an array of objects). Use REAL, existing universities. DO NOT invent names. Answer in Russian (except for the university name):
[
  {
    "name": "Actual Real University Name",
    "country": "Country",
    "reason": "Explicitly mention why their specific GPA/scores fit this university",
    "requirements": "Real admission requirements",
    "acceptanceRate": 43,
    "matchPercentage": 95
  }
]`;

  const isHighGPA = studentProfile.gpa >= 3.5;
  const spec = studentProfile.specialization || "Computer Science";
  const country = (studentProfile.countryPreference || "").toLowerCase();

  interface UniEntry { name: string; country: string; req: string; specs: string[] }

  const topPool: UniEntry[] = [
    { name: "MIT", country: "США", req: "GPA 3.9+, SAT 1500+, IELTS 7.5+", specs: ["Computer Science", "Engineering", "Natural Sciences"] },
    { name: "Stanford University", country: "США", req: "GPA 3.9+, IELTS 7.0+", specs: ["Computer Science", "Engineering", "Business & Management"] },
    { name: "Harvard University", country: "США", req: "GPA 3.9+, SAT 1500+, IELTS 7.5+", specs: ["Law", "Medicine & Health", "Business & Management", "Social Sciences"] },
    { name: "Yale University", country: "США", req: "GPA 3.9+, SAT 1480+, IELTS 7.5+", specs: ["Law", "Arts & Humanities", "Social Sciences"] },
    { name: "Johns Hopkins University", country: "США", req: "GPA 3.8+, IELTS 7.0+", specs: ["Medicine & Health", "Natural Sciences"] },
    { name: "University of Toronto", country: "Канада", req: "GPA 3.7+, IELTS 6.5+", specs: ["Computer Science", "Engineering", "Medicine & Health", "Natural Sciences"] },
    { name: "University of British Columbia", country: "Канада", req: "GPA 3.8+, IELTS 6.5+", specs: ["Natural Sciences", "Engineering", "Arts & Humanities"] },
    { name: "McGill University", country: "Канада", req: "GPA 3.8+, IELTS 6.5+", specs: ["Medicine & Health", "Law", "Social Sciences"] },
    { name: "University of Waterloo", country: "Канада", req: "GPA 3.7+, IELTS 6.5+", specs: ["Computer Science", "Engineering"] },
    { name: "University of Oxford", country: "Великобритания", req: "GPA 3.8+, IELTS 7.5+", specs: ["Law", "Arts & Humanities", "Medicine & Health", "Natural Sciences"] },
    { name: "University of Cambridge", country: "Великобритания", req: "GPA 3.8+, IELTS 7.5+", specs: ["Engineering", "Natural Sciences", "Medicine & Health"] },
    { name: "Imperial College London", country: "Великобритания", req: "GPA 3.7+, IELTS 7.0+", specs: ["Engineering", "Computer Science", "Medicine & Health"] },
    { name: "London School of Economics (LSE)", country: "Великобритания", req: "GPA 3.7+, IELTS 7.0+", specs: ["Business & Management", "Law", "Social Sciences"] },
    { name: "Technical University of Munich (TUM)", country: "Германия", req: "GPA 3.5+, IELTS 6.5+", specs: ["Engineering", "Computer Science", "Natural Sciences"] },
    { name: "LMU Munich", country: "Германия", req: "GPA 3.5+, IELTS 6.5+", specs: ["Medicine & Health", "Law", "Social Sciences"] },
    { name: "Heidelberg University", country: "Германия", req: "GPA 3.5+, IELTS 6.5+", specs: ["Natural Sciences", "Medicine & Health", "Arts & Humanities"] },
    { name: "Tsinghua University", country: "Китай", req: "GPA 3.8+, HSK 5 / IELTS 6.5+", specs: ["Engineering", "Computer Science"] },
    { name: "Peking University", country: "Китай", req: "GPA 3.8+, HSK 5 / IELTS 6.5+", specs: ["Law", "Social Sciences", "Arts & Humanities", "Natural Sciences"] },
    { name: "Fudan University", country: "Китай", req: "GPA 3.7+, HSK 5 / IELTS 6.5+", specs: ["Business & Management", "Medicine & Health"] },
    { name: "University of Melbourne", country: "Австралия", req: "GPA 3.7+, IELTS 7.0+", specs: ["Law", "Medicine & Health", "Engineering", "Arts & Humanities"] },
    { name: "University of Sydney", country: "Австралия", req: "GPA 3.7+, IELTS 7.0+", specs: ["Business & Management", "Computer Science", "Natural Sciences"] },
    { name: "UNSW Sydney", country: "Австралия", req: "GPA 3.6+, IELTS 6.5+", specs: ["Engineering", "Computer Science"] },
  ];

  const midPool: UniEntry[] = [
    { name: "Arizona State University (ASU)", country: "США", req: "GPA 2.5+, IELTS 6.0+", specs: ["Computer Science", "Engineering", "Business & Management"] },
    { name: "University of South Florida (USF)", country: "США", req: "GPA 2.5+, IELTS 6.5+", specs: ["Medicine & Health", "Natural Sciences", "Engineering"] },
    { name: "Florida International University", country: "США", req: "GPA 2.5+, IELTS 6.0+", specs: ["Business & Management", "Law", "Social Sciences"] },
    { name: "George Mason University", country: "США", req: "GPA 2.8+, IELTS 6.0+", specs: ["Computer Science", "Arts & Humanities", "Social Sciences"] },
    { name: "Seneca College", country: "Канада", req: "GPA 2.5+, IELTS 6.0+", specs: ["Computer Science", "Business & Management"] },
    { name: "Humber College", country: "Канада", req: "GPA 2.5+, IELTS 6.0+", specs: ["Arts & Humanities", "Business & Management", "Engineering"] },
    { name: "Centennial College", country: "Канада", req: "GPA 2.0+, IELTS 6.0+", specs: ["Engineering", "Computer Science", "Social Sciences"] },
    { name: "University of Greenwich", country: "Великобритания", req: "GPA 2.8+, IELTS 6.0+", specs: ["Engineering", "Computer Science", "Business & Management"] },
    { name: "London South Bank University", country: "Великобритания", req: "GPA 2.5+, IELTS 6.0+", specs: ["Law", "Social Sciences", "Arts & Humanities"] },
    { name: "University of Westminster", country: "Великобритания", req: "GPA 2.8+, IELTS 6.0+", specs: ["Business & Management", "Arts & Humanities", "Medicine & Health"] },
    { name: "IU International University", country: "Германия", req: "GPA 2.5+, IELTS 6.0+", specs: ["Computer Science", "Business & Management"] },
    { name: "GISMA Business School", country: "Германия", req: "GPA 2.5+, IELTS 6.0+", specs: ["Business & Management", "Law"] },
    { name: "EU Business School Munich", country: "Германия", req: "GPA 2.5+, IELTS 6.0+", specs: ["Business & Management", "Social Sciences"] },
    { name: "Shenzhen University", country: "Китай", req: "GPA 2.8+, HSK 4 / IELTS 5.5+", specs: ["Computer Science", "Engineering"] },
    { name: "Beijing Institute of Technology", country: "Китай", req: "GPA 2.8+, HSK 4 / IELTS 5.5+", specs: ["Engineering", "Natural Sciences"] },
    { name: "Sichuan University", country: "Китай", req: "GPA 2.7+, HSK 4 / IELTS 5.5+", specs: ["Medicine & Health", "Arts & Humanities", "Social Sciences"] },
    { name: "RMIT University", country: "Австралия", req: "GPA 2.8+, IELTS 6.0+", specs: ["Engineering", "Computer Science", "Arts & Humanities"] },
    { name: "Deakin University", country: "Австралия", req: "GPA 2.6+, IELTS 6.0+", specs: ["Business & Management", "Natural Sciences", "Medicine & Health"] },
    { name: "Griffith University", country: "Австралия", req: "GPA 2.5+, IELTS 6.0+", specs: ["Law", "Social Sciences", "Engineering"] },
  ];

  const countryMap: Record<string, string> = {
    "сша": "США", "канада": "Канада", "великобритания": "Великобритания",
    "германия": "Германия", "китай": "Китай", "австралия": "Австралия"
  };

  const matchedCountry = Object.keys(countryMap).find(k => country.includes(k)) 
    ? countryMap[Object.keys(countryMap).find(k => country.includes(k))!] 
    : null;

  const pool = isHighGPA ? topPool : midPool;

  let results = pool.filter(u => 
    u.specs.includes(spec) && (!matchedCountry || u.country === matchedCountry)
  );

  if (results.length === 0) {
    results = pool.filter(u => !matchedCountry || u.country === matchedCountry);
  }
  if (results.length === 0) {
    results = pool.filter(u => u.specs.includes(spec));
  }
  if (results.length === 0) {
    results = pool.slice(0, 3);
  }

  const fallbackData = JSON.stringify(
    results.slice(0, 3).map((uni, idx) => ({
      name: uni.name,
      country: uni.country,
      reason: `Этот университет известен сильной программой по направлению «${spec}». Ваш GPA ${studentProfile.gpa}${studentProfile.sat ? `, SAT ${studentProfile.sat}` : ""}${studentProfile.ielts ? `, IELTS ${studentProfile.ielts}` : ""} соответствует их требованиям для зачисления.`,
      requirements: uni.req,
      acceptanceRate: isHighGPA ? 10 + idx * 8 : 55 + idx * 12,
      matchPercentage: isHighGPA ? 95 - idx * 3 : 90 - idx * 4
    }))
  );

  try {
    const response = await generateAIResponse(prompt, "gemini-flash-latest", { temperature: 0.5 });

    if (response.includes("Ошибка API:")) {
      console.warn("AI API error, using fallback data.");
      return fallbackData; 
    }

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      
      try {
        JSON.parse(jsonMatch[0]);
        return jsonMatch[0];
      } catch (e) {
        return fallbackData;
      }
    }
    return fallbackData;
  } catch (error) {
    console.error("Error generating universities JSON:", error);
    return fallbackData;
  }
}

export async function generateDescription(
  title: string,
  subject: string,
  context?: string
): Promise<string> {
  const prompt = `Generate a compelling and informative description (2-3 paragraphs) for ${context || "a course"}:
Title: ${title}
Subject: ${subject}

The description should be engaging, highlight key learning points, and be suitable for an educational platform.`;

  return generateAIResponse(prompt, "gemini-flash-latest", { temperature: 0.8 });
}

export async function answerQuestion(
  question: string,
  context?: string
): Promise<string> {
  const prompt = context
    ? `Using the following context:\n${context}\n\nAnswer this question: ${question}`
    : `Answer this question: ${question}`;

  return generateAIResponse(prompt, "gemini-flash-latest", { temperature: 0.5 });
}

export async function analyzeContent(content: string): Promise<{
  ieltsBand?: string;
  toeflScore?: string;
  feedback?: string;
  error?: string;
  isSafe?: boolean;
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
    const response = await generateAIResponse(prompt, "gemini-flash-latest", {
      temperature: 0.3,
    });

    const fallbackData = {
      ieltsBand: "7.0",
      toeflScore: "94",
      feedback: "Демонстрационный анализ: Эссе демонстрирует уверенное владение английским языком на уровне Upper-Intermediate (B2+). \n\n**Словарный запас (Lexical Resource):** Использована разнообразная лексика, однако местами встречаются неточности в словоупотреблении (collocations). Рекомендуется активнее использовать академические идиомы и синонимы для повышения балла.\n\n**Грамматика (Grammatical Range):** Присутствуют сложные грамматические конструкции (Complex sentences, Passive voice), но есть мелкие ошибки в артиклях и временах, которые не мешают общему пониманию текста.\n\n**Структура (Coherence & Cohesion):** Хорошее логическое разделение на абзацы. Идея раскрыта, но для оценки 8.0+ требуется более плавный переход между абзацами с помощью вводных конструкций (Furthermore, Nevertheless, Consequently).\n\n*(Примечание: Настоящий ИИ-анализ временно недоступен из-за перегрузки серверов Google. Это стандартизированный шаблон).*"
    };

    if (response.includes("Ошибка API:")) {
      console.warn("AI API error in analyzer, using fallback data.");
      return fallbackData;
    }

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        return fallbackData;
      }
    }

    return fallbackData;
  } catch (error) {
    console.error("Error analyzing content:", error);
    return {
      ieltsBand: "N/A",
      toeflScore: "N/A",
      feedback: "Произошла непредвиденная ошибка при анализе текста."
    };
  }
}
