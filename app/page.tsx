export default function Home() {
  const stats = [
    { value: '240+', label: 'Учебников' },
    { value: '48',   label: 'Стипендий' },
    { value: 'KZ·RU', label: 'Языки' },
    { value: '0 ₸',  label: 'Стоимость' },
  ];

  const categories = [
    { icon: '📐', label: 'Математика',  count: 42 },
    { icon: '⚗️', label: 'Физика',      count: 28 },
    { icon: '💻', label: 'Информатика', count: 35 },
    { icon: '🧬', label: 'Биология',    count: 24 },
    { icon: '🌍', label: 'История',     count: 31 },
    { icon: '📖', label: 'Литература',  count: 19 },
  ];

  return (
    <div className="w-full">

      <section style={{ background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)' }}
        className="relative overflow-hidden px-5 py-20 text-white">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10"
          style={{ background: 'white' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-5"
          style={{ background: 'var(--coral)' }} />

        <div className="relative max-w-4xl mx-auto text-center fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            🌱 ЦУР 4 — Качественное образование
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5" style={{ fontFamily: 'DM Serif Display, serif' }}>
            Знания<br/>
            <span style={{ color: 'var(--coral-light)' }}>без барьеров</span>
          </h1>

          <p className="text-lg opacity-85 max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Бесплатные учебники, гайды по поступлению и стипендии для каждого казахстанца — без регистрации.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center fade-up fade-up-1">
            <a href="/search"
              style={{ background: 'var(--coral)', color: 'white' }}
              className="px-8 py-3.5 rounded-2xl font-semibold hover:opacity-90 shadow-lg text-sm">
              Найти учебник →
            </a>
            <a href="/about"
              className="px-8 py-3.5 rounded-2xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)', color: 'white' }}>
              О проекте
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 -mt-8 mb-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={s.label}
              style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', animationDelay: `${i * 0.08}s` }}
              className="rounded-2xl p-5 text-center shadow-sm fade-up">
              <p className="text-2xl font-bold" style={{ color: 'var(--teal)' }}>{s.value}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Предметы</h2>
          <a href="/search" className="text-sm font-medium" style={{ color: 'var(--teal)' }}>Все →</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map(cat => (
            <a key={cat.label} href={`/search?q=${cat.label}`}
              style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)' }}
              className="rounded-2xl p-4 text-center hover:border-[var(--teal)] hover:shadow-md group transition-all">
              <span className="text-2xl block mb-2">{cat.icon}</span>
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{cat.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--gray-dark)' }}>{cat.count} книг</p>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Популярные учебники</h2>
          <a href="/search" className="text-sm font-medium" style={{ color: 'var(--teal)' }}>Смотреть все →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { subject: 'Математика', grade: 10, title: 'Алгебра и начала анализа', emoji: '📐' },
            { subject: 'Физика',     grade: 11, title: 'Физика для 11 класса',     emoji: '⚗️' },
            { subject: 'Информатика',grade: 9,  title: 'Основы программирования',  emoji: '💻' },
          ].map(book => (
            <a key={book.title} href="/search"
              style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)' }}
              className="rounded-2xl overflow-hidden hover:shadow-md hover:border-[var(--teal)] transition-all group">
              <div className="h-36 flex items-center justify-center text-5xl"
                style={{ background: 'var(--teal-pale)' }}>
                {book.emoji}
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold" style={{ color: 'var(--teal)' }}>
                  {book.subject} · {book.grade} класс
                </span>
                <h3 className="text-sm font-semibold mt-1 group-hover:text-[var(--teal)] transition-colors"
                  style={{ color: 'var(--text)' }}>
                  {book.title}
                </h3>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ background: 'var(--teal-light)', color: 'var(--teal-dark)' }}>
                    Бесплатно
                  </span>
                  <span className="text-xs" style={{ color: 'var(--gray-dark)' }}>📖 Читать</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 mb-16">
        <div className="rounded-3xl p-10 text-center"
          style={{ background: 'linear-gradient(135deg, var(--coral-light) 0%, var(--teal-pale) 100%)', border: '1.5px solid var(--gray)' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--coral)' }}>🌱 ЦУР 4 — Качественное образование</p>
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
            Помогите расширить доступ к знаниям
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
            Вы учитель или студент? Загрузите свои материалы и помогите тысячам казахстанцев.
          </p>
          <a href="/about"
            style={{ background: 'var(--coral)', color: 'white' }}
            className="inline-block px-7 py-3 rounded-2xl font-semibold text-sm hover:opacity-90 shadow-md">
            Поделиться материалами
          </a>
        </div>
      </section>
    </div>
  );
}
