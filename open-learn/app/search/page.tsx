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
  source: string;
  type: 'book' | 'course';
  category: string;
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
      const timeoutId = setTimeout(() => {
        searchBooks(query, type);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (query.length === 0) {
      setResults([]);
    }
  }, [query, type]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Поиск курсов и книг</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Найдите идеальный курс или книгу для обучения</p>
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 space-y-4">
          <input
            type="text"
            placeholder="Поиск по названию, автору или категории..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'all' | 'book' | 'course')}
              className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
            >
              <option value="all">Все материалы</option>
              <option value="course">Только курсы</option>
              <option value="book">Только книги</option>
            </select>

            <select className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50">
              <option>Все категории</option>
              <option>Программирование</option>
              <option>Дизайн</option>
              <option>Бизнес</option>
              <option>Наука</option>
              <option>IT и программирование</option>
              <option>Технические профессии</option>
            </select>

            <select className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50">
              <option>Сортировка</option>
              <option>По популярности</option>
              <option>По рейтингу</option>
              <option>Новые первыми</option>
            </select>

            <button
              onClick={() => searchBooks(query, type)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Искать
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">Поиск...</p>
            </div>
          )}

          {!loading && results.length === 0 && query.length > 2 && (
            <div className="text-center py-8">
              <p className="text-zinc-600 dark:text-zinc-400">Ничего не найдено по запросу "{query}"</p>
            </div>
          )}

          {!loading && results.map((item) => (
            <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-lg p-6 flex gap-4 hover:shadow-lg transition-shadow">
              <div className="w-48 h-32 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg shrink-0 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {item.type === 'book' ? '📚' : '🎓'}
                  </span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.type === 'book'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {item.type === 'book' ? 'Книга' : 'Курс'}
                  </span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Автор{item.authors.length > 1 ? 'ы' : ''}: {item.authors.join(', ') || 'Не указан'}
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-zinc-500">📚 {item.category}</span>
                  <span className="text-zinc-500">Источник: {item.source}</span>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <span className="text-2xl font-bold text-blue-600">{item.price}</span>
                <Link
                  href={`/details/${item.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
