'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  onSuccess?: () => void
  defaultMode?: 'login' | 'register'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1.5px solid var(--gray-mid)',
  borderRadius: '10px',
  fontSize: '14px',
  fontFamily: 'Sora, sans-serif',
  color: 'var(--text)',
  background: 'var(--bg)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

export function AuthForm({ onSuccess, defaultMode = 'login' }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(defaultMode === 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

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
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Что-то пошло не так')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('authChanged'))
      setSuccess(isLogin ? 'Вход выполнен!' : 'Аккаунт создан!')

      if (onSuccess) {
        setTimeout(onSuccess, 600)
      } else {
        setTimeout(() => router.push('/'), 600)
      }
    } catch {
      setError('Ошибка сети. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--surface)', borderRadius: '20px', border: '1.5px solid var(--gray)', padding: '32px', maxWidth: '420px', width: '100%' }}>
      <div style={{ display: 'flex', background: 'var(--gray)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
        {[{ key: true, label: 'Войти' }, { key: false, label: 'Регистрация' }].map(({ key, label }) => (
          <button key={String(key)} onClick={() => { setIsLogin(key); setError(''); setSuccess('') }}
            style={{
              flex: 1, padding: '9px', borderRadius: '9px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, fontFamily: 'Sora, sans-serif', transition: 'all 0.2s',
              background: isLogin === key ? 'var(--surface)' : 'transparent',
              color: isLogin === key ? 'var(--teal)' : 'var(--text-muted)',
              boxShadow: isLogin === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>{label}</button>
        ))}
      </div>

      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#DC2626' }}>⚠️ {error}</div>}
      {success && <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#16A34A' }}>✅ {success}</div>}

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px', color: 'var(--text)' }}>Имя</label>
            <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ваше имя" required={!isLogin} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--teal)')} onBlur={e => (e.target.style.borderColor = 'var(--gray-mid)')} />
          </div>
        )}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px', color: 'var(--text)' }}>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder="email@example.com" required autoComplete="email" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--teal)')} onBlur={e => (e.target.style.borderColor = 'var(--gray-mid)')} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '5px', color: 'var(--text)' }}>Пароль</label>
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? 'text' : 'password'} value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Минимум 6 символов" required autoComplete={isLogin ? 'current-password' : 'new-password'}
              style={{ ...inputStyle, paddingRight: '42px' }}
              onFocus={e => (e.target.style.borderColor = 'var(--teal)')} onBlur={e => (e.target.style.borderColor = 'var(--gray-mid)')} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', opacity: 0.5 }}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          style={{
            width: '100%', padding: '12px',
            background: loading ? 'var(--gray-mid)' : 'var(--teal)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '14px', fontWeight: 700, fontFamily: 'Sora, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 3px 12px rgba(61,174,183,0.3)',
            transition: 'all 0.2s',
          }}>
          {loading ? 'Загрузка...' : isLogin ? 'Войти →' : 'Создать аккаунт ✓'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px' }}>
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
        <button onClick={() => { setIsLogin(!isLogin); setError('') }}
          style={{ background: 'none', border: 'none', color: 'var(--teal)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Sora, sans-serif', fontSize: '13px' }}>
          {isLogin ? 'Зарегистрируйтесь' : 'Войдите'}
        </button>
      </p>
    </div>
  )
}
