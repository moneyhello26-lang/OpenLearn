"use client";

import { useState } from "react";
import { useUniversityFinder, useAskAI, useGenerateDescription } from "@/lib/useAI";
import ReactMarkdown from "react-markdown";

function renderData(data: unknown): React.ReactNode {
  if (!data) return null;

  if (typeof data === "string") {
    return <ReactMarkdown>{data}</ReactMarkdown>;
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if ("response" in obj && typeof obj.response === "string") {
      return <ReactMarkdown>{obj.response}</ReactMarkdown>;
    }
    if ("answer" in obj && obj.answer !== undefined && obj.answer !== null) {
      return <ReactMarkdown>{String(obj.answer)}</ReactMarkdown>;
    }
    if ("description" in obj && obj.description !== undefined && obj.description !== null) {
      return <ReactMarkdown>{String(obj.description)}</ReactMarkdown>;
    }
  }

  return (
    <pre className="text-xs p-3 rounded-xl overflow-auto" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

/**
 * University Finder
 */
export function UniversityFinderForm() {
  const { execute, loading, error, data } = useUniversityFinder();
  const [formData, setFormData] = useState({
    gpa: 3.8, sat: 1480, ielts: 7.5,
    specialization: "Computer Science",
    countryPreference: "Canada",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: isNaN(Number(value)) ? value : Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(formData);
  };

  const hasData = data !== undefined && data !== null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid var(--gray-mid)', borderRadius: '12px',
    fontSize: '14px', fontFamily: 'Sora, sans-serif',
    color: 'var(--text)', background: 'var(--bg)', outline: 'none',
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
        style={{ color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
        🎓 Поиск университетов
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>GPA</label>
            <input type="number" name="gpa" value={formData.gpa} onChange={handleChange} step="0.1" min="0" max="4" style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>SAT</label>
            <input type="number" name="sat" value={formData.sat} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>IELTS</label>
            <input type="number" name="ielts" value={formData.ielts} onChange={handleChange} step="0.1" style={inputStyle} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>Специализация</label>
          <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} style={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>Страна</label>
          <input type="text" name="countryPreference" value={formData.countryPreference} onChange={handleChange} style={inputStyle} />
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full py-3.5 text-sm disabled:opacity-50"
          style={{ fontFamily: 'Sora, sans-serif' }}>
          {loading ? "⏳ Ищем..." : "🔍 Найти университеты"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded-2xl" style={{ background: 'var(--coral-light)', color: 'var(--coral-dark)' }}>
          {String(error)}
        </div>
      )}

      {hasData && (
        <div className="mt-6 p-5 rounded-2xl max-h-96 overflow-y-auto"
          style={{ background: 'var(--teal-pale)', border: '1.5px solid var(--teal-light)' }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--teal-dark)' }}>Рекомендации:</h3>
          <div className="text-sm leading-relaxed prose-sm" style={{ color: 'var(--text)' }}>{renderData(data)}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Ask AI
 */
export function AskAIComponent() {
  const { execute, loading, error, data } = useAskAI();
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await execute({ question, context: context || undefined });
  };

  const hasData = data !== undefined && data !== null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid var(--gray-mid)', borderRadius: '12px',
    fontSize: '14px', fontFamily: 'Sora, sans-serif',
    color: 'var(--text)', background: 'var(--bg)', outline: 'none',
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
        style={{ color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
        ❓ Задать вопрос AI
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>Вопрос</label>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)}
            placeholder="Задайте любой вопрос..." maxLength={5000} style={inputStyle} />
          <div className="text-xs mt-1" style={{ color: 'var(--gray-dark)' }}>{question.length} / 5000</div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>Контекст (необязательно)</label>
          <textarea value={context} onChange={(e) => setContext(e.target.value)}
            placeholder="Добавьте контекст или документы..."
            className="resize-none h-28" style={{ ...inputStyle, resize: 'none' as const, height: '100px' }} />
        </div>

        <button type="submit" disabled={loading || !question.trim()}
          className="btn-primary w-full py-3.5 text-sm disabled:opacity-50"
          style={{ fontFamily: 'Sora, sans-serif' }}>
          {loading ? "⏳ Получаем ответ..." : "🚀 Спросить AI"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded-2xl" style={{ background: 'var(--coral-light)', color: 'var(--coral-dark)' }}>
          {String(error)}
        </div>
      )}

      {hasData && (
        <div className="mt-6 p-5 rounded-2xl"
          style={{ background: 'var(--teal-pale)', border: '1.5px solid var(--teal-light)' }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--teal-dark)' }}>✅ Ответ:</h3>
          <div className="text-sm leading-relaxed prose-sm" style={{ color: 'var(--text)' }}>{renderData(data)}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Generate Description
 */
export function GenerateDescriptionComponent() {
  const { execute, loading, error, data } = useGenerateDescription();
  const [formData, setFormData] = useState({ title: "", subject: "", context: "book" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) return;
    await execute(formData);
  };

  const hasData = data !== undefined && data !== null;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid var(--gray-mid)', borderRadius: '12px',
    fontSize: '14px', fontFamily: 'Sora, sans-serif',
    color: 'var(--text)', background: 'var(--bg)', outline: 'none',
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"
        style={{ color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
        📝 Генератор описаний
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>Название</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange}
            placeholder="Название книги или курса" style={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>Предмет</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange}
            placeholder="Область знания" style={inputStyle} />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>Тип</label>
          <select name="context" value={formData.context} onChange={handleChange} style={inputStyle}>
            <option value="book">Книга</option>
            <option value="course">Курс</option>
            <option value="article">Статья</option>
          </select>
        </div>

        <button type="submit" disabled={loading || !formData.title || !formData.subject}
          className="btn-coral w-full py-3.5 text-sm disabled:opacity-50"
          style={{ fontFamily: 'Sora, sans-serif' }}>
          {loading ? "⏳ Генерируем..." : "✨ Сгенерировать описание"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded-2xl" style={{ background: 'var(--coral-light)', color: 'var(--coral-dark)' }}>
          {String(error)}
        </div>
      )}

      {hasData && (
        <div className="mt-6 p-5 rounded-2xl"
          style={{ background: 'var(--coral-light)', border: '1.5px solid var(--coral)' }}>
          <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--coral-dark)' }}>✨ Описание:</h3>
          <div className="text-sm leading-relaxed prose-sm" style={{ color: 'var(--text)' }}>{renderData(data)}</div>
        </div>
      )}
    </div>
  );
}