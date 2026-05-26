import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-blob mesh-blob-1"></div>
        <div className="mesh-blob mesh-blob-2"></div>
        <div className="mesh-blob mesh-blob-3"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-24 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md mb-8 slide-up">
          <span className="w-2 h-2 rounded-full bg-[var(--glow-accent)] animate-pulse"></span>
          <span className="text-sm font-medium text-white opacity-80">OpenLearn AI 2.0 уже доступен</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 slide-up delay-1 max-w-4xl" style={{ lineHeight: '1.1' }}>
          Образование.<br />
          <span className="text-gradient-color">Новый стандарт.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-12 slide-up delay-2 leading-relaxed">
          Бесплатные учебники, продвинутый ИИ-ассистент и персонализированные гайды по поступлению. Без ограничений.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-5 slide-up delay-3">
          <Link href="/search" className="btn-glow text-lg px-8 py-4">
            Начать обучение
          </Link>
          <Link href="/ai-demo" className="btn-secondary text-lg px-8 py-4">
            Встретить ИИ
          </Link>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="relative z-10 py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Всё в одной экосистеме.</h2>
          <p className="text-xl text-muted">Разработано для максимальной фокусировки на знаниях.</p>
        </div>
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 max-w-5xl mx-auto slide-up delay-1">
          
          {/* Card 1: Large Library (spans 2 cols) */}
          <div className="bento-card md:col-span-2 p-8 flex flex-col justify-end min-h-[320px] relative group">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at top right, var(--glow-accent), transparent 60%)' }}></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl glass-floating flex items-center justify-center text-2xl mb-6 shadow-lg border border-[rgba(255,255,255,0.1)]">📚</div>
              <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Безграничная библиотека</h3>
              <p className="text-muted text-lg max-w-md">Тысячи школьных учебников, методичек и научных трудов. В формате PDF и для онлайн-чтения. Мгновенный поиск.</p>
            </div>
          </div>
          
          {/* Card 2: AI */}
          <div className="bento-card p-8 flex flex-col justify-end min-h-[320px] relative group">
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at bottom right, var(--glow-tertiary), transparent 60%)' }}></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl glass-floating flex items-center justify-center text-2xl mb-6 shadow-lg">🤖</div>
              <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">AI Ассистент</h3>
              <p className="text-muted text-base">Личный ментор 24/7. Поможет решить задачу, объяснит сложную тему или подберет университет.</p>
            </div>
          </div>
          
          {/* Card 3: Guides */}
          <div className="bento-card p-8 flex flex-col justify-end min-h-[320px] relative group">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at top left, var(--glow-secondary), transparent 60%)' }}></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl glass-floating flex items-center justify-center text-2xl mb-6 shadow-lg">🎓</div>
              <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Гайды и стипендии</h3>
              <p className="text-muted text-base">Инструкции по поступлению, грантам и получению стипендий.</p>
            </div>
          </div>
          
          {/* Card 4: Free (spans 2 cols) */}
          <div className="bento-card md:col-span-2 p-8 flex flex-col justify-center items-center text-center min-h-[320px] relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(45deg, rgba(0,0,0,0), rgba(255,255,255,0.03), rgba(0,0,0,0))' }}></div>
            <div className="relative z-10">
              <h3 className="text-6xl font-extrabold mb-4 text-gradient">0 Тенге.</h3>
              <p className="text-xl text-muted font-medium max-w-sm mx-auto">Качественное образование должно быть свободным. Навсегда.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-[rgba(255,255,255,0.05)] text-center text-sm text-muted">
        <p>© 2026 OpenLearn. Создано с любовью для образования будущего.</p>
      </footer>
    </div>
  );
}
