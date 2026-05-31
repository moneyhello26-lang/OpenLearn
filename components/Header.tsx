'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/search', label: 'Библиотека' },
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
              <Link href="/profile" className="text-sm font-medium text-white px-6 py-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, #A87FFB 0%, #8B5CF6 100%)' }}>
                Профиль
              </Link>
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
        </div>
      </div>
    </header>
  );
}
