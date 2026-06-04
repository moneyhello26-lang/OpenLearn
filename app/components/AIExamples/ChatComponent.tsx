"use client";

import { useState, useRef, useEffect } from "react";
import { useAIRequest } from "@/lib/useAI";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatComponent() {
  const { execute, loading, error } = useAIRequest("/api/ai/chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Система активирована. Я — ваш персональный образовательный ИИ-ментор. Чем могу помочь сегодня?"
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

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const result = await execute({ messages: newMessages });
      if (result?.message) {
        setMessages(prev => [...prev, { role: "assistant", content: result.message }]);
      } else if (result?.data?.message) {
        setMessages(prev => [...prev, { role: "assistant", content: result.data.message }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col rounded-2xl overflow-hidden relative"
      style={{ height: '600px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)' }}>

      {}
      <div className="px-6 py-5 flex items-center gap-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]">
        <div className="w-10 h-10 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-(--glow-accent) rounded-full blur-md opacity-50"></div>
          <div className="relative text-xl z-10">🧠</div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white tracking-widest uppercase">Nexus AI</h2>
          <p className="text-xs text-(--glow-accent) mt-1 font-medium tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-(--glow-accent) shadow-[0_0_8px_var(--glow-accent)] animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 mt-1 shrink-0 text-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                AI
              </div>
            )}
            
            <div
              className={`max-w-[80%] px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                message.role === "user" 
                  ? "bg-[rgba(99,102,241,0.2)] text-white border border-[rgba(99,102,241,0.4)] shadow-[0_0_20px_rgba(99,102,241,0.1)] rounded-tr-sm" 
                  : "bg-[rgba(255,255,255,0.03)] text-(--accents-8) border border-[rgba(255,255,255,0.08)] rounded-tl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-center">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
               <span className="w-1.5 h-1.5 rounded-full bg-(--glow-accent) animate-pulse"></span>
            </div>
            <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
              <div className="flex space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-(--glow-accent) animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-(--glow-secondary) animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-(--glow-tertiary) animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl text-sm bg-red-500/10 border border-red-500/20 text-red-400">
            ⚠ Системный сбой: {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {}
      <div className="p-4 bg-[rgba(0,0,0,0.5)] border-t border-[rgba(255,255,255,0.05)]">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите запрос..."
            className="w-full py-4 pl-5 pr-16 rounded-xl text-sm bg-[rgba(255,255,255,0.03)] border border-subtle text-white focus:bg-[rgba(255,255,255,0.05)] focus:border-(--glow-accent) outline-none transition-all"
            maxLength={1000}
          />
          <button type="submit" disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-white text-black font-bold disabled:opacity-30 transition-opacity hover:opacity-80">
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
