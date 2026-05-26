'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
