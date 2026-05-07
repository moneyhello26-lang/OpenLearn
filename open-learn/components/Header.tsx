'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
}

const NAV = [
  { href: '/search',  label: 'Учебники' },
  { href: '/about',   label: 'О проекте' },
  { href: '/profile', label: 'Профиль' },
];

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header style={{ background: 'var(--surface)', borderBottom: '1.5px solid var(--gray)' }}
      className="fixed top-0 left-0 right-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
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

        {/* Desktop nav */}
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
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/search"
            style={{ background: 'var(--teal)', color: 'white' }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 shadow-sm">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="8.5" cy="8.5" r="5.5"/><path d="M18 18l-4-4"/>
            </svg>
            Найти учебник
          </Link>

          {/* Burger for desktop sidebar */}
          <button onClick={onMenuClick}
            style={{ color: 'var(--text-muted)', border: '1.5px solid var(--gray)' }}
            className="p-2 rounded-lg hover:bg-[var(--gray)] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Mobile burger */}
        <button onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-[var(--gray)]"
          style={{ color: 'var(--text)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
