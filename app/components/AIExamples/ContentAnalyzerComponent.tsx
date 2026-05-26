// app/components/AIExamples/ContentAnalyzerComponent.tsx
"use client";

import { useState } from "react";
import { useAIRequest } from "@/lib/useAI";

interface AnalysisResult {
  isSafe: boolean;
  category: string;
  confidence: number;
  suggestions?: string;
}

// Задаем тип структуры, которую возвращает ваш API Route Handler
interface AIAnalyzeResponse {
  success?: boolean;
  // Если ваш API кладет структуру в поле response, меняем на { response: AnalysisResult }
  // Здесь мы предполагаем, что поля AnalysisResult приходят непосредственно в корне объекта ответа
  result?: AnalysisResult; 
  isSafe?: boolean;
  category?: string;
  confidence?: number;
  suggestions?: string;
}

/**
 * Компонент для анализа контента с помощью AI
 */
export function ContentAnalyzerComponent() {
  const { execute, loading, error, data } = useAIRequest("/api/ai/analyze");
  const [content, setContent] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await execute({ content });
  };

  /**
   * Функция-предикат (Type Guard) для безопасного извлечения данных анализа.
   * Она проверяет структуру пришедшего неизвестного (unknown) объекта.
   */
  const getAnalysisResult = (rawData: unknown): AnalysisResult | null => {
  if (!rawData || typeof rawData !== "object") return null;

  // Используем Record<string, unknown> вместо Record<string, any>
  const obj = rawData as Record<string, unknown>;

  // Вариант 1: Данные лежат напрямую в корне объекта data
  if ("isSafe" in obj) {
    return {
      isSafe: Boolean(obj.isSafe),
      category: typeof obj.category === "string" ? obj.category : "General",
      confidence: typeof obj.confidence === "number" ? obj.confidence : 1,
      suggestions: typeof obj.suggestions === "string" ? obj.suggestions : undefined
    };
  }

  // Вариант 2: Бэкенд возвращает { success: true, result: { ... } }
  if ("result" in obj && obj.result && typeof obj.result === "object") {
    const nestedResult = obj.result as Record<string, unknown>;
    return {
      isSafe: Boolean(nestedResult.isSafe),
      category: typeof nestedResult.category === "string" ? nestedResult.category : "General",
      confidence: typeof nestedResult.confidence === "number" ? nestedResult.confidence : 1,
      suggestions: typeof nestedResult.suggestions === "string" ? nestedResult.suggestions : undefined
    };
  }

  // Вариант 3: Бэкенд возвращает ответ внутри строкового JSON в поле response
  if ("response" in obj && typeof obj.response === "string") {
    try {
      const parsed = JSON.parse(obj.response);
      if (parsed && typeof parsed === "object" && "isSafe" in parsed) {
        const parsedObj = parsed as Record<string, unknown>;
        return {
          isSafe: Boolean(parsedObj.isSafe),
          category: typeof parsedObj.category === "string" ? parsedObj.category : "General",
          confidence: typeof parsedObj.confidence === "number" ? parsedObj.confidence : 1,
          suggestions: typeof parsedObj.suggestions === "string" ? parsedObj.suggestions : undefined
        };
      }
    } catch {
      return null;
    }
  }

  return null;
};

  const analysis = getAnalysisResult(data);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">🔍 Анализатор контента</h2>
      <p className="text-sm text-gray-600 mb-6">Проверь контент на безопасность и модерацию</p>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">
            Контент для анализа:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Вставь текст, который нужно проанализировать..."
            className="w-full p-4 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 resize-none h-32 text-gray-800"
            maxLength={2000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {content.length} / 2000 символов
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 font-semibold transition-all"
        >
          {loading ? "⏳ Анализирую..." : "🔍 Анализировать"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg">
          <p className="font-semibold">❌ Ошибка:</p>
          <p>{String(error)}</p>
        </div>
      )}

      {analysis && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-white border-l-4 border-blue-500 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-4 text-gray-800">📊 Результаты анализа:</h3>

            <div className="space-y-3">
              {/* Статус безопасности */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Статус:</span>
                <span
                  className={`px-4 py-2 rounded-full font-bold text-white ${
                    analysis.isSafe ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {analysis.isSafe ? "✅ Безопасно" : "⚠️ Опасно"}
                </span>
              </div>

              {/* Категория */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Категория:</span>
                <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {analysis.category}
                </span>
              </div>

              {/* Уверенность */}
              <div>
                <span className="font-semibold text-gray-700 block mb-2">
                  Уверенность: {Math.round(analysis.confidence * 100)}%
                </span>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${analysis.confidence * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Рекомендации */}
              {analysis.suggestions && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded mt-2">
                  <p className="font-semibold text-yellow-800 mb-1">💡 Рекомендации:</p>
                  <p className="text-yellow-700">{analysis.suggestions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}