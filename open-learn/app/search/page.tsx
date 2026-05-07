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
  if (item.hasFullText && item.readerUrl) {
    const readerHref = `/reader?src=${encodeURIComponent(item.readerUrl)}&title=${encodeURIComponent(item.title)}&back=${encodeURIComponent('/search')}`;
    return (
      <div className="flex flex-col gap-2 items-end">
        <Link href={readerHref}
          className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
          style={{ background: 'var(--teal)', color: 'white' }}>
          📖 Читать
        </Link>
        {item.pageUrl && item.pageUrl !== item.readerUrl && (
          <a href={item.pageUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs hover:underline" style={{ color: 'var(--teal)' }}>
            На сайте ↗
          </a>
        )}
      </div>
    );
  }
  return (
    <a href={item.url || item.pageUrl || '#'} target="_blank" rel="noopener noreferrer"
      className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap"
      style={{ background: 'var(--coral)', color: 'white' }}>
      Открыть ↗
    </a>
  );
}

function ResultCard({ item }: { item: SearchResult }) {
  const isKZ = item.category?.includes('Казахстан');
  return (
    <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)' }}
      className="rounded-2xl p-4 flex gap-4 hover:shadow-md hover:border-[var(--teal)] transition-all">
      {/* Cover */}
      <div className="w-14 h-20 rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: isKZ ? 'var(--teal-pale)' : 'var(--coral-light)' }}>
        {item.image
          ? <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-xl" />
          : <span className="text-2xl">{isKZ ? '📗' : item.type === 'book' ? '📚' : '🎓'}</span>
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text)' }}>{item.title}</h3>
          {item.grade && (
            <span className="px-2 py-0.5 text-xs rounded-full font-medium"
              style={{ background: 'var(--coral-light)', color: 'var(--coral-dark)' }}>
              {item.grade} класс
            </span>
          )}
          {item.hasFullText && (
            <span className="px-2 py-0.5 text-xs rounded-full font-medium"
              style={{ background: 'var(--teal-light)', color: 'var(--teal-dark)' }}>
              Читать онлайн
            </span>
          )}
        </div>
        {item.authors?.length > 0 && (
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{item.authors.join(', ')}</p>
        )}
        <p className="text-xs line-clamp-2" style={{ color: 'var(--text-muted)' }}>{item.description}</p>
        <p className="text-xs mt-1.5 font-medium" style={{ color: 'var(--gray-dark)' }}>
          {item.source}
        </p>
      </div>

      <div className="shrink-0 flex flex-col justify-between items-end gap-2">
        <span className="text-xs font-bold" style={{ color: 'var(--teal)' }}>{item.price}</span>
        <BookActionButton item={item} />
      </div>
    </div>
  );
}

const HINTS = ['физика', 'математика', 'информатика', 'python', 'биология'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | 'book' | 'course'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (q: string, t: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(q)}&type=${t}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch { setResults([]); }
    setLoading(false);
  };

  useEffect(() => {
    if (query.length > 2) {
      const id = setTimeout(() => searchBooks(query, type), 500);
      return () => clearTimeout(id);
    } else if (query.length === 0) setResults([]);
  }, [query, type]);

  const kzResults = results.filter(r => r.category === 'Казахстан. Школьная программа');
  const globalResults = results.filter(r => r.category !== 'Казахстан. Школьная программа');

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-8 space-y-7">

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'DM Serif Display, serif' }}>
          Поиск книг
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Казахстанские учебники (5–11 кл.) + мировые книги по программированию и науке
        </p>
      </div>

      {/* Search box */}
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)' }}
        className="rounded-2xl p-5 space-y-4">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" fill="none"
            stroke="var(--teal)" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 20 20">
            <circle cx="8.5" cy="8.5" r="5.5"/><path d="M18 18l-4-4"/>
          </svg>
          <input
            type="text"
            placeholder="Математика 9 класс, физика, python..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium outline-none"
            style={{
              background: 'var(--bg)',
              border: '1.5px solid var(--gray-mid)',
              color: 'var(--text)',
              fontSize: '14px',
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select value={type} onChange={e => setType(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-sm font-medium outline-none"
            style={{ background: 'var(--bg)', border: '1.5px solid var(--gray-mid)', color: 'var(--text)' }}>
            <option value="all">Все материалы</option>
            <option value="book">Только книги</option>
          </select>

          <button onClick={() => searchBooks(query, type)}
            style={{ background: 'var(--teal)', color: 'white' }}
            className="px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90">
            Искать
          </button>

          <div className="flex gap-2 flex-wrap ml-auto">
            {HINTS.map(h => (
              <button key={h} onClick={() => setQuery(h)}
                className="px-3 py-1.5 text-xs rounded-full font-medium hover:opacity-80 transition"
                style={{ background: 'var(--gray)', color: 'var(--text-muted)' }}>
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--teal-light)', borderTopColor: 'var(--teal)' }} />
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>Ищем...</p>
        </div>
      )}

      {/* No results */}
      {!loading && results.length === 0 && query.length > 2 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold" style={{ color: 'var(--text)' }}>Ничего не найдено</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Попробуйте другой запрос</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && query.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📚</p>
          <p className="font-semibold text-lg" style={{ color: 'var(--text)' }}>Начните поиск</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Введите название учебника или предмет</p>
        </div>
      )}

      {/* KZ Results */}
      {!loading && kzResults.length > 0 && (
        <div>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            🇰🇿 Казахстанские учебники
            <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>МОН РК · 5–11 класс</span>
          </h2>
          <div className="space-y-3">
            {kzResults.map(item => <ResultCard key={item.id} item={item} />)}
          </div>
        </div>
      )}

      {/* Global Results */}
      {!loading && globalResults.length > 0 && (
        <div>
          <h2 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            🌐 Книги и ресурсы
          </h2>
          <div className="space-y-3">
            {globalResults.map(item => <ResultCard key={item.id} item={item} />)}
          </div>
        </div>
      )}
    </div>
  );
}
