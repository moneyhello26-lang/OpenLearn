'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChatComponent } from '../components/AIExamples/ChatComponent';
import { ContentAnalyzerComponent } from '../components/AIExamples/ContentAnalyzerComponent';
import { UniversityFinderForm } from '../../components/AIComponents';

export default function AIDemoPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'university' | 'analyzer'>('chat');

  return (
    <div className="min-h-screen pt-36 pb-20 px-6 max-w-5xl mx-auto relative overflow-hidden">
      
      {}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-150 h-100 rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: 'var(--glow-accent)' }}></div>

      <div className="mb-16 slide-up text-center relative z-10">
        <Link href="/" className="text-sm text-muted hover:text-white font-medium mb-6 inline-block transition-colors">&larr; Вернуться</Link>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
          <span className="text-gradient">AI Ассистент</span>
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          Нейросети, встроенные прямо в образовательный процесс. Выберите нужный инструмент ниже.
        </p>
      </div>

      <div className="flex justify-center border-b border-subtle mb-10 overflow-x-auto slide-up delay-1 relative z-10">
        {[
          { id: 'chat', label: 'Умный чат' },
          { id: 'university', label: 'Подбор вуза' },
          { id: 'analyzer', label: 'Анализатор' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-8 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 relative ${
              activeTab === tab.id 
                ? 'text-white' 
                : 'text-muted hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--glow-accent) shadow-[0_0_10px_var(--glow-accent)]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="bento-card p-6 md:p-10 min-h-150 slide-up delay-2 relative z-10">
        {activeTab === 'chat' && <ChatComponent />}
        {activeTab === 'university' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-3 text-white">Подбор университета</h2>
            <p className="text-muted mb-10 text-base">Укажите свои баллы, и нейросеть найдет идеальные варианты с вероятностью поступления.</p>
            <div className="p-8 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] shadow-inner">
              <UniversityFinderForm />
            </div>
          </div>
        )}
        {activeTab === 'analyzer' && <ContentAnalyzerComponent />}
      </div>
    </div>
  );
}
