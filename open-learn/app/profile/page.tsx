export default function ProfilePage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-5">
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="rounded-lg p-8" style={{ background: 'var(--surface)' }}>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold" style={{ background: 'linear-gradient(135deg, var(--teal), var(--coral))' }}>
              U
            </div>
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Ваше имя</h1>
                <p style={{ color: 'var(--text-muted)' }}>user@example.com</p>
              </div>
              <div className="flex gap-4">
                <button className="px-4 py-2 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                 style={{ background: 'var(--blue)' }}>
                  Редактировать профиль
                </button>
                <button className="px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-80 transition-opacity" style={{ background: 'rgba(38,7,122,0.08)', color: 'var(--text)', border: '1.5px solid var(--border)' }}>
                Параметры
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg p-6 text-center" style={{ background: 'var(--surface)' }}>
            <div className="text-3xl font-bold" style={{ color: 'var(--teal)' }}>12</div>
            <div className="mt-2" style={{ color: 'var(--text-muted)' }}>Завершенных курсов</div>
          </div>
          <div className="rounded-lg p-6 text-center" style={{ background: 'var(--surface)' }}>
            <div className="text-3xl font-bold" style={{ color: 'var(--coral)' }}>5</div>
            <div className="mt-2" style={{ color: 'var(--text-muted)' }}>В процессе</div>
          </div>
          <div className="rounded-lg p-6 text-center" style={{ background: 'var(--surface)' }}>
            <div className="text-3xl font-bold" style={{ color: 'var(--teal-dark)' }}>4.6</div>
            <div className="mt-2" style={{ color: 'var(--text-muted)' }}>Средний рейтинг</div>
          </div>
        </div>

        {/* My Courses */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Мои курсы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg p-6 hover:shadow-lg transition-shadow" style={{ background: 'var(--surface)' }}>
                <div className="h-40 rounded-lg mb-4" style={{ background: 'linear-gradient(135deg, var(--teal), var(--coral))' }}></div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Курс #{i}</h3>
                <div className="mb-4">
                  <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Прогресс: 75%</div>
                  <div className="w-full rounded-full h-2" style={{ background: 'var(--gray)' }}>
                    <div className="h-2 rounded-full" style={{ width: '75%', background: 'var(--teal)' }}></div>
                  </div>
                </div>
                <a href="#" className="font-semibold text-sm" style={{ color: 'var(--teal)' }}>Продолжить →</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
