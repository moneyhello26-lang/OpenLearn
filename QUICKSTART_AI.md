# 🚀 Быстрый старт - AI интеграция

## ⚡ За 5 минут до первого AI запроса

### 1. Установить зависимости
```bash
npm install
```

### 2. API ключ уже готов!
Ключ уже находится в `.env`:
```env
GEMINI_API=AIzaSyDdUs6gvLOThRnhXVEvKICQckkatYft5ts
```

### 3. Использовать в коде

#### Вариант A: Простая функция в любом месте
```typescript
import { generateAIResponse } from "@/lib/ai";

const answer = await generateAIResponse("Привет, ИИ!");
console.log(answer);
```

#### Вариант B: Через API маршрут
```typescript
const response = await fetch("/api/ai/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question: "Твой вопрос" })
});

const data = await response.json();
console.log(data.answer);
```

#### Вариант C: Через React Hook
```typescript
"use client";
import { useAskAI } from "@/lib/useAI";

export function MyComponent() {
  const { execute, loading, data } = useAskAI();

  return (
    <>
      <button onClick={() => execute({ question: "Привет!" })}>
        {loading ? "Загрузка..." : "Спросить"}
      </button>
      {data && <div>{data.answer}</div>}
    </>
  );
}
```

#### Вариант D: Использовать готовые компоненты
```typescript
import { UniversityFinderForm, AskAIComponent } from "@/components/AIComponents";

export default function Page() {
  return (
    <>
      <UniversityFinderForm />
      <AskAIComponent />
    </>
  );
}
```

## 📚 Доступные функции

| Функция | Что делает | Файл |
|---------|-----------|------|
| `generateAIResponse()` | Простой текстовый запрос | `lib/ai.ts` |
| `generateChatResponse()` | Диалог с историей | `lib/ai.ts` |
| `findUniversities()` | Подбор университетов | `lib/ai.ts` |
| `generateDescription()` | Описание книг/курсов | `lib/ai.ts` |
| `answerQuestion()` | Ответ на вопрос | `lib/ai.ts` |
| `useAskAI()` | Hook для вопросов | `lib/useAI.ts` |
| `useUniversityFinder()` | Hook для поиска университетов | `lib/useAI.ts` |

## 🔗 API маршруты

- `POST /api/ai/ask` - Ответить на вопрос
- `POST /api/ai/universities` - Найти университеты
- `POST /api/ai/generate-description` - Создать описание

## 🎯 Примеры использования

### Пример 1: Подбор университетов
```typescript
import { findUniversities } from "@/lib/ai";

const unis = await findUniversities({
  gpa: 3.9,
  sat: 1500,
  ielts: 8.0,
  specialization: "Data Science"
});

console.log(unis);
```

### Пример 2: Ответить на вопрос
```typescript
import { answerQuestion } from "@/lib/ai";

const answer = await answerQuestion(
  "Какие предметы нужны для ИТ?"
);

console.log(answer);
```

### Пример 3: В React форме
```typescript
"use client";
import { useState } from "react";

export function QuestionForm() {
  const [answer, setAnswer] = useState("");

  const handleAsk = async (question: string) => {
    const res = await fetch("/api/ai/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const { answer } = await res.json();
    setAnswer(answer);
  };

  return (
    <>
      <button onClick={() => handleAsk("Привет!")}>Спросить</button>
      {answer && <p>{answer}</p>}
    </>
  );
}
```

### Пример 4: Использовать готовый компонент
```typescript
import { AskAIComponent, UniversityFinderForm } from "@/components/AIComponents";

export default function Page() {
  return (
    <div className="space-y-8">
      <AskAIComponent />
      <UniversityFinderForm />
    </div>
  );
}
```

## ⚙️ Параметры

### Temperature (креативность)
```typescript
// Консервативно (для фактов)
await generateAIResponse(prompt, "gemini-1.5-flash", { temperature: 0.3 });

// Сбалансировано (по умолчанию)
await generateAIResponse(prompt, "gemini-1.5-flash", { temperature: 0.7 });

// Креативно (для идей)
await generateAIResponse(prompt, "gemini-1.5-flash", { temperature: 0.9 });
```

### Выбор модели
```typescript
// Быстро и дешево
generateAIResponse(prompt, "gemini-1.5-flash");

// Мощнее и точнее
generateAIResponse(prompt, "gemini-1.5-pro");
```

## 🐛 Решение проблем

| Проблема | Решение |
|----------|--------|
| Ошибка "GEMINI_API not set" | Проверьте `.env` файл и перезагрузите сервер |
| Медленные ответы | Используйте `gemini-1.5-flash` вместо `gemini-1.5-pro` |
| API недоступен | Проверьте интернет соединение и API ключ на ai.google.dev |

## 📖 Полная документация

Для полной документации смотрите: `AI_INTEGRATION.md`

Для примеров кода смотрите: `lib/ai.examples.ts`

---

**Теперь вы готовы использовать AI! 🎉**
