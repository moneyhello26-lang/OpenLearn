'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

function ReaderContent() {
  const params = useSearchParams();
  const src = params.get('src') || '';
  const title = params.get('title') || 'Читать книгу';
  const back = params.get('back') || '/search';

  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-zinc-600 dark:text-zinc-400">
        <p className="text-lg mb-4">Источник не указан</p>
        <Link href={back} className="text-blue-500 hover:underline">← Назад</Link>
      </div>
    );
  }

  const isArchive = src.includes('archive.org');
  const isPdf = src.toLowerCase().includes('.pdf') || src.includes('emektep.kz/qr');
  const isHtml = src.startsWith('http') && !isPdf && !isArchive;

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 shrink-0">
        <Link
          href={back}
          className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          ← Назад
        </Link>
        <h1 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 truncate flex-1">
          {decodeURIComponent(title)}
        </h1>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-blue-500 whitespace-nowrap"
        >
          Открыть в новой вкладке ↗
        </a>
      </div>

      <div className="flex-1 bg-zinc-100 dark:bg-zinc-950">
        {(isPdf || isArchive) ? (
          <iframe
            src={src}
            className="w-full h-full border-0"
            title={decodeURIComponent(title)}
            allow="fullscreen"
          />
        ) : isHtml ? (
          <iframe
            src={src}
            className="w-full h-full border-0"
            title={decodeURIComponent(title)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-600 dark:text-zinc-400">
            <p>Не удалось отобразить содержимое.</p>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Открыть на сайте источника
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen text-zinc-500">
        Загрузка...
      </div>
    }>
      <ReaderContent />
    </Suspense>
  );
}