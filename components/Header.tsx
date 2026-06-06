'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    
    checkAuth();
    window.addEventListener('authChanged', checkAuth);
    return () => window.removeEventListener('authChanged', checkAuth);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const loadNotes = async () => {
        try {
          const res = await fetch('/api/notifications', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) setNotifications((await res.json()).data || []);
        } catch (e) {}
      };
      loadNotes();
      const int = setInterval(loadNotes, 30000);
      return () => clearInterval(int);
    }
  }, [isAuthenticated]);

  const markRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(notifications.map(n => ({...n, read: true})));
    } catch {}
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/search', label: 'Библиотека' },
    { href: '/courses', label: 'Курсы' },
    { href: '/ai-demo', label: 'AI Ассистент' },
    { href: '/about', label: 'О проекте' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[rgba(10,10,12,0.8)] backdrop-blur-md border-b border-[rgba(255,255,255,0.05)]' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {/* OpenLearn Logo Modernized */}
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-[#A87FFB] to-[#8B5CF6] shadow-[0_0_15px_rgba(139,92,246,0.4)]">
            <span className="text-white text-lg font-black tracking-tighter">OL</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white" style={{ fontFamily: 'Sora, sans-serif' }}>OpenLearn</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === link.href ? 'text-white' : 'text-[#8A8F98]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {mounted && (
            isAuthenticated ? (
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <button onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markRead(); }} className="text-[#8A8F98] hover:text-white transition-colors text-xl relative focus:outline-none">
                    🔔
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{unreadCount}</span>}
                  </button>
                  {showNotifications && (
                    <div className="absolute top-10 right-0 w-80 bg-[var(--surface)] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl p-4 max-h-96 overflow-y-auto z-50">
                      <h3 className="font-bold text-white mb-3">Уведомления</h3>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-[#8A8F98]">Нет новых уведомлений</p>
                      ) : (
                        <div className="space-y-3">
                          {notifications.map(n => (
                            <div key={n.id} className="text-sm border-b border-[rgba(255,255,255,0.05)] pb-2 last:border-0 last:pb-0">
                              <p className="text-white">{n.content}</p>
                              {n.type === 'friend_request' && n.friendship && n.friendship.status === 'pending' && (
                                <div className="mt-2 flex gap-2">
                                  <button onClick={() => {
                                    fetch(`/api/friends/${n.sourceId}`, { method: 'PUT', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(() => {
                                      setNotifications(notifications.map(no => no.id === n.id ? {...no, friendship: {...no.friendship, status: 'accepted'}} : no));
                                    });
                                  }} className="bg-teal-500 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-teal-600 transition-colors">Принять</button>
                                  <button onClick={() => {
                                    fetch(`/api/friends/${n.sourceId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(() => {
                                      setNotifications(notifications.map(no => no.id === n.id ? {...no, friendship: {...no.friendship, status: 'rejected'}} : no));
                                    });
                                  }} className="bg-[#302020] text-[#ff6b6b] px-3 py-1 rounded-lg text-xs font-semibold hover:opacity-80 transition-colors">Отклонить</button>
                                </div>
                              )}
                              {n.type === 'friend_request' && n.friendship && n.friendship.status === 'accepted' && (
                                <p className="text-xs text-teal-400 mt-1">Заявка принята ✓</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Link href="/profile" className="text-sm font-medium text-white px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all" style={{ background: 'linear-gradient(135deg, #A87FFB 0%, #8B5CF6 100%)' }}>
                  Профиль
                </Link>
              </div>
            ) : (
              <>
                <Link href="/auth" className="text-sm font-medium text-[#8A8F98] hover:text-white transition-colors">
                  Войти
                </Link>
                <Link href="/auth" className="hidden sm:flex text-sm font-medium text-white px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all transform hover:scale-105" style={{ background: 'linear-gradient(135deg, #A87FFB 0%, #8B5CF6 100%)' }}>
                  Начать бесплатно
                </Link>
              </>
            )
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#8A8F98] hover:text-white transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[rgba(10,10,12,0.95)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.05)] p-6 flex flex-col gap-4 shadow-2xl">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setShowMobileMenu(false)}
              className={`text-base font-medium py-2 transition-colors ${
                pathname === link.href ? 'text-white' : 'text-[#8A8F98]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && mounted && (
            <Link 
              href="/auth" 
              onClick={() => setShowMobileMenu(false)}
              className="mt-4 text-center text-sm font-medium text-white px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all" 
              style={{ background: 'linear-gradient(135deg, #A87FFB 0%, #8B5CF6 100%)' }}
            >
              Войти / Начать
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
