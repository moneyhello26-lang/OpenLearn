'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

const NAV = [
  { href: '/search',    label: 'Учебники' },
  { href: '/favorites', label: '❤️ Избранное' },
  { href: '/about',     label: 'О проекте' },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    const onStorage = () => {
      const s = localStorage.getItem('user');
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('authChanged', onStorage);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('authChanged', onStorage); };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    window.dispatchEvent(new Event('authChanged'));
    router.push('/');
  };

  const initials = user?.name?.slice(0, 2).toUpperCase() || '';

  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1.5px solid var(--gray)' }}
      className="fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-2.5 group">
          <div style={{ background: 'var(--teal)' }}
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 14 L9 3 L16 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 10 L13 10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
            Open<span style={{ color: 'var(--teal)' }}>Learn</span>
            <span style={{ color: 'var(--coral)' }}>.kz</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(l => (
            <Link key={l.href} href={l.href}
              style={{
                color: pathname === l.href ? 'var(--teal)' : 'var(--text-muted)',
                background: pathname === l.href ? 'var(--teal-pale)' : 'transparent',
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--gray)] hover:text-[var(--text)]">
              {l.label}
            </Link>
          ))}
          {user && (
            <Link href="/profile"
              style={{
                color: pathname === '/profile' ? 'var(--teal)' : 'var(--text-muted)',
                background: pathname === '/profile' ? 'var(--teal-pale)' : 'transparent',
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--gray)] hover:text-[var(--text)]">
              Профиль
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/search"
            style={{ background: 'var(--teal)', color: 'white' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="8.5" cy="8.5" r="5.5"/><path d="M18 18l-4-4"/>
            </svg>
            Найти учебник
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'var(--teal-pale)', border: '1.5px solid var(--teal-light)',
                  borderRadius: '12px', padding: '6px 12px 6px 6px',
                  cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: 'var(--teal)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                }}>{initials}</div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                  {user.name.split(' ')[0]}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--surface)', border: '1.5px solid var(--gray)',
                  borderRadius: '14px', padding: '8px', minWidth: '180px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 50,
                }}>
                  <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid var(--gray)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                  <Link href="/profile" onClick={() => setShowUserMenu(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', color: 'var(--text)', textDecoration: 'none' }}
                    className="hover:bg-[var(--gray)]">
                    👤 Мой профиль
                  </Link>
                  <button onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                      padding: '8px 12px', borderRadius: '8px', fontSize: '13px',
                      color: 'var(--coral)', background: 'none', border: 'none',
                      cursor: 'pointer', fontFamily: 'Sora, sans-serif', textAlign: 'left',
                    }}
                    className="hover:bg-[var(--coral-light)]">
                    🚪 Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/auth"
                style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', border: '1.5px solid var(--gray)', textDecoration: 'none' }}
                className="hover:bg-[var(--gray)]">
                Войти
              </Link>
              <Link href="/auth"
                style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, background: 'var(--coral)', color: 'white', textDecoration: 'none' }}
                className="hover:opacity-90">
                Регистрация
              </Link>
            </div>
          )}

          <button onClick={onMenuClick}
            style={{ color: 'var(--text-muted)', border: '1.5px solid var(--gray)' }}
            className="p-2 rounded-lg hover:bg-[var(--gray)] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg hover:bg-[var(--gray)]" style={{ color: 'var(--text)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
