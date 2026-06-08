"use client";

import { useState } from "react";
import { useUniversityFinder, useAskAI, useGenerateDescription } from "@/lib/useAI";
import ReactMarkdown from "react-markdown";

/** Client-side cleaning: removes thinking blocks, excessive asterisks, etc. */
function cleanText(text: string): string {
  let cleaned = text;
  // Remove thinking/reasoning XML blocks
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>\s*/gi, '');
  cleaned = cleaned.replace(/<thinking>[\s\S]*?<\/thinking>\s*/gi, '');
  cleaned = cleaned.replace(/<reasoning>[\s\S]*?<\/reasoning>\s*/gi, '');
  cleaned = cleaned.replace(/<scratchpad>[\s\S]*?<\/scratchpad>\s*/gi, '');
  cleaned = cleaned.replace(/<reflection>[\s\S]*?<\/reflection>\s*/gi, '');
  cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>\s*/gi, '');
  cleaned = cleaned.replace(/<draft>[\s\S]*?<\/draft>\s*/gi, '');
  // Remove ```thinking blocks
  cleaned = cleaned.replace(/```(?:thinking|reasoning|scratchpad|internal_monologue)[\s\S]*?```\s*/gi, '');
  // Remove thinking prefix lines
  cleaned = cleaned.replace(/^(?:Thinking:|Reasoning:|Let me think|Hmm,|Wait,|Actually,|Internal thought:|My reasoning:|Draft:).*$/gim, '');
  // Handle ---FINAL_ANSWER--- marker
  if (cleaned.includes('---FINAL_ANSWER---')) {
    cleaned = cleaned.split('---FINAL_ANSWER---').pop()!;
  }
  // Clean excessive asterisks
  cleaned = cleaned.replace(/\*{3,}/g, '');
  cleaned = cleaned.replace(/^\*\*\s*$/gm, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

function renderData(data: unknown): React.ReactNode {
  if (!data) return null;

  if (typeof data === "string") {
    return <ReactMarkdown>{cleanText(data)}</ReactMarkdown>;
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if ("response" in obj && typeof obj.response === "string") {
      return <ReactMarkdown>{cleanText(obj.response)}</ReactMarkdown>;
    }
    if ("answer" in obj && obj.answer !== undefined && obj.answer !== null) {
      return <ReactMarkdown>{cleanText(String(obj.answer))}</ReactMarkdown>;
    }
    if ("description" in obj && obj.description !== undefined && obj.description !== null) {
      return <ReactMarkdown>{cleanText(String(obj.description))}</ReactMarkdown>;
    }
  }

  return (
    <pre className="text-xs p-3 rounded-xl overflow-auto" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

interface UniversityRecommendation {
  name: string;
  country: string;
  reason: string;
  requirements: string;
  acceptanceRate: number;
  matchPercentage: number;
}

export function UniversityFinderForm() {
  const { execute, loading, error, data } = useUniversityFinder();
  const [formData, setFormData] = useState<{
    gpa: number | string;
    sat: number | string;
    ielts: number | string;
    specialization: string;
    countryPreference: string;
  }>({
    gpa: 3.8, sat: 1480, ielts: 7.5,
    specialization: "Computer Science",
    countryPreference: "США",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value === "" ? "" : isNaN(Number(value)) ? value : Number(value) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(formData);
  };

  const getUniversitiesList = (): UniversityRecommendation[] => {
    if (!data) return [];

    const rawData = (data as any)?.data || data;
    if (typeof rawData === "string") {
      try {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  };

  const universities = getUniversitiesList();
  const hasData = universities.length > 0;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid var(--gray-mid)', borderRadius: '12px',
    fontSize: '14px', fontFamily: 'Sora, sans-serif',
    color: 'var(--text)', background: 'var(--bg)', outline: 'none',
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
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
          <select name="specialization" value={formData.specialization} onChange={handleChange} style={inputStyle}>
            <option value="Computer Science">Computer Science / IT</option>
            <option value="Business & Management">Business & Management</option>
            <option value="Engineering">Engineering</option>
            <option value="Medicine & Health">Medicine & Health</option>
            <option value="Arts & Humanities">Arts & Humanities</option>
            <option value="Natural Sciences">Natural Sciences</option>
            <option value="Law">Law</option>
            <option value="Social Sciences">Social Sciences</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text)' }}>Страна</label>
          <select name="countryPreference" value={formData.countryPreference} onChange={handleChange} style={inputStyle}>
            <option value="США">США (USA)</option>
            <option value="Великобритания">Великобритания (UK)</option>
            <option value="Канада">Канада (Canada)</option>
            <option value="Австралия">Австралия (Australia)</option>
            <option value="Германия">Германия (Germany)</option>
            <option value="Китай">Китай (China)</option>
          </select>
        </div>

        <button type="submit" disabled={loading}
          className="btn-glow w-full py-3.5 text-sm disabled:opacity-50 mt-4"
          style={{ fontFamily: 'Sora, sans-serif' }}>
          {loading ? "⏳ Ищем..." : "🔍 Подобрать вузы"}
        </button>
      </form>

      {error && (
        <div className="mt-8 p-4 rounded-2xl max-w-2xl mx-auto" style={{ background: 'var(--coral-light)', color: 'var(--coral-dark)' }}>
          {String(error)}
        </div>
      )}

      {hasData && (
        <div className="mt-12">
          <h3 className="font-bold text-2xl mb-6 text-white text-center">🎯 Подходящие университеты:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {universities.map((uni, idx) => (
              <div key={idx} className="bento-card p-6 flex flex-col slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1 leading-tight">{uni.name}</h4>
                    <span className="text-xs px-2 py-1 rounded-md font-semibold" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>
                      📍 {uni.country}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-gradient-color">{uni.matchPercentage}%</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted font-bold">Совпадение</span>
                  </div>
                </div>

                <p className="text-sm text-muted mb-6 leading-relaxed flex-grow">
                  {uni.reason}
                </p>

                <div className="space-y-4 border-t border-[rgba(255,255,255,0.05)] pt-4 mt-auto">
                  <div>
                    <span className="text-xs uppercase font-bold text-muted mb-1 block">Требования:</span>
                    <p className="text-sm text-white font-medium bg-[rgba(255,255,255,0.03)] p-2 rounded-lg border border-[rgba(255,255,255,0.05)]">
                      {uni.requirements}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-muted">Шанс поступления</span>
                      <span className="text-white">{uni.acceptanceRate}%</span>
                    </div>
                    <div className="w-full rounded-full h-1.5 bg-[rgba(255,255,255,0.1)]">
                      <div className="h-1.5 rounded-full transition-all duration-1000"
                        style={{
                          width: `${uni.acceptanceRate}%`,
                          background: 'var(--glow-accent)',
                          boxShadow: '0 0 10px var(--glow-accent)'
                        }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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