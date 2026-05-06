'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  price: string;
  url: string;
  pageUrl?: string;
  readerUrl?: string | null;
  source: string;
  type: 'book' | 'course';
  category: string;
  hasFullText?: boolean;
  grade?: number;
  subject?: string;
}

function BookActionButton({ item }: { item: SearchResult }) {
  // Если есть readerUrl — открываем встроенный ридер
  if (item.hasFullText && item.readerUrl) {
    const readerHref = `/reader?src=${encodeURIComponent(item.readerUrl)}&title=${encodeURIComponent(item.title)}&back=${encodeURIComponent('/search')}`;
    return (
      <div className="flex flex-col gap-2 items-end">
        <Link
          href={readerHref}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
        >
          📖 Читать
        </Link>
        {item.pageUrl && item.pageUrl !== item.readerUrl && (
          <a
            href={item.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-400 hover:text-blue-500"
          >
            На сайте ↗
          </a>
        )}
      </div>
    );
  }

  // Иначе — переход на внешнюю страницу
  return (
    <a
      href={item.url || item.pageUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
    >
      Открыть ↗
    </a>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'book' | 'course'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (searchQuery: string, searchType: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(() => { searchBooks(query, type); }, 500);
      return () => clearTimeout(timeoutId);
    } else if (query.length === 0) {
      setResults([]);
    }
  }, [query, type]);

  const kzResults = results.filter(r => r.category === 'Казахстан. Школьная программа');
  const globalResults = results.filter(r => r.category !== 'Казахстан. Школьная программа');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Поиск курсов и книг</h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Казахстанские учебники (5–11 кл.) + мировые книги по программированию и науке
          </p>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 space-y-4">
          <input
            type="text"
            placeholder="Например: математика 9 класс, физика, python, алгоритмы..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'all' | 'book' | 'course')}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
            >
              <option value="all">Все материалы</option>
              <option value="book">Только книги</option>
            </select>
            <button
              onClick={() => searchBooks(query, type)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Искать
            </button>
            <div className="flex gap-2 ml-auto flex-wrap">
              {['физика', 'математика', 'информатика', 'python', 'алгоритмы'].map(hint => (
                <button
                  key={hint}
                  onClick={() => setQuery(hint)}
                  className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Поиск...</p>
          </div>
        )}

        {/* No results */}
        {!loading && results.length === 0 && query.length > 2 && (
          <div className="text-center py-8">
            <p className="text-zinc-600 dark:text-zinc-400">Ничего не найдено по запросу «{query}»</p>
          </div>
        )}

        {/* KZ Textbooks section */}
        {!loading && kzResults.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-2">
              🇰🇿 Казахстанские учебники
              <span className="text-sm font-normal text-zinc-500">(МОН РК, 5–11 класс)</span>
            </h2>
            <div className="space-y-3">
              {kzResults.map(item => <ResultCard key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {/* Global books section */}
        {!loading && globalResults.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-2">
              🌐 Книги и ресурсы
            </h2>
            <div className="space-y-3">
              {globalResults.map(item => <ResultCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ item }: { item: SearchResult }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-5 flex gap-4 hover:shadow-md transition-shadow border border-zinc-100 dark:border-zinc-800">
      <div className="w-16 h-20 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-white text-2xl">{item.category?.includes('Казахстан') ? '📗' : item.type === 'book' ? '📚' : '🎓'}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 truncate">{item.title}</h3>
          {item.grade && (
            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full shrink-0">
              {item.grade} класс
            </span>
          )}
          {item.hasFullText && (
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full shrink-0">
              Читать онлайн
            </span>
          )}
        </div>
        {item.authors?.length > 0 && (
          <p className="text-xs text-zinc-500 mb-1">{item.authors.join(', ')}</p>
        )}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.description}</p>
        <p className="text-xs text-zinc-400 mt-1">Источник: {item.source}</p>
      </div>
      <div className="shrink-0 flex flex-col justify-between items-end">
        <span className="text-sm font-bold text-blue-600">{item.price}</span>
        <BookActionButton item={item} />
      </div>
    </div>
  );
}