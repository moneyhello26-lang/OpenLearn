# AI Integration Guide - OpenLearn

## Обзор

Проект полностью интегрирован с Google Gemini API для предоставления AI-функционала:
- 🤖 Подбор университетов по профилю студента
- 💬 Ответы на вопросы пользователей
- 📝 Генерация описаний книг и курсов
- 🔍 Поиск и рекомендации
- ✅ Анализ и модерация контента

## Настройка

### 1. Установка зависимостей

```bash
npm install
```

Будет установлена библиотека `@google/generative-ai`.

### 2. API Ключ

API ключ уже настроен в `.env` файле:
```env
GEMINI_API=AIzaSyDdUs6gvLOThRnhXVEvKICQckkatYft5ts
```

Если нужно обновить ключ, получите его на [ai.google.dev](https://ai.google.dev/)

## Основные функции

### 1. Простой текстовый запрос

```typescript
import { generateAIResponse } from "@/lib/ai";

const response = await generateAIResponse(
  "Твой вопрос или промпт здесь"
);
console.log(response);
```

### 2. Подбор университетов

```typescript
import { findUniversities } from "@/lib/ai";

const recommendations = await findUniversities({
  gpa: 3.8,
  sat: 1480,
  ielts: 7.5,
  specialization: "Computer Science",
  countryPreference: "Canada"
});
```

### 3. Ответ на вопрос

```typescript
import { answerQuestion } from "@/lib/ai";

const answer = await answerQuestion(
  "Какие языки программирования лучше выучить?",
  "Optional context or document"
);
```

### 4. Генерация описания

```typescript
import { generateDescription } from "@/lib/ai";

const description = await generateDescription(
  "Введение в Python",
  "Программирование"
);
```

### 5. Диалог с историей

```typescript
import { generateChatResponse } from "@/lib/ai";

const messages = [
  { role: "user", content: "Что такое ИИ?" },
  { role: "assistant", content: "..." },
  { role: "user", content: "Расскажи больше" }
];

const response = await generateChatResponse(messages);
```

## API Маршруты

### POST /api/ai/universities
Подбор университетов по профилю студента

**Request:**
```json
{
  "gpa": 3.9,
  "sat": 1500,
  "ielts": 8.0,
  "specialization": "Data Science",
  "countryPreference": "USA"
}
```

**Response:**
```json
{
  "success": true,
  "data": "Рекомендации университетов..."
}
```

### POST /api/ai/ask
Ответ на любой вопрос

**Request:**
```json
{
  "question": "Твой вопрос",
  "context": "Optional context"
}
```

**Response:**
```json
{
  "success": true,
  "question": "...",
  "answer": "..."
}
```

### POST /api/ai/generate-description
Генерация описания

**Request:**
```json
{
  "title": "Название",
  "subject": "Предмет",
  "context": "Optional: book/course"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "...",
    "subject": "...",
    "description": "..."
  }
}
```

## Использование в React компонентах

```typescript
"use client";

import { useState } from "react";

export function UniversityFinder() {
  const [loading, setLoading] = useState(false);

  const handleFindUniversities = async (gpa, sat, ielts, spec) => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gpa,
          sat,
          ielts,
          specialization: spec
        }),
      });
      
      const data = await response.json();
      console.log(data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={() => handleFindUniversities(3.8, 1480, 7.5, "CS")}>
      {loading ? "Загрузка..." : "Найти университеты"}
    </button>
  );
}
```

## Параметры генерации

```typescript
interface AIGenerateOptions {
  temperature?: number;    // 0.1-0.9, default 0.7
  maxTokens?: number;      // default 2048
  topK?: number;          // default 40
  topP?: number;          // default 0.95
}
```

**temperature** - креативность ответа:
- 0.1-0.3: консервативно (факты, кодирование)
- 0.5-0.7: сбалансировано (по умолчанию)
- 0.8-0.9: креативно (идеи, творчество)

## Выбор модели

```typescript
type AIModel = "gemini-pro" | "gemini-1.5-pro" | "gemini-1.5-flash";
```

- **gemini-1.5-flash**: быстро, дешево (рекомендуется)
- **gemini-1.5-pro**: мощнее, точнее (для сложных задач)
- **gemini-pro**: старая версия

## Обработка ошибок

```typescript
try {
  const response = await generateAIResponse(prompt);
} catch (error) {
  console.error("AI Error:", error);
  // Показать пользователю дружелюбное сообщение об ошибке
}
```

## Примеры кода

Полные примеры с кодом смотрите в файле `lib/ai.examples.ts`

## Советы по оптимизации

1. **Используйте gemini-1.5-flash** для простых задач (быстрее и дешевле)
2. **Кешируйте результаты** для часто повторяющихся запросов
3. **Добавьте rate limiting** в API маршрутах
4. **Валидируйте входные данные** перед отправкой в AI
5. **Устанавливайте timeout** для длительных запросов

## Безопасность

- ✅ API ключ в `.env` файле (не коммитится в git)
- ✅ Валидация входных данных в API маршрутах
- ✅ Анализ содержимого перед сохранением
- ✅ Rate limiting рекомендуется добавить

## Лимиты

- Максимум 2048 токенов на ответ (по умолчанию)
- Макс длина вопроса: 5000 символов
- GPA должна быть между 0 и 4.0

## Troubleshooting

**Ошибка: "GEMINI_API environment variable is not set"**
- Проверьте `.env` файл
- Перезагрузите сервер разработки

**Ошибка: "Failed to generate response"**
- Проверьте интернет соединение
- Проверьте валидность API ключа
- Проверьте лимиты использования на ai.google.dev

**Медленные ответы**
- Используйте `gemini-1.5-flash` вместо `gemini-1.5-pro`
- Уменьшите `maxTokens` если возможно

## Дальнейшие улучшения

- [ ] Добавить кешение результатов в Redis/Database
- [ ] Добавить rate limiting (redis-based)
- [ ] Добавить streaming для длительных ответов
- [ ] Интеграция с платежной системой для отслеживания использования
- [ ] Логирование всех AI запросов
- [ ] A/B тестирование разных промптов

## Ссылки

- [Google Gemini API](https://ai.google.dev/)
- [SDK Documentation](https://ai.google.dev/tutorials/node_quickstart)
- [Models & Pricing](https://ai.google.dev/models)

---

**Последнее обновление**: Май 2026
**Версия**: 1.0.0
