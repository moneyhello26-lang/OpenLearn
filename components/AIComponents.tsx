"use client";

import { useState } from "react";
import { useUniversityFinder, useAskAI, useGenerateDescription } from "@/lib/useAI";
import ReactMarkdown from "react-markdown";

/**
 * Безопасная функция для конвертации unknown-данных в валидный ReactNode.
 * Полностью соответствует правилам ESLint (без explicit any).
 */
function renderData(data: unknown): React.ReactNode {
  if (!data) return null;

  if (typeof data === "string") {
    return <ReactMarkdown >{data}</ReactMarkdown>;
  }

  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;

    // Если бэкенд возвращает { response: "..." } (как в вашем /api/ai/simple)
    if ("response" in obj && typeof obj.response === "string") {
      return <ReactMarkdown ></ReactMarkdown>;
    }

    // Проверка наличия поля 'answer'
    if ("answer" in obj && obj.answer !== undefined && obj.answer !== null) {
      return <ReactMarkdown>{String(obj.answer)}</ReactMarkdown>;
    }

    // Проверка наличия поля 'description'
    if ("description" in obj && obj.description !== undefined && obj.description !== null) {
      return <ReactMarkdown >{String(obj.description)}</ReactMarkdown>;
    }
  }

  // Фаллбэк для массивов или кастомных JSON структур
  return (
    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto font-mono text-gray-800">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

/**
 * Component: University Finder Form
 * Позволяет студентам найти подходящие университеты
 */
export function UniversityFinderForm() {
  const { execute, loading, error, data } = useUniversityFinder();
  const [formData, setFormData] = useState({
    gpa: 3.8,
    sat: 1480,
    ielts: 7.5,
    specialization: "Computer Science",
    countryPreference: "Canada",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await execute(formData);
  };

  const hasData = data !== undefined && data !== null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Find Your University</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">GPA</label>
          <input
            type="number"
            name="gpa"
            value={formData.gpa}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="4"
            className="w-full p-2 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SAT Score</label>
          <input
            type="number"
            name="sat"
            value={formData.sat}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">IELTS Score</label>
          <input
            type="number"
            name="ielts"
            value={formData.ielts}
            onChange={handleChange}
            step="0.1"
            className="w-full p-2 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Specialization</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country Preference
          </label>
          <input
            type="text"
            name="countryPreference"
            value={formData.countryPreference}
            onChange={handleChange}
            className="w-full p-2 border rounded-md text-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 font-semibold transition-colors"
        >
          {loading ? "Searching..." : "Find Universities"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          {String(error)}
        </div>
      )}

      {hasData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md max-h-96 overflow-y-auto">
          <h3 className="font-bold mb-3 text-gray-800">Recommendations:</h3>
          <div className="text-sm">{renderData(data)}</div>
        </div>
      )}
    </div>
  );
}

/**
 * Component: AI Question Answerer
 * Позволяет пользователям задавать вопросы ИИ
 */
export function AskAIComponent() {
  const { execute, loading, error, data } = useAskAI();
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    await execute({
      question,
      context: context || undefined,
    });
  };

  const hasData = data !== undefined && data !== null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ask AI a Question</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            className="w-full p-3 border rounded-md text-gray-800"
            maxLength={5000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {question.length} / 5000
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Context (Optional)
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add context or documents..."
            className="w-full p-3 border rounded-md h-32 resize-none text-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 font-semibold transition-colors"
        >
          {loading ? "Getting Answer..." : "Ask AI"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          {String(error)}
        </div>
      )}

      {hasData && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
          <h3 className="font-bold text-green-900 mb-2">Answer:</h3>
          <div className="leading-relaxed">
            {renderData(data)}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Component: Generate Description
 * Генерирует описание для книг и курсов
 */
export function GenerateDescriptionComponent() {
  const { execute, loading, error, data } = useGenerateDescription();
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    context: "book",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject) return;

    await execute(formData);
  };

  const hasData = data !== undefined && data !== null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Generate Description</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Book or course title"
            className="w-full p-3 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject area"
            className="w-full p-3 border rounded-md text-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
          <select
            name="context"
            value={formData.context}
            onChange={handleChange}
            className="w-full p-3 border rounded-md text-gray-800 bg-white"
          >
            <option value="book">Book</option>
            <option value="course">Course</option>
            <option value="article">Article</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.title || !formData.subject}
          className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 disabled:bg-gray-400 font-semibold transition-colors"
        >
          {loading ? "Generating..." : "Generate Description"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
          {String(error)}
        </div>
      )}

      {hasData && (
        <div className="mt-6 p-4 bg-purple-50 rounded-md">
          <h3 className="font-bold text-purple-900 mb-3">Generated Description:</h3>
          <div className="leading-relaxed">
            {renderData(data)}
          </div>
        </div>
      )}
    </div>
  );
}