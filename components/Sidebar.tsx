'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', icon: '⌂', label: 'Главная' },
    { href: '/search', icon: '🔍', label: 'Поиск' },
    { href: '/courses', icon: '🎓', label: 'Курсы' },
    { href: '/favorites', icon: '♥', label: 'Избранное' },
    { href: '/ai-demo', icon: '⚡', label: 'AI Demo' },
    { href: '/profile', icon: '👤', label: 'Профиль' },
    { href: '/about', icon: 'ℹ', label: 'О проекте' },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-subtle bg-background hidden md:flex flex-col z-40">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-4 px-3 mt-4">Навигация</div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active 
                    ? 'bg-[var(--accents-2)] font-medium text-foreground' 
                    : 'text-muted hover:text-foreground hover:bg-[var(--accents-1)]'
                }`}
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-subtle">
        <Link href="/auth" className="btn btn-secondary w-full justify-start text-sm">
          Вход / Регистрация
        </Link>
      </div>
    </aside>
  );
}
