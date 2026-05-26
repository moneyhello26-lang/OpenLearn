// app/components/AIExamples/SimplePromptComponent.tsx
"use client";

import { useState } from "react";
import { useAIRequest } from "@/lib/useAI";
import ReactMarkdown from "react-markdown";

/**
 * Безопасный рендеринг ответа ИИ с учетом структуры вашего API { success, prompt, response }
 * Полностью соответствует строгим правилам ESLint (без explicit any).
 */
function renderData(data: unknown): React.ReactNode {
  if (!data) return null;

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;

    if ("response" in obj && typeof obj.response === "string") {
      return (
        <ReactMarkdown>
          {obj.response}
        </ReactMarkdown>
      );
    }

    if ("error" in obj && typeof obj.error === "string") {
      return <p className="text-red-500 font-semibold">{obj.error}</p>;
    }
  }

  if (typeof data === "string") {
    return (
      <ReactMarkdown>
        {data}
      </ReactMarkdown>
    );
  }

  return (
    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

/**
 * Простой компонент для отправки произвольного промпта
 */
export function SimplePromptComponent() {
  const { execute, loading, error, data } = useAIRequest("/api/ai/simple");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    await execute({
      prompt,
      model: "gemini-1.5-flash"
    });
  };

  // Переводим проверку наличия данных в явный булевый тип
  const hasData = data !== undefined && data !== null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">💬 AI Помощник</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Введи свой вопрос или задачу:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Например: Объясни что такое machine learning..."
            className="w-full p-4 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none h-28 text-gray-800"
            maxLength={5000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {prompt.length} / 5000 символов
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 font-semibold transition-all"
        >
          {loading ? "⏳ Думаю..." : "🚀 Отправить"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg">
          <p className="font-semibold">❌ Ошибка:</p>
          <p>{String(error)}</p>
        </div>
      )}

      {/* ИСПОЛЬЗУЕМ ЯВНУЮ БУЛЕВУЮ КОНСТАНТУ Вместо {data && ...} */}
      {hasData && (
        <div className="mt-6 p-4 bg-white border-l-4 border-green-500 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-3 text-gray-800">✅ Ответ:</h3>
          <div className="text-gray-700 leading-relaxed">
            {renderData(data)} 
          </div>
        </div>
      )}
    </div>
  );
}