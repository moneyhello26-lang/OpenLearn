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
    <header className={`fixed top-6 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-0 pointer-events-none`}>
      <div className={`max-w-4xl mx-auto flex items-center justify-between pointer-events-auto transition-all duration-500 rounded-2xl px-6 py-4 ${
        scrolled ? 'glass-floating' : 'bg-transparent'
      }`}>
        <Link href="/" className="font-bold tracking-tight text-xl flex items-center gap-2 hover:opacity-80 transition-opacity text-white">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <span className="text-black text-xs font-black">▲</span>
          </div>
          OpenLearn
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`transition-all duration-200 hover:text-white ${
                pathname === link.href ? 'text-white' : 'text-[var(--accents-7)]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {mounted && (
            isAuthenticated ? (
              <Link href="/profile" className="hidden sm:flex text-sm font-semibold px-5 py-2.5 bg-white text-black rounded-full hover:scale-105 transition-transform">
                Профиль
              </Link>
            ) : (
              <>
                <Link href="/auth" className="text-sm font-medium text-[var(--accents-7)] hover:text-white transition-colors">
                  Войти
                </Link>
                <Link href="/auth" className="hidden sm:flex text-sm font-semibold px-5 py-2.5 bg-white text-black rounded-full hover:scale-105 transition-transform">
                  Регистрация
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
