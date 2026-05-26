'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Заполните все обязательные поля');
      setLoading(false);
      return;
    }
    if (!isLogin && !formData.name.trim()) {
      setError('Введите ваше имя');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        setError('Ошибка сервера. Попробуйте позже.');
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Что-то пошло не так');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('authChanged'));

      setSuccess(isLogin ? 'Вы вошли! Перенаправление...' : 'Аккаунт создан! Перенаправление...');
      setTimeout(() => router.push('/'), 800);
    } catch {
      setError('Ошибка сети. Проверьте подключение.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--accents-1)]">
      
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity">
            <div className="w-6 h-6 bg-black dark:bg-white rounded-sm flex items-center justify-center">
              <span className="text-white dark:text-black text-xs">▲</span>
            </div>
            OpenLearn
          </Link>
          <h1 className="text-xl font-semibold mt-6 tracking-tight">
            {isLogin ? 'Войдите в аккаунт' : 'Создать аккаунт'}
          </h1>
          <p className="text-sm text-muted mt-2">
            {isLogin ? 'С возвращением!' : 'Присоединяйтесь к платформе бесплатно'}
          </p>
        </div>

        <div className="card p-8 shadow-md">
          {error && (
            <div className="mb-6 p-3 text-sm text-[var(--error)] bg-[var(--error-light)]/10 border border-[var(--error-light)]/20 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 text-sm text-[var(--success)] bg-[var(--success-light)]/10 border border-[var(--success-light)]/20 rounded-md">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван Иванов"
                  required={!isLogin}
                  className="input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Минимум 6 символов"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="input pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground text-xs font-medium"
                >
                  {showPassword ? 'Скрыть' : 'Показать'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Продолжить'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-muted">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            className="font-medium text-foreground hover:underline"
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </div>
      </div>

    </div>
  );
}
