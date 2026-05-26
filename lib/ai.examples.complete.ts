// lib/ai.examples.complete.ts
/**
 * ПОЛНЫЕ ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ AI ИНТЕГРАЦИИ В NEXT.JS
 * 
 * Этот файл содержит практические примеры всех способов использования AI
 * Копируй нужные примеры в свой код!
 */

import {
  generateAIResponse,
  generateChatResponse,
  findUniversities,
  generateDescription,
  answerQuestion,
  analyzeContent,
} from "@/lib/ai";

import {
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

// ========================================
// 1️⃣ БАЗОВЫЕ ПРИМЕРЫ
// ========================================

/**
 * Простой текстовый запрос
 */
export async function exampleSimplePrompt() {
  const response = await generateAIResponse(
    "Расскажи в 3 предложениях о том, как учиться более эффективно"
  );
  console.log("Simple prompt:", response);
  return response;
}

/**
 * С контролем параметров
 */
export async function exampleWithParameters() {
  const response = await generateAIResponse(
    "Придумай 5 креативных названий для образовательной платформы",
    "gemini-1.5-pro", // модель
    {
      temperature: 0.9, // креативнее
      maxTokens: 1000,
    }
  );
  console.log("With parameters:", response);
  return response;
}

/**
 * Выбор модели в зависимости от задачи
 */
export async function exampleModelSelection(task: "fast" | "accurate") {
  const model = task === "fast" ? "gemini-1.5-flash" : "gemini-1.5-pro";
  const response = await generateAIResponse("Твой вопрос", model);
  return response;
}

// ========================================
// 2️⃣ ЧАТЫ И ДИАЛОГИ
// ========================================

/**
 * Многотуровый диалог (chat с историей)
 */
export async function exampleMultiTurnChat() {
  const messages = [
    { role: "user" as const, content: "Привет! Помоги мне с Python" },
    {
      role: "assistant" as const,
      content:
        "Конечно! Я помогу с Python. Что именно тебя интересует? Основы синтаксиса, работа с данными, веб-фреймворки?",
    },
    {
      role: "user" as const,
      content:
        "Как создать простой веб-скрипт который парсит данные с сайта?",
    },
  ];

  const response = await generateChatResponse(messages, "gemini-1.5-pro");
  console.log("Multi-turn chat response:", response);
  return response;
}

/**
 * Система со статусом (помощник с характером)
 */
export async function exampleSystemPrompt(userMessage: string) {
  const systemContext = `Ты опытный учитель Python с 10-летним опытом. 
Объясняй сложные концепции простым языком. 
Используй аналогии и примеры из реальной жизни.
Будь дружелюбен и поддерживай ученика.`;

  const messages = [
    { role: "user" as const, content: systemContext + "\n" + userMessage },
  ];

  return generateChatResponse(messages);
}

// ========================================
// 3️⃣ СПЕЦИАЛИЗИРОВАННЫЕ ЗАПРОСЫ
// ========================================

/**
 * Генерирование JSON ответов
 */
export async function exampleGenerateJSON() {
  const result = await generateJSON<{
    title: string;
    description: string;
    topics: string[];
  }>(
    `Создай данные для онлайн курса по Python с полями: title, description, topics`,
    {
      title: "Python для начинающих",
      description: "",
      topics: [],
    }
  );

  console.log("Generated JSON:", result);
  return result;
}

/**
 * Классификация текста
 */
export async function exampleClassifyText() {
  const text =
    "Этот курс помог мне освоить Web Development за месяц! Очень рекомендую!";
  const categories = ["положительный", "отрицательный", "нейтральный"];

  const classification = await classifyText(text, categories);
  console.log("Classification:", classification);
  return classification;
}

/**
 * Суммаризация текста
 */
export async function exampleSummarize() {
  const longText = `Python - это высокоуровневый язык программирования, известный своей простотой и читаемостью кода. 
Он используется в различных областях: веб-разработка, анализ данных, машинное обучение, автоматизация и многое другое. 
Python имеет большую экосистему библиотек и фреймворков, которые ускоряют разработку. 
Язык поддерживает объектно-ориентированное программирование и функциональное программирование.`;

  const summary = await summarizeText(longText, 150);
  console.log("Summary:", summary);
  return summary;
}

/**
 * Перевод текста
 */
export async function exampleTranslate() {
  const text = "Hello, this is an educational platform";
  const translated = await translateText(text, "русский");
  console.log("Translated:", translated);
  return translated;
}

/**
 * Генерирование идей
 */
export async function exampleGenerateIdeas() {
  const ideas = await generateIdeas(
    "Создать платформу для онлайн обучения",
    5
  );
  console.log("Generated ideas:", ideas);
  return ideas;
}

/**
 * Проверка грамматики
 */
export async function exampleCheckGrammar() {
  const text = "Я хочу учиться програмирование";
  const checked = await checkGrammar(text);
  console.log("Grammar check:", checked);
  return checked;
}

/**
 * Генерирование вопросов по тексту
 */
export async function exampleGenerateQuestions() {
  const text =
    "Python - это интерпретируемый язык программирования высокого уровня";
  const questions = await generateQuestions(text, 3);
  console.log("Generated questions:", questions);
  return questions;
}

/**
 * Сравнение текстов
 */
export async function exampleCompareTexts() {
  const text1 = "Python - это язык программирования";
  const text2 = "JavaScript - это язык программирования";

  const comparison = await compareTexts(text1, text2);
  console.log("Comparison:", comparison);
  return comparison;
}

/**
 * Структурирование неструктурированных данных
 */
export async function exampleStructureData() {
  const unstructured =
    "Иван Сидоров, возраст 25, учит Python и Web Development, живет в Москве";

  const result = await structureData(unstructured, {
    name: "",
    age: 0,
    skills: [],
    location: "",
  });

  console.log("Structured data:", result);
  return result;
}

/**
 * SEO оптимизация
 */
export async function exampleSEO() {
  const seo = await generateSEODescription("Курсы Python онлайн", [
    "python",
    "программирование",
    "онлайн курсы",
  ]);

  console.log("SEO:", seo);
  return seo;
}

/**
 * Генерирование контента по шаблону
 */
export async function exampleGenerateContent() {
  const template = "Курс по {language} для {level}";
  const variables = {
    language: "Python",
    level: "начинающих",
  };

  const content = await generateContent(template, variables);
  console.log("Generated content:", content);
  return content;
}

/**
 * Множественные вопросы
 */
export async function exampleAskMultiple() {
  const answers = await askMultiple([
    "Что такое Python?",
    "Какие основные типы данных в Python?",
    "Как написать функцию в Python?",
  ]);

  console.log("Multiple questions:", answers);
  return answers;
}

/**
 * Генерирование разных точек зрения
 */
export async function exampleGeneratePerspectives() {
  const perspectives = await generatePerspectives(
    "Нужно ли учить Python новичкам?"
  );

  console.log("Perspectives:", perspectives);
  return perspectives;
}

// ========================================
// 4️⃣ ИНТЕГРАЦИЯ С БАЗОЙ ДАННЫХ
// ========================================

/**
 * Модерация контента перед сохранением в БД
 */
export async function exampleModerateAndSave(
  comment: string
): Promise<boolean> {
  const analysis = await analyzeContent(comment);

  if (!analysis.isSafe) {
    console.log("Comment rejected:", analysis);
    return false;
  }

  // Сохраняем в БД
  console.log("Comment approved, saving to DB...");
  return true;
}

/**
 * Автоматическое генерирование описания при создании курса
 */
export async function exampleAutoGenerateDescription(
  courseTitle: string,
  courseSubject: string
) {
  const description = await generateDescription(courseTitle, courseSubject);
  console.log("Auto-generated description:", description);
  // Сохраняем в БД вместе с курсом
  return description;
}

/**
 * Поиск университетов по профилю студента
 */
export async function exampleFindUniversities() {
  const universities = await findUniversities({
    gpa: 3.8,
    sat: 1480,
    ielts: 7.5,
    specialization: "Computer Science",
    countryPreference: "USA",
  });

  console.log("Universities recommendations:", universities);
  return universities;
}

/**
 * Ответ на вопрос пользователя с контекстом из БД
 */
export async function exampleAnswerWithContext(
  question: string,
  courseContext: string
) {
  const answer = await answerQuestion(question, courseContext);
  console.log("Answer:", answer);
  return answer;
}

// ========================================
// 5️⃣ СЛОЖНЫЕ ПРИМЕРЫ
// ========================================

/**
 * Обработка пользовательского контента через несколько AI операций
 */
export async function examplePipelineProcessing(userText: string) {
  console.log("1. Checking grammar...");
  const grammar = await checkGrammar(userText);

  console.log("2. Generating questions...");
  const questions = await generateQuestions(userText, 3);

  console.log("3. Summarizing...");
  const summary = await summarizeText(userText);

  console.log("4. Classifying...");
  const classification = await classifyText(userText, [
    "educational",
    "entertainment",
    "technical",
  ]);

  return {
    grammar,
    questions,
    summary,
    classification,
  };
}

/**
 * Умная рекомендация курсов
 */
export async function exampleSmartCourseRecommendation(
  userInterests: string[],
  userLevel: string
) {
  const ideas = await generateIdeas(
    `Рекомендуй курсы для человека который интересуется: ${userInterests.join(", ")} и имеет уровень: ${userLevel}`,
    5
  );

  return ideas;
}

/**
 * Автоматическая подготовка FAQ из документации
 */
export async function exampleGenerateFAQ(documentation: string) {
  const questions = await generateQuestions(documentation, 10);

  const faqPrompt = `На основе документации создай FAQ с вопросами и ответами:
Документация: ${documentation}
Вопросы: ${questions.join("\n")}`;

  const faq = await generateJSON<
    Array<{ question: string; answer: string }>
  >(faqPrompt);

  return faq;
}

/**
 * A/B тестирование текстов
 */
export async function exampleABTestContent() {
  const variantA = "Нажми кнопку для регистрации";
  const variantB = "Присоединись к тысячам студентов бесплатно";

  const analysis = await compareTexts(variantA, variantB);

  // Оцениваем какой лучше
  const evaluation = await generateJSON(
    `Какой текст будет более эффективен для CTA кнопки: "${variantA}" или "${variantB}"? 
Дай оценку по критериям: привлекательность, ясность, конверсионность.`
  );

  return evaluation;
}

// ========================================
// 6️⃣ ОБРАБОТКА ОШИБОК И RETRY ЛОГИКА
// ========================================

/**
 * Запрос с автоматическим повтором при ошибке
 */
export async function exampleWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      console.log(`Failed, waiting ${delay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // exponential backoff
    }
  }

  throw new Error("Max retries exceeded");
}

/**
 * Использование retry
 */
export async function exampleUsingRetry() {
  const result = await exampleWithRetry(
    () => generateAIResponse("Твой вопрос"),
    3,
    1000
  );
  return result;
}

// ========================================
// ЗАПУСК ПРИМЕРОВ
// ========================================

/**
 * Главная функция для запуска примеров
 * Раскомментируй нужные примеры для тестирования
 */
export async function runAllExamples() {
  try {
    // Базовые примеры
    // await exampleSimplePrompt();
    // await exampleWithParameters();

    // Чаты
    // await exampleMultiTurnChat();

    // JSON
    // await exampleGenerateJSON();

    // Классификация
    // await exampleClassifyText();

    // Суммаризация
    // await exampleSummarize();

    // Перевод
    // await exampleTranslate();

    // И так далее...

    console.log("Examples completed!");
  } catch (error) {
    console.error("Error running examples:", error);
  }
}
