'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-40">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
            OL
          </div>
          <span>OpenLearn</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
              U
            </div>
            <span className="text-sm font-medium hidden lg:inline">Профиль</span>
          </Link>

          <button
            onClick={onMenuClick}
            className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-0.5 bg-zinc-800 dark:bg-zinc-200 rounded"></div>
            <div className="w-6 h-0.5 bg-zinc-800 dark:bg-zinc-200 rounded"></div>
            <div className="w-6 h-0.5 bg-zinc-800 dark:bg-zinc-200 rounded"></div>
          </button>

          <button
            onClick={onMenuClick}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium">Меню</span>
          </button>
        </div>
      </div>
    </header>
  );
}
