// app/components/AIExamples/ContentAnalyzerComponent.tsx
"use client";

import { useState } from "react";
import { useAIRequest } from "@/lib/useAI";

interface AnalysisResult {
  ieltsBand?: string;
  toeflScore?: string;
  feedback?: string;
}

export function ContentAnalyzerComponent() {
  const { execute, loading, error, data } = useAIRequest("/api/ai/analyze");
  const [content, setContent] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await execute({ content });
  };

  const getAnalysisResult = (rawData: unknown): AnalysisResult | null => {
    if (!rawData || typeof rawData !== "object") return null;
    const obj = rawData as Record<string, unknown>;

    // API normally returns { analysis: { ieltsBand, ... } }
    if ("analysis" in obj && typeof obj.analysis === "object" && obj.analysis !== null) {
      const a = obj.analysis as Record<string, unknown>;
      return {
        ieltsBand: typeof a.ieltsBand === "string" ? a.ieltsBand : undefined,
        toeflScore: typeof a.toeflScore === "string" ? a.toeflScore : undefined,
        feedback: typeof a.feedback === "string" ? a.feedback : undefined,
      };
    }

    if ("ieltsBand" in obj || "toeflScore" in obj) {
      return {
        ieltsBand: typeof obj.ieltsBand === "string" ? obj.ieltsBand : undefined,
        toeflScore: typeof obj.toeflScore === "string" ? obj.toeflScore : undefined,
        feedback: typeof obj.feedback === "string" ? obj.feedback : undefined,
      };
    }

    return null;
  };

  const analysis = getAnalysisResult(data);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
        📝 IELTS & TOEFL Анализатор текста
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Оцени свое эссе по международным критериям</p>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
            Текст эссе:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Вставь текст своего эссе сюда (без ограничения по символам)..."
            className="w-full p-4 rounded-2xl text-sm h-64"
            style={{
              border: '1.5px solid var(--gray-mid)',
              background: 'var(--bg)',
              color: 'var(--text)',
              fontFamily: 'Sora, sans-serif',
            }}
          />
          <div className="text-xs mt-1" style={{ color: 'var(--gray-dark)' }}>
            {content.length} символов
          </div>
        </div>

        <button type="submit" disabled={loading || !content.trim()}
          className="btn-coral w-full py-3.5 text-sm disabled:opacity-50"
          style={{ fontFamily: 'Sora, sans-serif' }}>
          {loading ? "⏳ Оцениваю..." : "🔍 Оценить текст"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded-2xl" style={{ background: 'var(--coral-light)', color: 'var(--coral-dark)' }}>
          <p className="font-semibold text-sm">❌ Ошибка: {String(error)}</p>
        </div>
      )}

      {analysis && (
        <div className="mt-6 rounded-2xl p-5 space-y-5"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)' }}>
          <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>📊 Твои ориентировочные баллы:</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl flex flex-col items-center justify-center border border-(--teal-light) bg-(--teal-pale)">
              <span className="text-xs font-semibold uppercase tracking-wider text-(--teal-dark) mb-1">IELTS Band</span>
              <span className="text-3xl font-black text-(--teal)">{analysis.ieltsBand || "N/A"}</span>
            </div>
            
            <div className="p-4 rounded-2xl flex flex-col items-center justify-center border border-purple-900/30 bg-purple-900/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">TOEFL iBT</span>
              <span className="text-3xl font-black text-purple-500">{analysis.toeflScore || "N/A"}</span>
            </div>
          </div>

          {analysis.feedback && (
            <div className="p-4 rounded-xl"
              style={{ background: 'var(--bg)', border: '1px solid var(--gray-mid)' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>💡 Развернутый отзыв:</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{analysis.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}