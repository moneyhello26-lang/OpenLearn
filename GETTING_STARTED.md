# 🚀 НАЧАЛО РАБОТЫ - Пошаговая инструкция

## ✅ Что уже готово

- ✓ Google Gemini API интегрирован
- ✓ Все API routes созданы
- ✓ React Hooks готовы
- ✓ Примеры и компоненты написаны
- ✓ Документация подготовлена

## 🎯 Твой первый AI запрос - 3 шага

### Шаг 1: Запусти приложение
```bash
npm install
npm run dev
```

Приложение запустится на `http://localhost:3000`

### Шаг 2: Открой Demo страницу
```
http://localhost:3000/ai-demo
```

Там ты увидишь все примеры в действии!

### Шаг 3: Выбери нужный пример и используй

---

## 📖 Документация - выбери свой уровень

### 🟢 Новичок
**Прочитай в этом порядке:**
1. `AI_SUMMARY.md` (этот файл) - обзор
2. `QUICKSTART_NEXTJS_AI.md` - практический старт
3. Открой `/ai-demo` - посмотри примеры

### 🟡 Опытный разработчик
**Тебе достаточно:**
1. `AI_INTEGRATION_GUIDE.md` - все возможности
2. `lib/ai.ts` - посмотри исходный код
3. `lib/ai-utils.ts` - специализированные функции

### 🔴 Профессиональный уровень
**Начни отсюда:**
1. `lib/ai.examples.complete.ts` - все примеры
2. Исходные файлы в `lib/`
3. API routes в `app/api/ai/`

---

## 💻 Быстрые примеры для копирования

### 1. Самый простой - в Server Component
```typescript
// app/page.tsx
import { generateAIResponse } from "@/lib";

export default async function Home() {
  const answer = await generateAIResponse("Привет, ИИ!");
  
  return <div className="p-8">{answer}</div>;
}
```

**Что делает:** Генерирует ответ при загрузке страницы

---

### 2. С кнопкой - в Client Component
```typescript
// app/my-ai-component.tsx
"use client";

import { useState } from "react";
import { useAIRequest } from "@/lib";

export function AskAI() {
  const [input, setInput] = useState("");
  const { execute, loading, data, error } = useAIRequest("/api/ai/simple");

  return (
    <div className="p-8">
      <input 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Спроси что-нибудь..."
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={() => execute({ prompt: input })}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Думаю..." : "Спросить"}
      </button>
      {data && <p className="mt-4">{data}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

**Что делает:** Позволяет пользователю вводить вопрос и получать ответ

---

### 3. Встроенный Hook - специализированный
```typescript
"use client";
import { useAskAI } from "@/lib";
import { useState } from "react";

export function QuestionForm() {
  const [question, setQuestion] = useState("");
  const { execute, loading, data, error } = useAskAI();

  return (
    <>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} />
      <button onClick={() => execute({ question })} disabled={loading}>
        {loading ? "..." : "Спросить"}
      </button>
      {data && <p>{data.answer || data}</p>}
    </>
  );
}
```

**Что делает:** Специализированный hook для вопросов

---

### 4. Утилиты - для специальных операций
```typescript
import { summarizeText, classifyText, generateIdeas } from "@/lib";

// Суммаризация
const summary = await summarizeText("Длинный текст", 200);

// Классификация
const sentiment = await classifyText(
  "Отличный курс!",
  ["положительный", "отрицательный", "нейтральный"]
);

// Генерирование идей
const ideas = await generateIdeas("Создать платформу обучения", 5);
```

**Что делает:** Специализированные операции

---

## 🎨 Где найти примеры

| Что ищешь | Где найти |
|-----------|-----------|
| Все примеры в коде | `lib/ai.examples.complete.ts` |
| Готовые компоненты | `components/AIComponents.tsx` |
| Example Components | `app/components/AIExamples/*` |
| Interactive Demo | http://localhost:3000/ai-demo |

---

## 🔗 Главные ссылки

| Что нужно | Файл |
|----------|------|
| **Начать здесь** | `QUICKSTART_NEXTJS_AI.md` |
| **Полное руководство** | `AI_INTEGRATION_GUIDE.md` |
| **Все примеры** | `lib/ai.examples.complete.ts` |
| **Interactive Demo** | `app/ai-demo/page.tsx` |
| **Исходный код** | `lib/ai.ts` |
| **Утилиты** | `lib/ai-utils.ts` |
| **Hooks** | `lib/useAI.ts` |
| **API Routes** | `app/api/ai/*` |

---

## 📝 Пример: Добавить AI в свой компонент

### До (без AI)
```typescript
export function BookCard({ book }) {
  return (
    <div>
      <h2>{book.title}</h2>
      <p>{book.description}</p>
    </div>
  );
}
```

### После (с AI)
```typescript
"use client";
import { useGenerateDescription } from "@/lib";

export function BookCard({ book }) {
  const { execute, loading, data: aiDescription } = useGenerateDescription();

  return (
    <div>
      <h2>{book.title}</h2>
      <p>{aiDescription || book.description}</p>
      <button 
        onClick={() => execute({
          title: book.title,
          subject: book.subject,
          context: "book"
        })}
        disabled={loading}
      >
        {loading ? "Генерирую..." : "📝 Улучшить описание"}
      </button>
    </div>
  );
}
```

---

## ⚡ Шпаргалка по параметрам

### Temperature (креативность ответа)
```typescript
// Консервативный ответ (факты, цифры)
{ temperature: 0.1 }

// Сбалансированный (по умолчанию)
{ temperature: 0.7 }

// Креативный ответ (идеи, истории)
{ temperature: 0.9 }
```

### MaxTokens (длина ответа)
```typescript
// Короткий: 1-2 предложения
{ maxTokens: 256 }

// Средний: 3-5 абзацев
{ maxTokens: 2048 }

// Длинный: много текста
{ maxTokens: 8192 }
```

### Model (выбор модели)
```typescript
// Быстро и экономно
"gemini-1.5-flash"

// Точнее и мощнее
"gemini-1.5-pro"
```

---

## 🎯 Чек-лист для начала

- [ ] Прочитал `QUICKSTART_NEXTJS_AI.md`
- [ ] Запустил `npm install && npm run dev`
- [ ] Открыл `http://localhost:3000/ai-demo`
- [ ] Увидел примеры в действии
- [ ] Скопировал один пример в свой код
- [ ] Протестировал локально
- [ ] Изменил промпт под свою задачу
- [ ] Добавил в свой проект

---

## 🚀 Типичные задачи

### Задача 1: Показать ответ при загрузке страницы
```typescript
// Server Component (app/page.tsx)
import { generateAIResponse } from "@/lib";

export default async function Page() {
  const answer = await generateAIResponse("Твой вопрос");
  return <div>{answer}</div>;
}
```

### Задача 2: Добавить кнопку "Спросить AI"
```typescript
// Client Component
"use client";
import { useAIRequest } from "@/lib";

export function AskButton() {
  const { execute, loading, data } = useAIRequest("/api/ai/simple");
  return (
    <>
      <button onClick={() => execute({ prompt: "Hi" })}>
        {loading ? "..." : "Спросить"}
      </button>
      {data && <p>{data}</p>}
    </>
  );
}
```

### Задача 3: Модерировать контент перед сохранением
```typescript
import { analyzeContent } from "@/lib";

export async function saveComment(comment: string) {
  const { isSafe } = await analyzeContent(comment);
  if (!isSafe) throw new Error("Недопустимое содержимое");
  
  // Сохранить в БД
}
```

### Задача 4: Генерировать описание автоматически
```typescript
import { generateDescription } from "@/lib";

export async function createCourse(title: string, subject: string) {
  const description = await generateDescription(title, subject, "course");
  // Сохранить с описанием в БД
}
```

---

## 🐛 Частые ошибки

### ❌ Ошибка: "GEMINI_API not set"
```
✅ Решение: Добавь в .env.local
GEMINI_API=your_api_key_here
```

### ❌ Ошибка: "Hook called outside of client component"
```
✅ Решение: Добавь "use client" в начало файла
"use client";
```

### ❌ Ошибка: "Failed to generate response"
```
✅ Решение: Проверь
1. API ключ верный
2. Интернет есть
3. Не превышен лимит запросов
4. Промпт не пуст
```

---

## ✨ Дальше?

### После первого использования:
1. Прочитай полное руководство `AI_INTEGRATION_GUIDE.md`
2. Изучи утилиты в `lib/ai-utils.ts`
3. Посмотри примеры в `lib/ai.examples.complete.ts`
4. Добавь обработку ошибок в своем коде
5. Интегрируй с БД (Prisma)
6. Добавь логирование

### Производство:
1. Протестируй все на staging
2. Добавь `GEMINI_API` в переменные окружения Vercel
3. Deploy как обычно
4. Мониторь использование API

---

## 🎉 Готово!

**Теперь у тебя есть полностью работающая AI интеграция!**

Начни с простого примера и развивай дальше.

**Удачи! 🚀**

---

*Документация создана: 2026*
*Версия API: Google Gemini 1.5*
*Фреймворк: Next.js 16*
