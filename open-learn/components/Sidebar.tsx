'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Главная', icon: '🏠' },
    { href: '/search', label: 'Поиск курсов', icon: '🔍' },
    { href: '/profile', label: 'Профиль', icon: '👤' },
    { href: '/about', label: 'О платформе', icon: 'ℹ️' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-16 right-0 bottom-0 w-64 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button className="w-full py-2 px-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium">
            Выход
          </button>
        </div>
      </aside>
    </>
  );
}
