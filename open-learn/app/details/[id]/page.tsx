'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface BookEdition {
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
  hasFullText?: boolean;
  grade?: number;
  subject?: string;
  language?: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  rating: number;
  date: string;
}

// Парсим ID чтобы понять источник и оригинальный ключ
function parseBookId(id: string): { source: string; key: string } {
  if (id.startsWith('google-')) return { source: 'google', key: id.replace('google-', '') };
  if (id.startsWith('itbook-')) return { source: 'itbook', key: id.replace('itbook-', '') };
  if (id.startsWith('gutenberg-')) return { source: 'gutenberg', key: id.replace('gutenberg-', '') };
  if (id.startsWith('openlibrary-')) return { source: 'openlibrary', key: id.replace('openlibrary-', '') };
  if (id.startsWith('kz-')) return { source: 'kazakhstan', key: id };
  return { source: 'unknown', key: id };
}

export default function DetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [mainBook, setMainBook] = useState<BookEdition | null>(null);
  const [editions, setEditions] = useState<BookEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [searchingEditions, setSearchingEditions] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      const { source, key } = parseBookId(id);

      try {
        let book: BookEdition | null = null;

        if (source === 'kazakhstan') {
          // Казахстанские учебники — берём из нашего API
          const res = await fetch(`/api/books/kazakhstan?q=`);
          const data = await res.json();
          const found = (data.books || []).find((b: any) => b.id === id);
          if (found) {
            book = {
              ...found,
              hasFullText: found.hasPdf ?? false,
              readerUrl: found.hasPdf ? found.pdfUrl : null,
              url: found.hasPdf ? found.pdfUrl : found.pageUrl,
            };
          }
        } else if (source === 'google') {
          // Google Books по volume ID
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${key}`);
          const item = await res.json();
          if (item.volumeInfo) {
            const info = item.volumeInfo;
            const access = item.accessInfo;
            const hasFullText = access?.viewability === 'ALL_PAGES' || access?.epub?.isAvailable || access?.pdf?.isAvailable;
            const readUrl = info.canonicalVolumeLink || info.previewLink;
            book = {
              id,
              title: info.title,
              authors: info.authors || [],
              description: info.description || '',
              image: (info.imageLinks?.thumbnail || '').replace('http:', 'https:'),
              price: 'Бесплатно',
              url: readUrl,
              pageUrl: info.infoLink,
              source: 'Google Books',
              hasFullText,
              readerUrl: hasFullText ? readUrl : null,
            };
          }
        } else if (source === 'itbook') {
          // IT Book Store по ISBN
          const res = await fetch(`https://api.itbook.store/1.0/books/${key}`);
          const item = await res.json();
          if (item.title) {
            book = {
              id,
              title: item.title,
              authors: item.authors ? item.authors.split(', ') : [],
              description: item.desc || item.subtitle || '',
              image: item.image || '',
              price: item.price === '$0.00' ? 'Бесплатно' : item.price,
              url: item.url,
              pageUrl: item.url,
              source: 'IT Book Store',
              hasFullText: false,
              readerUrl: null,
            };
          }
        } else if (source === 'gutenberg') {
          // Gutenberg по числовому ID
          const res = await fetch(`https://gutendex.com/books/${key}`);
          const item = await res.json();
          if (item.title) {
            const htmlUrl = item.formats?.['text/html'];
            book = {
              id,
              title: item.title,
              authors: item.authors?.map((a: any) => a.name) || [],
              description: item.summaries?.[0] || item.subjects?.slice(0, 5).join(', ') || '',
              image: item.formats?.['image/jpeg'] || '',
              price: 'Бесплатно',
              url: htmlUrl || `https://www.gutenberg.org/ebooks/${key}`,
              pageUrl: `https://www.gutenberg.org/ebooks/${key}`,
              source: 'Project Gutenberg',
              hasFullText: !!htmlUrl,
              readerUrl: htmlUrl || null,
            };
          }
        } else if (source === 'openlibrary') {
          // Open Library по works key
          const res = await fetch(`https://openlibrary.org/works/${key}.json`);
          const item = await res.json();
          if (item.title) {
            const desc = typeof item.description === 'string'
              ? item.description
              : item.description?.value || '';
            book = {
              id,
              title: item.title,
              authors: [],
              description: desc,
              image: item.covers?.[0]
                ? `https://covers.openlibrary.org/b/id/${item.covers[0]}-L.jpg`
                : '',
              price: 'Бесплатно',
              url: `https://openlibrary.org/works/${key}`,
              pageUrl: `https://openlibrary.org/works/${key}`,
              source: 'Open Library',
              hasFullText: false,
              readerUrl: null,
            };
          }
        }

        setMainBook(book);

        // Теперь ищем все издания/варианты этой книги
        if (book) {
          setSearchingEditions(true);
          await fetchAllEditions(book);
          setSearchingEditions(false);
        }
      } catch (err) {
        console.error('Error fetching book:', err);
      }

      setLoading(false);
    };

    fetchBook();
  }, [id]);

  const fetchAllEditions = async (book: BookEdition) => {
    const titleQuery = book.title
      .replace(/\.\s*\d+\s*класс.*/i, '')  // убираем "9 класс" из запроса
      .replace(/\(.*?\)/g, '')
      .trim();

    const results: BookEdition[] = [];

    try {
      // 1. Open Library editions
      const olRes = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(titleQuery)}&fields=key,title,author_name,cover_i,ia,public_scan_b,lending_identifier_s,edition_count&limit=8`
      );
      const olData = await olRes.json();
      for (const item of (olData.docs || []).slice(0, 6)) {
        const iaId = item.ia?.[0] || item.lending_identifier_s;
        const hasFullText = !!(iaId || item.public_scan_b);
        results.push({
          id: `ol-ed-${item.key?.replace('/works/', '')}`,
          title: item.title,
          authors: item.author_name || [],
          description: item.edition_count ? `${item.edition_count} изданий` : '',
          image: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : '',
          price: 'Бесплатно',
          url: hasFullText && iaId ? `https://archive.org/embed/${iaId}` : `https://openlibrary.org${item.key}`,
          pageUrl: `https://openlibrary.org${item.key}`,
          source: 'Open Library',
          hasFullText,
          readerUrl: hasFullText && iaId ? `https://archive.org/embed/${iaId}` : null,
        });
      }
    } catch {}

    try {
      // 2. Google Books editions
      const gRes = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(titleQuery)}&maxResults=8&printType=books`
      );
      const gData = await gRes.json();
      for (const item of (gData.items || []).slice(0, 5)) {
        const info = item.volumeInfo;
        const access = item.accessInfo;
        const hasFullText = access?.viewability === 'ALL_PAGES' || access?.epub?.isAvailable;
        results.push({
          id: `g-ed-${item.id}`,
          title: info.title,
          authors: info.authors || [],
          description: info.publishedDate ? `Год: ${info.publishedDate.slice(0, 4)}` : '',
          image: (info.imageLinks?.thumbnail || '').replace('http:', 'https:'),
          price: item.saleInfo?.saleability === 'FREE' || item.saleInfo?.listPrice === undefined ? 'Бесплатно' : (item.saleInfo?.listPrice?.amount ? `$${item.saleInfo.listPrice.amount}` : 'Платно'),
          url: info.canonicalVolumeLink || info.previewLink,
          pageUrl: info.infoLink,
          source: 'Google Books',
          hasFullText,
          readerUrl: hasFullText ? (info.canonicalVolumeLink || info.previewLink) : null,
        });
      }
    } catch {}

    // Убираем дубли с основной книгой
    const unique = results.filter(r =>
      r.title?.toLowerCase() !== book.title?.toLowerCase() ||
      r.source !== book.source
    );

    setEditions(unique);
  };

  const averageRating = comments.length > 0
    ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length
    : 0;

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([{
        id: Date.now().toString(),
        user: 'Пользователь',
        text: newComment,
        rating,
        date: new Date().toISOString().split('T')[0],
      }, ...comments]);
      setNewComment('');
      setRating(5);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-500">Загружаем книгу...</p>
        </div>
      </div>
    );
  }

  if (!mainBook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">📚</p>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Книга не найдена</h1>
          <p className="text-zinc-500 mb-4">Возможно, она была удалена из источника</p>
          <Link href="/search" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            ← Вернуться к поиску
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* Back */}
        <Link href="/search" className="text-blue-500 hover:text-blue-700 text-sm">
          ← Назад к поиску
        </Link>

        {/* Main card */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-6">
            <div className="flex gap-6 flex-wrap sm:flex-nowrap">
              {/* Cover */}
              <div className="w-36 h-48 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                {mainBook.image ? (
                  <img src={mainBook.image} alt={mainBook.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-white text-4xl">📚</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-start gap-2">
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{mainBook.title}</h1>
                  {mainBook.grade && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full shrink-0">
                      {mainBook.grade} класс
                    </span>
                  )}
                  {mainBook.hasFullText && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full shrink-0">
                      Читать онлайн
                    </span>
                  )}
                </div>

                {mainBook.authors.length > 0 && (
                  <p className="text-zinc-500">Авторы: {mainBook.authors.join(', ')}</p>
                )}

                <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                  <span>📦 {mainBook.source}</span>
                  {mainBook.subject && <span>📗 {mainBook.subject}</span>}
                  {averageRating > 0 && (
                    <span className="text-yellow-500">⭐ {averageRating.toFixed(1)} ({comments.length})</span>
                  )}
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-4">
                  {mainBook.description || 'Описание отсутствует.'}
                </p>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="text-2xl font-bold text-blue-600">{mainBook.price}</span>

                  {mainBook.hasFullText && mainBook.readerUrl ? (
                    <Link
                      href={`/reader?src=${encodeURIComponent(mainBook.readerUrl)}&title=${encodeURIComponent(mainBook.title)}&back=${encodeURIComponent('/details/' + id)}`}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      📖 Читать
                    </Link>
                  ) : null}

                  <a
                    href={mainBook.pageUrl || mainBook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Открыть на сайте ↗
                  </a>

                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isFavorite
                        ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All editions / variants */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            📚 Все доступные варианты и издания
            {searchingEditions && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent ml-2" />
            )}
          </h2>

          {!searchingEditions && editions.length === 0 && (
            <p className="text-zinc-400 text-sm">Других изданий не найдено.</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {editions.map((ed) => (
              <div
                key={ed.id}
                className="flex gap-3 p-3 border border-zinc-100 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                {/* Mini cover */}
                <div className="w-10 h-14 bg-linear-to-br from-blue-300 to-purple-400 rounded shrink-0 flex items-center justify-center overflow-hidden">
                  {ed.image
                    ? <img src={ed.image} alt={ed.title} className="w-full h-full object-cover rounded" />
                    : <span className="text-white text-lg">📘</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2">{ed.title}</p>
                  <p className="text-xs text-zinc-400 mb-1">{ed.source} · {ed.price}</p>
                  {ed.description && (
                    <p className="text-xs text-zinc-400 line-clamp-1">{ed.description}</p>
                  )}
                  <div className="flex gap-2 mt-1">
                    {ed.hasFullText && ed.readerUrl ? (
                      <Link
                        href={`/reader?src=${encodeURIComponent(ed.readerUrl)}&title=${encodeURIComponent(ed.title)}&back=${encodeURIComponent('/details/' + id)}`}
                        className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded hover:bg-green-200 transition-colors"
                      >
                        📖 Читать
                      </Link>
                    ) : (
                      <a
                        href={ed.pageUrl || ed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded hover:bg-blue-200 transition-colors"
                      >
                        Открыть ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">Отзывы</h2>

          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 mb-4 space-y-3">
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 text-sm"
            >
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{'⭐'.repeat(n)} {n} звезд{n === 1 ? 'а' : n < 5 ? 'ы' : ''}</option>
              ))}
            </select>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишите отзыв..."
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 resize-none text-sm"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Опубликовать
            </button>
          </div>

          {comments.length === 0 ? (
            <p className="text-zinc-400 text-sm text-center py-4">Пока нет отзывов. Будьте первым!</p>
          ) : (
            <div className="space-y-3">
              {comments.map(comment => (
                <div key={comment.id} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">{comment.user}</span>
                    <span className="text-xs text-zinc-400">{comment.date}</span>
                  </div>
                  <p className="text-yellow-500 text-sm mb-1">{'⭐'.repeat(comment.rating)}</p>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}