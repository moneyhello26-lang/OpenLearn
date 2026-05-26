# 🚀 БЫСТРЫЙ СТАРТ - AI в Next.js

> **За 5 минут интегрируй AI в свой Next.js код!**

---

## ✅ Что уже готово

- ✓ Google Gemini API настроен
- ✓ API routes созданы
- ✓ React Hooks готовы к использованию
- ✓ Примеры компонентов написаны
- ✓ Demo страница доступна

**Переходи на:** `http://localhost:3000/ai-demo`

---

## 🔥 3 способа использования

### 1️⃣ **САМЫЙ ПРОСТОЙ** - в Server Component

```typescript
// app/my-page/page.tsx
import { generateAIResponse } from "@/lib/ai";

export default async function Page() {
  const answer = await generateAIResponse("Привет! Кто ты?");
  
  return <div>{answer}</div>;
}
```

**Когда использовать:** Для загрузки данных при открытии страницы

---

### 2️⃣ **ДЛЯ ИНТЕРАКТИВНОСТИ** - React Hook + Client Component

```typescript
// app/my-component.tsx
"use client";

import { useState } from "react";
import { useAIRequest } from "@/lib/useAI";

export function MyAIComponent() {
  const [input, setInput] = useState("");
  const { execute, loading, data, error } = useAIRequest("/api/ai/simple");

  const handleClick = () => {
    execute({ prompt: input });
  };

  return (
    <div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Спроси что-нибудь"
      />
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Думаю..." : "Спросить"}
      </button>
      {data && <p>{data}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

**Когда использовать:** Для кнопок, форм, интерактивных элементов

---

### 3️⃣ **ВСТРОЕННЫЕ СПЕЦИАЛИЗИРОВАННЫЕ HOOKS**

#### Вопрос-Ответ
```typescript
"use client";
import { useAskAI } from "@/lib/useAI";

export function QAComponent() {
  const { execute, loading, data } = useAskAI();

  return (
    <div>
      <button onClick={() => execute({ question: "Python это?" })}>
        Спросить
      </button>
      {data && <p>{data.answer}</p>}
    </div>
  );
}
```

#### Поиск Университетов
```typescript
"use client";
import { useUniversityFinder } from "@/lib/useAI";

export function UniversityComponent() {
  const { execute, loading, data } = useUniversityFinder();

  return (
    <div>
      <button onClick={() => execute({
        gpa: 3.8,
        sat: 1480,
        ielts: 7.5,
        specialization: "CS",
        countryPreference: "USA"
      })}>
        Найти вузы
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

#### Генерирование Описаний
```typescript
"use client";
import { useGenerateDescription } from "@/lib/useAI";

export function DescriptionComponent() {
  const { execute, loading, data } = useGenerateDescription();

  return (
    <div>
      <button onClick={() => execute({
        title: "Python для начинающих",
        subject: "Программирование",
        context: "course"
      })}>
        Создать описание
      </button>
      {data && <p>{data}</p>}
    </div>
  );
}
```

---

## 📡 Доступные API Routes

| Route | Method | Использование |
|-------|--------|---------------|
| `/api/ai/simple` | POST | Любой текстовый запрос |
| `/api/ai/chat` | POST | Чат с историей сообщений |
| `/api/ai/ask` | POST | Вопрос с контекстом |
| `/api/ai/analyze` | POST | Анализ контента |
| `/api/ai/universities` | POST | Поиск вузов |
| `/api/ai/generate-description` | POST | Генерирование описаний |

### Пример POST запроса

```typescript
const response = await fetch("/api/ai/simple", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    prompt: "Расскажи о Python",
    model: "gemini-1.5-pro",
    temperature: 0.7,
    maxTokens: 2000
  })
});

const data = await response.json();
console.log(data.response);
```

---

## 🎯 Практические Примеры

### Пример 1: Комментарий книги с AI описанием

```typescript
// app/books/[id]/new-comment/page.tsx
"use client";

import { useState } from "react";
import { useAIRequest } from "@/lib/useAI";

export function AIEnhancedComment() {
  const [comment, setComment] = useState("");
  const { execute, loading, data: aiEnhanced } = useAIRequest("/api/ai/simple");

  const enhanceWithAI = async () => {
    await execute({
      prompt: `Улучши и развей этот комментарий о книге, сделай его более информативным и интересным:
      "${comment}"`
    });
  };

  return (
    <div>
      <textarea 
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Напиши комментарий..."
      />
      
      <button onClick={enhanceWithAI} disabled={loading}>
        {loading ? "AI улучшает..." : "✨ Улучшить с AI"}
      </button>

      {aiEnhanced && (
        <div className="bg-blue-50 p-4 rounded">
          <h3>Улучшенный комментарий:</h3>
          <p>{aiEnhanced}</p>
        </div>
      )}
    </div>
  );
}
```

### Пример 2: Модерация рецензий

```typescript
// lib/moderate-review.ts
import { analyzeContent } from "@/lib/ai";

export async function moderateReview(review: string) {
  const analysis = await analyzeContent(review);
  
  if (!analysis.isSafe) {
    throw new Error(`Рецензия не прошла модерацию: ${analysis.category}`);
  }
  
  return analysis;
}
```

Использование:
```typescript
// app/api/reviews/route.ts
import { moderateReview } from "@/lib/moderate-review";

export async function POST(request: NextRequest) {
  const { review } = await request.json();
  
  try {
    await moderateReview(review);
    // Сохраняем рецензию в БД
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
```

### Пример 3: Рекомендация курсов по профилю

```typescript
// lib/recommend-courses.ts
import { generateAIResponse } from "@/lib/ai";

export async function recommendCourses(userProfile: {
  skills: string[];
  level: string;
  interests: string[];
}) {
  const prompt = `На основе профиля студента рекомендуй топ-5 курсов:
  - Текущие навыки: ${userProfile.skills.join(", ")}
  - Уровень: ${userProfile.level}
  - Интересы: ${userProfile.interests.join(", ")}
  
  Для каждого курса указать:
  1. Название
  2. Почему подходит
  3. Ожидаемые результаты`;

  return generateAIResponse(prompt, "gemini-1.5-pro", {
    temperature: 0.6,
    maxTokens: 2000
  });
}
```

### Пример 4: Суммаризация статьи

```typescript
// app/articles/[id]/page.tsx
import { generateAIResponse } from "@/lib/ai";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await fetchArticle(params.id);
  
  const summary = await generateAIResponse(
    `Создай краткое резюме (2-3 абзаца) для этой статьи:
    
    ${article.content}`,
    "gemini-1.5-flash",
    { temperature: 0.3 }
  );

  return (
    <div>
      <h1>{article.title}</h1>
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3>TL;DR:</h3>
        <p>{summary}</p>
      </div>
      <article>{article.content}</article>
    </div>
  );
}
```

---

## ⚙️ Параметры Генерации

### Temperature (Креативность)

```typescript
// Консервативно (факты, переводы)
temperature: 0.1

// Сбалансировано (по умолчанию)
temperature: 0.7

// Креативно (идеи, названия)
temperature: 0.9
```

### Max Tokens (Длина ответа)

```typescript
// Короткий ответ
maxTokens: 256

// Стандартный
maxTokens: 2048

// Длинный ответ
maxTokens: 8192
```

### Model (Модель)

```typescript
// Быстро и экономно
"gemini-1.5-flash"

// Точнее и мощнее
"gemini-1.5-pro"

// Старая версия
"gemini-pro"
```

---

## 🐛 Обработка ошибок

```typescript
try {
  const answer = await generateAIResponse("Вопрос");
  console.log(answer);
} catch (error) {
  if (error instanceof Error) {
    console.error("AI Error:", error.message);
  }
}
```

---

## 📊 Проверка лимитов

Google Gemini API имеет лимиты на количество запросов в минуту. Если превысить:

```typescript
// Обработка лимита
export async function callWithRetry(fn: () => Promise<string>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < maxRetries - 1) {
        // Ждём перед следующей попыткой
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      } else {
        throw error;
      }
    }
  }
}
```

---

## 🎨 Компоненты в проекте

Готовые компоненты в `components/AIComponents.tsx`:
- `UniversityFinderForm` - поиск вузов
- `AskAIComponent` - вопрос-ответ
- `GenerateDescriptionComponent` - генерирование

Примеры в `app/components/AIExamples/`:
- `SimplePromptComponent` - простой промпт
- `ChatComponent` - чат
- `ContentAnalyzerComponent` - анализ контента

---

## 🔗 Полезные ссылки

- 📖 [Полное руководство](AI_INTEGRATION_GUIDE.md)
- 🎯 [Google Gemini Docs](https://ai.google.dev/)
- ⚙️ [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- 🎣 [React Hooks](https://react.dev/reference/react/hooks)

---

## ❓ FAQ

**Q: Где хранится API ключ?**
A: В `.env.local` переменной `GEMINI_API`

**Q: Это будет стоить денег?**
A: Google предоставляет бесплатную квоту. За пределами лимита нужна оплата.

**Q: Можно ли использовать другую AI модель?**
A: Да, замени Google Gemini на OpenAI ChatGPT или другую в `lib/ai.ts`

**Q: Как загрузить историю чата в БД?**
A: Используй `generateChatResponse` с сохранением всех сообщений в Prisma

**Q: Как закэшировать ответы?**
A: Добавь Redis или используй встроенный кэш Next.js

---

## 🎉 Готово!

Теперь ты можешь использовать AI в любом месте своего Next.js приложения!

**Начни с:** `/ai-demo` → выбери нужный пример → копируй код
