# 🤖 AI Integration для Next.js - Полная Документация

> **Google Gemini API полностью интегрирован в ваш Next.js проект!**

## 🎯 Что это дает?

Теперь вы можете:
- ✅ Генерировать текст в любом месте приложения
- ✅ Отвечать на вопросы пользователей
- ✅ Анализировать и модерировать контент
- ✅ Переводить и суммаризировать тексты
- ✅ Создавать диалоги и чаты
- ✅ Структурировать данные
- ✅ Генерировать JSON ответы
- ✅ И многое другое...

---

## 🚀 БЫСТРЫЙ СТАРТ (5 минут)

### Вариант 1: Server Component (без взаимодействия)
```typescript
// app/page.tsx
import { generateAIResponse } from "@/lib/ai";

export default async function Home() {
  const answer = await generateAIResponse("Что такое Python?");
  return <div>{answer}</div>;
}
```

### Вариант 2: Client Component (с кнопкой)
```typescript
"use client";
import { useState } from "react";
import { useAIRequest } from "@/lib/useAI";

export function MyComponent() {
  const { execute, loading, data } = useAIRequest("/api/ai/simple");

  return (
    <>
      <button onClick={() => execute({ prompt: "Привет!" })}>
        {loading ? "Думаю..." : "Спросить"}
      </button>
      {data && <p>{data}</p>}
    </>
  );
}
```

### Вариант 3: Встроенный Hook
```typescript
"use client";
import { useAskAI } from "@/lib/useAI";

export function Question() {
  const { execute, loading, data } = useAskAI();

  return (
    <>
      <button onClick={() => execute({ question: "Как учиться лучше?" })}>
        {loading ? "..." : "Спросить"}
      </button>
      {data && <p>{data.answer}</p>}
    </>
  );
}
```

---

## 📚 Полная Структура

### Основные файлы
```
lib/
├── ai.ts                    # Основные функции AI
├── ai-utils.ts              # Утилиты и вспомогательные функции
├── ai.examples.ts           # Примеры использования
├── ai.examples.complete.ts  # Полные примеры
└── useAI.ts                 # React Hooks

app/api/ai/
├── simple/route.ts          # Простой запрос
├── chat/route.ts            # Чат с историей
├── ask/route.ts             # Вопрос-ответ
├── analyze/route.ts         # Анализ контента
├── universities/route.ts    # Поиск вузов
└── generate-description/route.ts  # Генерирование описаний

components/
├── AIComponents.tsx         # Готовые компоненты

app/components/AIExamples/
├── SimplePromptComponent.tsx
├── ChatComponent.tsx
└── ContentAnalyzerComponent.tsx

app/ai-demo/page.tsx        # Demo страница со всеми примерами
```

### Документация
```
QUICKSTART_AI.md             # Первоначальный гайд
QUICKSTART_NEXTJS_AI.md      # Next.js специфичный гайд
AI_INTEGRATION_GUIDE.md      # Полное руководство
```

---

## 🔧 Основные Функции

### 1. Генерирование текста
```typescript
import { generateAIResponse } from "@/lib/ai";

const answer = await generateAIResponse(
  "Твой промпт",
  "gemini-1.5-flash", // модель
  { temperature: 0.7 }  // параметры
);
```

### 2. Чат с историей
```typescript
import { generateChatResponse } from "@/lib/ai";

const messages = [
  { role: "user", content: "Привет!" },
  { role: "assistant", content: "Привет!" },
  { role: "user", content: "Как дела?" }
];

const response = await generateChatResponse(messages);
```

### 3. Поиск университетов
```typescript
import { findUniversities } from "@/lib/ai";

const recommendations = await findUniversities({
  gpa: 3.8,
  sat: 1480,
  ielts: 7.5,
  specialization: "Computer Science"
});
```

### 4. Генерирование описаний
```typescript
import { generateDescription } from "@/lib/ai";

const desc = await generateDescription(
  "Python для начинающих",
  "Программирование",
  "course"
);
```

### 5. Ответ на вопрос
```typescript
import { answerQuestion } from "@/lib/ai";

const answer = await answerQuestion(
  "Как начать учить Python?",
  "Optional context for better answer"
);
```

### 6. Анализ контента
```typescript
import { analyzeContent } from "@/lib/ai";

const analysis = await analyzeContent("User generated content");
// Возвращает: { isSafe, category, confidence, suggestions }
```

---

## 🎨 Утилиты (Advanced)

### Генерирование JSON
```typescript
import { generateJSON } from "@/lib/ai-utils";

const data = await generateJSON<{ name: string; age: number }>(
  "Создай данные пользователя",
  { name: "", age: 0 }
);
```

### Классификация
```typescript
import { classifyText } from "@/lib/ai-utils";

const result = await classifyText(
  "Текст для классификации",
  ["категория1", "категория2"]
);
// { category: "категория1", confidence: 0.95 }
```

### Суммаризация
```typescript
import { summarizeText } from "@/lib/ai-utils";

const summary = await summarizeText("Длинный текст", 200);
```

### Перевод
```typescript
import { translateText } from "@/lib/ai-utils";

const translated = await translateText("Hello", "русский");
```

### Генерирование идей
```typescript
import { generateIdeas } from "@/lib/ai-utils";

const ideas = await generateIdeas("Описание задачи", 5);
// ["идея 1", "идея 2", ...]
```

### Проверка грамматики
```typescript
import { checkGrammar } from "@/lib/ai-utils";

const result = await checkGrammar("Текст с ошибкой");
// { corrected, issues: [...] }
```

### Генерирование вопросов
```typescript
import { generateQuestions } from "@/lib/ai-utils";

const questions = await generateQuestions("Текст статьи", 5);
```

### Сравнение текстов
```typescript
import { compareTexts } from "@/lib/ai-utils";

const comparison = await compareTexts("Текст 1", "Текст 2");
// { similarities: [...], differences: [...] }
```

### Структурирование данных
```typescript
import { structureData } from "@/lib/ai-utils";

const data = await structureData(
  "Неструктурированный текст",
  { name: "", age: 0 }
);
```

### SEO Оптимизация
```typescript
import { generateSEODescription } from "@/lib/ai-utils";

const seo = await generateSEODescription(
  "Заголовок страницы",
  ["ключевое слово 1", "ключевое слово 2"]
);
```

### Генерирование контента по шаблону
```typescript
import { generateContent } from "@/lib/ai-utils";

const content = await generateContent(
  "Курс по {language} для {level}",
  { language: "Python", level: "начинающих" }
);
```

### Множественные вопросы
```typescript
import { askMultiple } from "@/lib/ai-utils";

const answers = await askMultiple([
  "Вопрос 1?",
  "Вопрос 2?",
  "Вопрос 3?"
]);
```

### Разные точки зрения
```typescript
import { generatePerspectives } from "@/lib/ai-utils";

const perspectives = await generatePerspectives("Тема", 3);
// [{ perspective, arguments: [...] }, ...]
```

---

## 🎣 React Hooks

### useAIRequest (универсальный)
```typescript
"use client";
import { useAIRequest } from "@/lib/useAI";

const { execute, loading, error, data } = useAIRequest("/api/ai/simple");
```

### useAskAI (специализированный)
```typescript
"use client";
import { useAskAI } from "@/lib/useAI";

const { execute, loading, error, data } = useAskAI();
await execute({ question: "Текст вопроса", context: "опционально" });
```

### useUniversityFinder
```typescript
"use client";
import { useUniversityFinder } from "@/lib/useAI";

const { execute, loading, data } = useUniversityFinder();
await execute({
  gpa: 3.8,
  sat: 1480,
  ielts: 7.5,
  specialization: "CS",
  countryPreference: "USA"
});
```

### useGenerateDescription
```typescript
"use client";
import { useGenerateDescription } from "@/lib/useAI";

const { execute, loading, data } = useGenerateDescription();
await execute({
  title: "Название",
  subject: "Предмет",
  context: "course" // или "book", "article"
});
```

---

## 🔌 API Routes

### POST /api/ai/simple
```typescript
{
  "prompt": "Твой вопрос",
  "model": "gemini-1.5-flash", // опционально
  "temperature": 0.7,           // опционально
  "maxTokens": 2048             // опционально
}
```

### POST /api/ai/chat
```typescript
{
  "messages": [
    { "role": "user", "content": "Привет" },
    { "role": "assistant", "content": "Привет!" }
  ],
  "model": "gemini-1.5-pro",      // опционально
  "temperature": 0.7              // опционально
}
```

### POST /api/ai/ask
```typescript
{
  "question": "Твой вопрос",
  "context": "Контекст"  // опционально
}
```

### POST /api/ai/analyze
```typescript
{
  "content": "Текст для анализа"
}
```

### POST /api/ai/universities
```typescript
{
  "gpa": 3.8,
  "sat": 1480,             // опционально
  "ielts": 7.5,            // опционально
  "specialization": "CS",
  "countryPreference": "USA" // опционально
}
```

### POST /api/ai/generate-description
```typescript
{
  "title": "Название",
  "subject": "Предмет",
  "context": "course"  // опционально: "course", "book", "article"
}
```

---

## ⚙️ Параметры

### Temperature (Креативность)
| Значение | Использование |
|----------|---------------|
| 0.1 | Консервативно, факты |
| 0.3-0.5 | Сбалансировано |
| 0.7 | По умолчанию |
| 0.8-0.9 | Креативно |
| 1.0+ | Максимально креативно |

### Max Tokens (Длина ответа)
| Значение | Длина |
|----------|-------|
| 256 | Короткий ответ |
| 512 | Средний ответ |
| 2048 | Длинный ответ (default) |
| 4096 | Очень длинный |
| 8192 | Максимальный |

### Модели
| Модель | Скорость | Качество | Использование |
|--------|----------|----------|----------------|
| gemini-1.5-flash | Быстро | Хорошее | Быстрые ответы |
| gemini-1.5-pro | Средне | Отличное | Сложные задачи |
| gemini-pro | Средне | Хорошее | Legacy |

---

## 📋 Примеры Реальных Сценариев

### 1. Автоматическая модерация комментариев
```typescript
// app/api/comments/route.ts
import { analyzeContent } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { comment } = await request.json();
  
  const analysis = await analyzeContent(comment);
  
  if (!analysis.isSafe) {
    return NextResponse.json(
      { error: "Comment doesn't meet our guidelines" },
      { status: 400 }
    );
  }
  
  // Сохраняем комментарий в БД
  await db.comment.create({ data: { content: comment } });
  return NextResponse.json({ success: true });
}
```

### 2. Автоматическое генерирование описания при создании курса
```typescript
// app/api/courses/route.ts
import { generateDescription } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const { title, subject } = await request.json();
  
  const description = await generateDescription(title, subject, "course");
  
  const course = await db.course.create({
    data: { title, subject, description }
  });
  
  return NextResponse.json(course);
}
```

### 3. Рекомендация курсов
```typescript
// app/api/recommendations/route.ts
import { generateIdeas } from "@/lib/ai-utils";

export async function POST(request: NextRequest) {
  const { interests, level } = await request.json();
  
  const recommendations = await generateIdeas(
    `Рекомендуй курсы для: ${interests.join(", ")} (уровень: ${level})`,
    5
  );
  
  return NextResponse.json({ recommendations });
}
```

### 4. Суммаризация лекции
```typescript
// app/lectures/[id]/page.tsx
import { summarizeText } from "@/lib/ai-utils";

export default async function LecturePage({ params }: Props) {
  const lecture = await db.lecture.findUnique({
    where: { id: params.id }
  });
  
  const summary = await summarizeText(lecture.content, 300);
  
  return (
    <div>
      <h1>{lecture.title}</h1>
      <div className="summary">{summary}</div>
      <div className="content">{lecture.content}</div>
    </div>
  );
}
```

### 5. Интерактивный чат поддержки
```typescript
// app/support/page.tsx
"use client";

import { useState } from "react";
import { useAIRequest } from "@/lib/useAI";

export function SupportChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const { execute, loading } = useAIRequest("/api/ai/chat");

  const handleSend = async (message: string) => {
    setMessages(prev => [...prev, { role: "user", content: message }]);
    
    const response = await execute({
      messages: [...messages, { role: "user", content: message }]
    });
    
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
  };

  return (
    <div>
      {messages.map((msg, idx) => (
        <p key={idx}>{msg.role}: {msg.content}</p>
      ))}
      <input onSubmit={(e) => handleSend(e.target.value)} />
    </div>
  );
}
```

---

## 🐛 Обработка Ошибок

```typescript
try {
  const result = await generateAIResponse("Вопрос");
  console.log(result);
} catch (error) {
  if (error instanceof Error) {
    console.error("AI Error:", error.message);
    
    if (error.message.includes("rate limit")) {
      // Обработка превышения лимита
    } else if (error.message.includes("API key")) {
      // Проблема с API ключом
    } else {
      // Другая ошибка
    }
  }
}
```

---

## 🔐 Безопасность

### API Key хранится в .env.local
```env
GEMINI_API=your_api_key_here
```

### Никогда не выставляй в публичный репозиторий
```bash
# .gitignore должен содержать:
.env.local
.env
```

---

## 📊 Мониторинг и Логирование

### Добавь логирование запросов
```typescript
// lib/ai-with-logging.ts
import { generateAIResponse as baseGenerateAIResponse } from "@/lib/ai";

export async function generateAIResponse(prompt: string, model?: string) {
  const startTime = Date.now();
  
  try {
    const result = await baseGenerateAIResponse(prompt, model);
    console.log(`✅ AI Request completed in ${Date.now() - startTime}ms`);
    return result;
  } catch (error) {
    console.error(`❌ AI Request failed:`, error);
    throw error;
  }
}
```

---

## 🚀 Развертывание

### Vercel / Next.js Hosting
1. Добавь `GEMINI_API` в Environment Variables
2. Deploy как обычно
3. API будет работать на production

### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV GEMINI_API=${GEMINI_API}
CMD npm run build && npm start
```

---

## 📞 Поддержка

- 📚 [Google Gemini Docs](https://ai.google.dev/)
- 💬 [Next.js Discord](https://discord.gg/nextjs)
- 🐛 [GitHub Issues](https://github.com/your-repo/issues)

---

## 📝 Чеклист для начала

- [ ] Прочитал этот файл
- [ ] Посетил `/ai-demo` страницу
- [ ] Скопировал нужный пример в свой код
- [ ] Протестировал локально
- [ ] Развернул на production
- [ ] Добавил обработку ошибок
- [ ] Добавил логирование

---

**Готово! Начни использовать AI в своем приложении!** 🎉
