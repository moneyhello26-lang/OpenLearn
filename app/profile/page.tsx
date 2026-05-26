'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="card p-10 max-w-md w-full text-center">
          <div className="text-4xl mb-6">🔒</div>
          <h2 className="text-2xl font-semibold tracking-tight mb-3">Доступ ограничен</h2>
          <p className="text-muted text-sm mb-8">
            Войдите в свой аккаунт, чтобы получить доступ к персональному профилю и настройкам.
          </p>
          <Link href="/auth" className="btn btn-primary w-full">
            Войти в аккаунт
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-4xl mx-auto slide-up">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 rounded-full bg-foreground text-background flex items-center justify-center text-2xl font-semibold tracking-tight shadow-sm">
          {initials}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ letterSpacing: '-0.03em' }}>{user.name}</h1>
          <p className="text-muted mt-1">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12 delay-1 slide-up">
        <div className="card p-6 border-t-2 border-t-foreground">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Прочитано</h3>
          <div className="text-3xl font-bold tracking-tight">12</div>
          <p className="text-xs text-muted mt-2">книг и материалов</p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">В процессе</h3>
          <div className="text-3xl font-bold tracking-tight">3</div>
          <p className="text-xs text-muted mt-2">активных курса</p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Избранное</h3>
          <div className="text-3xl font-bold tracking-tight">28</div>
          <p className="text-xs text-muted mt-2">сохраненных ссылок</p>
        </div>
      </div>

      <div className="card p-8 delay-2 slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Недавняя активность</h2>
          <Link href="/history" className="text-sm font-medium hover:text-muted transition-colors">Все &rarr;</Link>
        </div>
        
        <div className="space-y-4">
          {[
            { title: 'Основы алгоритмов', date: 'Сегодня', progress: 85 },
            { title: 'Подготовка к ЕНТ: Математика', date: 'Вчера', progress: 42 },
            { title: 'Гайд по поступлению в Назарбаев Университет', date: '3 дня назад', progress: 100 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-subtle rounded-md hover:border-[var(--accents-3)] transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-muted mt-1">{item.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-[var(--accents-2)] rounded-full overflow-hidden">
                  <div className="h-full bg-foreground" style={{ width: `${item.progress}%` }} />
                </div>
                <span className="text-xs font-medium w-8 text-right">{item.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="text-sm font-medium text-muted hover:text-foreground transition-colors"
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}
