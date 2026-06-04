
"use client";

import { useState } from "react";
import { useAIRequest } from "@/lib/useAI";
import ReactMarkdown from "react-markdown";

function renderData(data: unknown): React.ReactNode {
  if (!data) return null;

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if ("response" in obj && typeof obj.response === "string") {
      return <ReactMarkdown>{obj.response}</ReactMarkdown>;
    }
    if ("error" in obj && typeof obj.error === "string") {
      return <p style={{ color: 'var(--coral)' }} className="font-semibold">{obj.error}</p>;
    }
  }

  if (typeof data === "string") {
    return <ReactMarkdown>{data}</ReactMarkdown>;
  }

  return (
    <pre className="text-xs p-3 rounded-xl overflow-auto" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export function SimplePromptComponent() {
  const { execute, loading, error, data } = useAIRequest("/api/ai/simple");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await execute({ prompt, model: "gemini-1.5-flash" });
  };

  const hasData = data !== undefined && data !== null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
        💬 AI Помощник
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
            Введи свой вопрос или задачу:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Например: Объясни что такое machine learning..."
            className="w-full p-4 rounded-2xl text-sm resize-none h-28"
            style={{
              border: '1.5px solid var(--gray-mid)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontFamily: 'Sora, sans-serif',
            }}
            maxLength={5000}
          />
          <div className="text-xs mt-1" style={{ color: 'var(--gray-dark)' }}>
            {prompt.length} / 5000 символов
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="btn-primary w-full py-3.5 text-sm disabled:opacity-50"
          style={{ fontFamily: 'Sora, sans-serif' }}>
          {loading ? "⏳ Думаю..." : "🚀 Отправить"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded-2xl" style={{ background: 'var(--coral-light)', border: '1px solid var(--coral)', color: 'var(--coral-dark)' }}>
          <p className="font-semibold text-sm">❌ Ошибка: {String(error)}</p>
        </div>
      )}

      {hasData && (
        <div className="mt-6 p-5 rounded-2xl" style={{ background: 'var(--teal-pale)', border: '1.5px solid var(--teal-light)' }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--teal-dark)' }}>✅ Ответ:</h3>
          <div className="text-sm leading-relaxed prose-sm" style={{ color: 'var(--text)' }}>
            {renderData(data)}
          </div>
        </div>
      )}
    </div>
  );
}