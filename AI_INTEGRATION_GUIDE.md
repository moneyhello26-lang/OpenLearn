# 🤖 AI Integration Guide для Next.js проекта

## Обзор

Проект использует **Google Gemini API** для интеграции нейросети. Есть 3 основных способа взаимодействия с AI:

1. **Серверные функции** - прямой вызов в Server Components или API routes
2. **API маршруты** - через Next.js API endpoints
3. **React Hooks** - через клиентские компоненты

---

## 📝 Способ 1: Серверные функции

### Простой запрос к AI

```typescript
// app/page.tsx (Server Component по умолчанию)
import { generateAIResponse } from "@/lib/ai";

export default async function Home() {
  const answer = await generateAIResponse("Какие самые популярные языки программирования?");
  
  return <div>{answer}</div>;
}
```

### С настройками

```typescript
import { generateAIResponse } from "@/lib/ai";

const answer = await generateAIResponse(
  "Придумай креативное название",
  "gemini-1.5-pro", // модель
  {
    temperature: 0.9, // 0.1-1.0, выше = более креативно
    maxTokens: 1000,  // максимум символов
  }
);
```

### Типы моделей

- `gemini-1.5-flash` - быстрая, экономная (по умолчанию)
- `gemini-1.5-pro` - более мощная, точная
- `gemini-pro` - старая версия

---

## 🎣 Способ 2: React Hooks (Client Components)

### useAskAI - задать вопрос

```typescript
"use client";

import { useAskAI } from "@/lib/useAI";

export function QuestionComponent() {
  const { execute, loading, error, data } = useAskAI();
  const [question, setQuestion] = useState("");

  const handleAsk = async () => {
    await execute({
      question,
      context: "Дополнительный контекст (опционально)"
    });
  };

  return (
    <div>
      <input 
        value={question} 
        onChange={(e) => setQuestion(e.target.value)} 
        placeholder="Введи вопрос"
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Загрузка..." : "Спросить"}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {data && <p>{data}</p>}
    </div>
  );
}
```

### useUniversityFinder - поиск университетов

```typescript
"use client";

import { useUniversityFinder } from "@/lib/useAI";

export function UniversitySearch() {
  const { execute, loading, data } = useUniversityFinder();

  const handleSearch = async () => {
    await execute({
      gpa: 3.8,
      sat: 1480,
      ielts: 7.5,
      specialization: "Computer Science",
      countryPreference: "Canada"
    });
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Поиск..." : "Найти университеты"}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### useGenerateDescription - генерирование описаний

```typescript
"use client";

import { useGenerateDescription } from "@/lib/useAI";

export function DescriptionGenerator() {
  const { execute, loading, data } = useGenerateDescription();

  const handleGenerate = async () => {
    await execute({
      title: "Python для начинающих",
      subject: "Программирование",
      context: "course" // или "book", "article"
    });
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Генерация..." : "Создать описание"}
      </button>
      {data && <p>{data}</p>}
    </div>
  );
}
```

---

## 🔌 Способ 3: API Routes

### Прямой вызов API

```typescript
// app/api/custom-ai/route.ts
import { generateAIResponse } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "gemini-1.5-flash", options = {} } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await generateAIResponse(prompt, model, options);

    return NextResponse.json({
      success: true,
      response
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
```

### Использование из клиента

```typescript
const response = await fetch("/api/custom-ai", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Расскажи о истории IT",
    model: "gemini-1.5-pro",
    options: { temperature: 0.5, maxTokens: 2000 }
  })
});

const data = await response.json();
console.log(data.response);
```

---

## 🎯 Продвинутые примеры

### Диалог с историей (Multi-turn)

```typescript
import { generateChatResponse } from "@/lib/ai";

const messages = [
  { role: "user" as const, content: "Привет! Кто ты?" },
  { role: "assistant" as const, content: "Привет! Я ИИ помощник от Google Gemini." },
  { role: "user" as const, content: "Помоги мне с Python" }
];

const answer = await generateChatResponse(messages, "gemini-1.5-pro");
console.log(answer);
```

### Анализ контента

```typescript
import { analyzeContent } from "@/lib/ai";

const analysis = await analyzeContent("Какой-то пользовательский контент");

console.log({
  isSafe: analysis.isSafe,
  category: analysis.category,
  confidence: analysis.confidence,
  suggestions: analysis.suggestions
});
```

### Генерирование описаний

```typescript
import { generateDescription } from "@/lib/ai";

const description = await generateDescription(
  "Introduction to Machine Learning",
  "Artificial Intelligence",
  "course"
);
```

---

## 🔑 Параметры температуры

| Значение | Использование | Пример |
|----------|---------------|--------|
| 0.1 | Консервативно, факты | Ответ на вопрос, анализ |
| 0.3-0.5 | Сбалансировано | Перевод, резюме |
| 0.7 | Default, хороший баланс | Общие ответы |
| 0.8-0.9 | Креативно | Генерирование названий, идей |
| 1.0+ | Максимально креативно | Рассказы, творчество |

---

## 📊 Ограничения и квоты

- **Модель**: gemini-1.5-flash рекомендуется для быстрых ответов
- **Токены**: По умолчанию 2048, можно увеличить до 8192
- **Запросы**: Check Google Cloud Console для лимитов

---

## ⚙️ Переменные окружения

Добавить в `.env.local`:

```env
GEMINI_API=your_api_key_here
```

Ключ находится в: `process.env.GEMINI_API`

---

## 🚨 Обработка ошибок

```typescript
import { generateAIResponse } from "@/lib/ai";

try {
  const response = await generateAIResponse("Вопрос");
  console.log(response);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
  }
}
```

---

## 📚 Полный пример: книга с AI описанием

```typescript
// app/books/new/page.tsx
"use client";

import { useState } from "react";
import { useGenerateDescription } from "@/lib/useAI";

export default function NewBook() {
  const { execute: generateDesc, loading: generating, data: description } = useGenerateDescription();
  const [formData, setFormData] = useState({
    title: "",
    subject: ""
  });

  const handleGenerate = async () => {
    await generateDesc({
      title: formData.title,
      subject: formData.subject,
      context: "book"
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Новая книга</h1>
      
      <input
        type="text"
        placeholder="Название книги"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        className="w-full p-2 border rounded mb-4"
      />
      
      <input
        type="text"
        placeholder="Предмет"
        value={formData.subject}
        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
        className="w-full p-2 border rounded mb-4"
      />
      
      <button
        onClick={handleGenerate}
        disabled={generating || !formData.title || !formData.subject}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {generating ? "Генерирую..." : "Создать описание"}
      </button>
      
      {description && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-bold mb-2">Сгенерированное описание:</h3>
          <p>{description}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔗 Полезные ссылки

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React Hooks](https://react.dev/reference/react/hooks)
