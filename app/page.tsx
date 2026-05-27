import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0A0C]">
      {/* Deep Space Background with Nodes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(168, 127, 251, 0.4) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 40%)`
        }}></div>
        <div className="constellation-bg absolute inset-0 opacity-30"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-48 pb-24 flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-80px)]">
        
        {/* Left Typography Section */}
        <div className="w-full lg:w-[55%] flex flex-col items-start z-20">
          
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md mb-8 slide-up">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span className="text-xs font-medium text-[#8A8F98]">OpenLearn AI 2.0 уже доступен</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] mb-6 slide-up delay-1">
            <span className="text-white block">Образование.</span>
            <span className="block mt-2" style={{
              background: 'linear-gradient(90deg, #A87FFB 0%, #D946EF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Новый стандарт.</span>
          </h1>

          <p className="text-lg sm:text-xl text-[#8A8F98] max-w-[500px] mb-12 slide-up delay-2 leading-relaxed">
            Бесплатные учебники, продвинутый ИИ-ассистент и персонализированные гайды по поступлению. Безграничный доступ к знаниям для каждого.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 slide-up delay-3 w-full sm:w-auto">
            <Link href="/search" className="w-full sm:w-auto text-center px-8 py-4 rounded-full text-white font-semibold text-base transition-all hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              style={{ background: 'linear-gradient(135deg, #A87FFB 0%, #8B5CF6 100%)' }}>
              Начать обучение
            </Link>
            <Link href="/ai-demo" className="w-full sm:w-auto text-center px-8 py-4 rounded-full font-semibold text-base transition-all hover:bg-[rgba(255,255,255,0.1)] text-[#8A8F98] hover:text-white border border-[rgba(255,255,255,0.1)]">
              Встретить ИИ
            </Link>
          </div>
        </div>

        {/* Right Illustration/Mockup Section */}
        <div className="w-full lg:w-[45%] mt-16 lg:mt-0 relative z-20 flex justify-center lg:justify-end perspective-1000 slide-up delay-2">
          
          {/* Code Editor Mockup */}
          <div className="relative w-full max-w-[480px] h-[320px] rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(20,20,25,0.8)] backdrop-blur-xl shadow-2xl overflow-hidden float-animation z-10" style={{ transform: 'rotateY(-12deg) rotateX(8deg)' }}>
            <div className="h-10 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.05)] flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
            </div>
            <div className="p-6 font-mono text-[13px] sm:text-sm leading-relaxed text-[#A87FFB]">
              <span className="text-[#8A8F98] italic">// OpenLearn API Usage</span><br/><br/>
              <span className="text-[#D946EF]">const</span> <span className="text-[#3B82F6]">student</span> <span className="text-white">=</span> <span className="text-[#D946EF]">await</span> <span className="text-[#10B981]">learn</span><span className="text-white">(</span>{'{'}
              <br />
              &nbsp;&nbsp;platform<span className="text-white">:</span> <span className="text-[#F59E0B]">"OpenLearn"</span><span className="text-white">,</span>
              <br />
              &nbsp;&nbsp;cost<span className="text-white">:</span> <span className="text-[#3B82F6]">0</span><span className="text-white">,</span>
              <br />
              &nbsp;&nbsp;potential<span className="text-white">:</span> <span className="text-[#F59E0B]">"∞"</span>
              <br />
              {'}'}<span className="text-white">)</span>
              <br />
              <br />
              <span className="text-[#D946EF]">await</span> <span className="text-[#10B981]">student</span><span className="text-white">.</span><span className="text-[#3B82F6]">findUniversity</span><span className="text-white">();</span>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="absolute -top-8 -right-4 sm:-right-8 z-20 bg-[rgba(20,20,25,0.9)] border border-[rgba(255,255,255,0.08)] backdrop-blur-lg p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 sm:gap-4 float-animation-delayed" style={{ transform: 'translateZ(50px)' }}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
              <span className="text-white text-xl font-black">🤖</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">OpenLearn AI</p>
              <p className="text-[#8A8F98] text-[10px] sm:text-xs">Персональный ментор</p>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-4 sm:-left-12 z-20 bg-[rgba(20,20,25,0.9)] border border-[rgba(255,255,255,0.08)] backdrop-blur-lg p-3 pr-6 rounded-full shadow-xl flex items-center gap-3 float-animation" style={{ transform: 'translateZ(30px)' }}>
            <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <span className="text-white font-bold">✓</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Поступил!</p>
              <p className="text-[#8A8F98] text-[10px] uppercase tracking-wider">Грант получен</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Bento Grid Section */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto border-t border-[rgba(255,255,255,0.05)]">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">Всё в одной экосистеме.</h2>
          <p className="text-xl text-[#8A8F98]">Разработано для максимальной фокусировки на знаниях.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Card 1: Large Library */}
          <div className="md:col-span-2 relative group rounded-3xl p-1 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)] hover:bg-[linear-gradient(135deg,rgba(168,127,251,0.2)_0%,rgba(255,255,255,0.02)_100%)] transition-colors duration-500 overflow-hidden slide-up">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(168,127,251,0.06), transparent 40%)' }} />
            <div className="h-full w-full rounded-[23px] bg-[#0A0A0C] border border-[rgba(255,255,255,0.05)] p-8 md:p-10 relative z-10 flex flex-col justify-end min-h-[340px]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.1)] to-transparent border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-3xl mb-8 shadow-xl">📚</div>
              <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">Безграничная библиотека</h3>
              <p className="text-[#8A8F98] text-lg max-w-lg">Тысячи школьных учебников, методичек и научных трудов. В формате PDF и для онлайн-чтения. Мгновенный поиск.</p>
            </div>
          </div>
          
          {/* Card 2: AI */}
          <div className="relative group rounded-3xl p-1 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)] hover:bg-[linear-gradient(135deg,rgba(236,72,153,0.2)_0%,rgba(255,255,255,0.02)_100%)] transition-colors duration-500 overflow-hidden slide-up delay-1">
            <div className="h-full w-full rounded-[23px] bg-[#0A0A0C] border border-[rgba(255,255,255,0.05)] p-8 relative z-10 flex flex-col justify-end min-h-[340px]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.1)] to-transparent border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-3xl mb-8 shadow-xl">🤖</div>
              <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">AI Ассистент</h3>
              <p className="text-[#8A8F98] text-base">Личный ментор 24/7. Поможет решить задачу, объяснит сложную тему или подберет университет.</p>
            </div>
          </div>
          
          {/* Card 3: Guides */}
          <div className="relative group rounded-3xl p-1 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)] hover:bg-[linear-gradient(135deg,rgba(59,130,246,0.2)_0%,rgba(255,255,255,0.02)_100%)] transition-colors duration-500 overflow-hidden slide-up delay-1">
            <div className="h-full w-full rounded-[23px] bg-[#0A0A0C] border border-[rgba(255,255,255,0.05)] p-8 relative z-10 flex flex-col justify-end min-h-[340px]">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.1)] to-transparent border border-[rgba(255,255,255,0.05)] flex items-center justify-center text-3xl mb-8 shadow-xl">🎓</div>
              <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Гайды и стипендии</h3>
              <p className="text-[#8A8F98] text-base">Инструкции по поступлению, грантам и получению стипендий.</p>
            </div>
          </div>
          
          {/* Card 4: Free */}
          <div className="md:col-span-2 relative group rounded-3xl p-1 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)] hover:bg-[linear-gradient(135deg,rgba(16,185,129,0.2)_0%,rgba(255,255,255,0.02)_100%)] transition-colors duration-500 overflow-hidden slide-up delay-2">
            <div className="h-full w-full rounded-[23px] bg-[#0A0A0C] border border-[rgba(255,255,255,0.05)] p-8 md:p-10 relative z-10 flex flex-col justify-center items-center text-center min-h-[340px]">
              <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(16,185,129,0.2), transparent 70%)' }}></div>
              <h3 className="text-7xl font-extrabold mb-4" style={{
                background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>0 Тенге.</h3>
              <p className="text-xl text-[#8A8F98] font-medium max-w-md mx-auto">Качественное образование должно быть свободным. Навсегда.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-[rgba(255,255,255,0.05)] text-center text-sm text-[#8A8F98]">
        <p>© 2026 OpenLearn. Создано с любовью для образования будущего.</p>
      </footer>
    </div>
  );
}
