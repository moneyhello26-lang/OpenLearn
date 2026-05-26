// app/components/AIExamples/ChatComponent.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useAIRequest } from "@/lib/useAI";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Компонент чата с историей сообщений
 */
export function ChatComponent() {
  const { execute, loading, error } = useAIRequest("/api/ai/chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Привет! 👋 Я твой AI помощник. Как дела? Чем я могу помочь?"
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    try {
      // Отправляем все сообщения контексте
      await execute({
        messages: [...messages, userMessage]
      });

      // Получаем ответ и добавляем его
      // Note: В реальном приложении нужно обработать ответ
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-screen flex flex-col bg-white rounded-lg shadow-xl">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-lg">
        <h2 className="text-2xl font-bold">💬 AI Chat</h2>
        <p className="text-sm opacity-90">Поговори со своим AI помощником</p>
      </div>

      {/* Сообщения */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === "user"
                  ? "bg-purple-500 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>❌ Ошибка: {error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Форма ввода */}
      <form
        onSubmit={handleSend}
        className="border-t bg-white p-4 rounded-b-lg flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напиши сообщение..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 font-semibold transition-all"
        >
          {loading ? "⏳" : "📤"}
        </button>
      </form>
    </div>
  );
}
