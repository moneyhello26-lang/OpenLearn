// app/ai-demo/page.tsx
"use client";

import { useState } from "react";
import { UniversityFinderForm } from "@/components/AIComponents";
import { AskAIComponent } from "@/components/AIComponents";
import { GenerateDescriptionComponent } from "@/components/AIComponents";
import { SimplePromptComponent } from "@/app/components/AIExamples/SimplePromptComponent";
import { ChatComponent } from "@/app/components/AIExamples/ChatComponent";
import { ContentAnalyzerComponent } from "@/app/components/AIExamples/ContentAnalyzerComponent";

type TabType = "simple" | "chat" | "ask" | "university" | "description" | "analyze";

export default function AIDemoPage() {
  const [activeTab, setActiveTab] = useState<TabType>("simple");

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "simple", label: "Простой промпт", icon: "💬" },
    { id: "chat", label: "Чат", icon: "🗨️" },
    { id: "ask", label: "Вопрос-ответ", icon: "❓" },
    { id: "university", label: "Университеты", icon: "🎓" },
    { id: "description", label: "Генератор описаний", icon: "📝" },
    { id: "analyze", label: "Анализатор контента", icon: "🔍" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">🤖 AI Integration Demo</h1>
          <p className="text-lg opacity-90">
            Демонстрация всех возможностей Google Gemini API в Next.js проекте
          </p>
        </div>
      </div>

      {/* Содержимое */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Табы */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 bg-slate-800 p-2 rounded-lg w-fit mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Содержимое табов */}
        <div className="bg-slate-800 rounded-lg shadow-2xl p-6 min-h-96">
          {activeTab === "simple" && (
            <div>
              <SimplePromptComponent />
            </div>
          )}

          {activeTab === "chat" && (
            <div>
              <ChatComponent />
            </div>
          )}

          {activeTab === "ask" && (
            <div>
              <AskAIComponent />
            </div>
          )}

          {activeTab === "university" && (
            <div>
              <UniversityFinderForm />
            </div>
          )}

          {activeTab === "description" && (
            <div>
              <GenerateDescriptionComponent />
            </div>
          )}

          {activeTab === "analyze" && (
            <div>
              <ContentAnalyzerComponent />
            </div>
          )}
        </div>

        {/* Документация */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-white mb-4">📚 Быстрый старт</h3>
            <pre className="bg-slate-900 p-4 rounded text-green-400 text-sm overflow-x-auto">
{`import { generateAIResponse } from "@/lib/ai";

const answer = await generateAIResponse(
  "Твой вопрос или задача"
);`}
            </pre>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-white mb-4">🎯 API Routes</h3>
            <div className="text-gray-300 space-y-2 text-sm">
              <p>✓ <span className="text-purple-400">/api/ai/simple</span> - простой запрос</p>
              <p>✓ <span className="text-purple-400">/api/ai/chat</span> - чат с историей</p>
              <p>✓ <span className="text-purple-400">/api/ai/ask</span> - вопрос-ответ</p>
              <p>✓ <span className="text-purple-400">/api/ai/analyze</span> - анализ контента</p>
              <p>✓ <span className="text-purple-400">/api/ai/universities</span> - поиск вузов</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-white mb-4">🎣 React Hooks</h3>
            <div className="text-gray-300 space-y-2 text-sm">
              <p>✓ <span className="text-green-400">useAskAI()</span> - задать вопрос</p>
              <p>✓ <span className="text-green-400">useUniversityFinder()</span> - найти вузы</p>
              <p>✓ <span className="text-green-400">useGenerateDescription()</span> - генерировать</p>
              <p>✓ <span className="text-green-400">useAIRequest(endpoint)</span> - общий запрос</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border-l-4 border-orange-500">
            <h3 className="text-xl font-bold text-white mb-4">⚙️ Параметры</h3>
            <div className="text-gray-300 space-y-2 text-sm">
              <p>• <span className="text-yellow-400">temperature</span>: 0.1-1.0 (креативность)</p>
              <p>• <span className="text-yellow-400">maxTokens</span>: до 8192 (длина ответа)</p>
              <p>• <span className="text-yellow-400">model</span>: flash/pro версии</p>
            </div>
          </div>
        </div>

        {/* Файлы для изучения */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">📁 Ключевые файлы:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-purple-400 font-mono">lib/ai.ts</p>
              <p className="text-xs mt-1">Основные функции работы с AI</p>
            </div>
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-purple-400 font-mono">lib/useAI.ts</p>
              <p className="text-xs mt-1">React hooks для клиентской стороны</p>
            </div>
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-purple-400 font-mono">app/api/ai/*</p>
              <p className="text-xs mt-1">API routes для всех операций</p>
            </div>
            <div className="bg-slate-900 p-3 rounded">
              <p className="text-purple-400 font-mono">AI_INTEGRATION_GUIDE.md</p>
              <p className="text-xs mt-1">Полная документация</p>
            </div>
          </div>
        </div>
      </div>

      {/* Футер */}
      <div className="mt-12 bg-slate-900 border-t border-slate-700 py-6 text-center text-gray-400">
        <p>🚀 Powered by <span className="text-purple-400 font-bold">Google Gemini API</span> & <span className="text-blue-400 font-bold">Next.js</span></p>
      </div>
    </div>
  );
}
