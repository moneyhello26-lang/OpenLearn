'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/',        label: 'Главная',      icon: '🏠' },
  { href: '/search',  label: 'Поиск книг',   icon: '🔍' },
  { href: '/profile', label: 'Профиль',      icon: '👤' },
  { href: '/about',   label: 'О платформе',  icon: 'ℹ️' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={onClose} />
      )}

      <aside
        style={{
          background: 'var(--surface)',
          borderLeft: '1.5px solid var(--gray)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
        className="fixed top-16 right-0 bottom-0 w-64 z-30 flex flex-col">

        <nav className="p-4 flex-1 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} onClick={onClose}
              style={{
                background: isActive(item.href) ? 'var(--teal-pale)' : 'transparent',
                color: isActive(item.href) ? 'var(--teal-dark)' : 'var(--text-muted)',
                borderLeft: isActive(item.href) ? '3px solid var(--teal)' : '3px solid transparent',
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-[var(--gray)]">
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mx-4 mb-4 p-3 rounded-xl" style={{ background: 'var(--teal-pale)', border: '1px solid var(--teal-light)' }}>
          <p className="text-xs font-semibold" style={{ color: 'var(--teal-dark)' }}>🌱 ЦУР 4</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Качественное образование для каждого</p>
        </div>

        <div className="p-4 border-t" style={{ borderColor: 'var(--gray)' }}>
          <button style={{ background: 'var(--coral-light)', color: 'var(--coral-dark)' }}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold hover:opacity-80">
            Выход
          </button>
        </div>
      </aside>
    </>
  );
}
