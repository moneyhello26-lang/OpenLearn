'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) router.push('/')
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Заполните все обязательные поля')
      setLoading(false)
      return
    }
    if (!isLogin && !formData.name.trim()) {
      setError('Введите ваше имя')
      setLoading(false)
      return
    }
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      setLoading(false)
      return
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      let data: any = {}
      try {
        data = await res.json()
      } catch {
        setError('Ошибка сервера. Попробуйте позже.')
        return
      }

      if (!res.ok) {
        setError(data.error || 'Что-то пошло не так')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('authChanged'))

      setSuccess(isLogin ? 'Вы вошли! Перенаправление...' : 'Аккаунт создан! Перенаправление...')
      setTimeout(() => router.push('/'), 800)
    } catch {
      setError('Ошибка сети. Проверьте подключение.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'var(--surface)',
        borderRadius: '24px',
        border: '1.5px solid var(--gray)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}>

        {/* Top accent */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, var(--teal), var(--teal-dark))' }} />

        <div style={{ padding: '36px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{ background: 'var(--teal)', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M2 14 L9 3 L16 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 10 L13 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: '20px', color: 'var(--text)' }}>
                Open<span style={{ color: 'var(--teal)' }}>Learn</span>
                <span style={{ color: 'var(--coral)' }}>.kz</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
              {isLogin ? 'Войдите в свой аккаунт' : 'Создайте бесплатный аккаунт'}
            </p>
          </div>

          {/* Toggle */}
          <div style={{ display: 'flex', background: 'var(--gray)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
            {[{ key: true, label: 'Войти' }, { key: false, label: 'Регистрация' }].map(({ key, label }) => (
              <button key={String(key)} onClick={() => { setIsLogin(key); setError(''); setSuccess('') }}
                style={{
                  flex: 1, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600, fontFamily: 'Sora, sans-serif',
                  transition: 'all 0.2s',
                  background: isLogin === key ? 'var(--surface)' : 'transparent',
                  color: isLogin === key ? 'var(--teal)' : 'var(--text-muted)',
                  boxShadow: isLogin === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{ fontSize: '14px', color: '#DC2626' }}>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>✅</span>
              <span style={{ fontSize: '14px', color: '#16A34A' }}>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Name (register only) */}
            {!isLogin && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                  Ваше имя
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>👤</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Иван Иванов"
                    required={!isLogin}
                    style={{
                      width: '100%', padding: '12px 14px 12px 40px',
                      border: '1.5px solid var(--gray-mid)',
                      borderRadius: '12px', fontSize: '15px',
                      fontFamily: 'Sora, sans-serif', color: 'var(--text)',
                      background: 'var(--bg)', outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--teal)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--gray-mid)')}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>📧</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ivan@example.com"
                  required
                  autoComplete="email"
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px',
                    border: '1.5px solid var(--gray-mid)',
                    borderRadius: '12px', fontSize: '15px',
                    fontFamily: 'Sora, sans-serif', color: 'var(--text)',
                    background: 'var(--bg)', outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--teal)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--gray-mid)')}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                Пароль
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Минимум 6 символов"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  style={{
                    width: '100%', padding: '12px 44px 12px 40px',
                    border: '1.5px solid var(--gray-mid)',
                    borderRadius: '12px', fontSize: '15px',
                    fontFamily: 'Sora, sans-serif', color: 'var(--text)',
                    background: 'var(--bg)', outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--teal)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--gray-mid)')}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', opacity: 0.6 }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {!isLogin && (
                <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: '3px', borderRadius: '2px',
                      background: formData.password.length >= i * 2
                        ? (formData.password.length >= 8 ? 'var(--teal)' : 'var(--coral)')
                        : 'var(--gray-mid)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '13px',
                background: loading ? 'var(--gray-mid)' : 'var(--teal)',
                color: 'white', border: 'none',
                borderRadius: '14px', fontSize: '15px',
                fontWeight: 700, fontFamily: 'Sora, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(61,174,183,0.35)',
              }}
              onMouseEnter={e => { if (!loading) (e.currentTarget.style.opacity = '0.9') }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  {isLogin ? 'Вход...' : 'Создание...'}
                </>
              ) : (
                isLogin ? '→ Войти' : '✓ Создать аккаунт'
              )}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray)' }} />
            <span style={{ fontSize: '12px', color: 'var(--gray-dark)' }}>или</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--gray)' }} />
          </div>

          {/* Switch */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }}
              style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'Sora, sans-serif' }}>
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
