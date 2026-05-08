'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

interface CommentUser {
  id: string;
  name: string;
  avatar?: string;
}

interface CommentItem {
  id: string;
  userId: string;
  user: CommentUser;
  content: string;
  createdAt: string;
  replies?: CommentItem[];
}

function parseBookId(id: string): { source: string; key: string } {
  if (id.startsWith('google-')) return { source: 'google', key: id.replace('google-', '') };
  if (id.startsWith('itbook-')) return { source: 'itbook', key: id.replace('itbook-', '') };
  if (id.startsWith('gutenberg-')) return { source: 'gutenberg', key: id.replace('gutenberg-', '') };
  if (id.startsWith('openlibrary-')) return { source: 'openlibrary', key: id.replace('openlibrary-', '') };
  if (id.startsWith('kz-')) return { source: 'kazakhstan', key: id };
  return { source: 'unknown', key: id };
}

function StarRating({ value, onChange, readonly }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: '22px', cursor: readonly ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#f59e0b' : '#d1d5db',
            background: 'none', border: 'none', padding: '0 2px', transition: 'color 0.1s',
          }}
        >★</button>
      ))}
    </div>
  );
}

function CommentBlock({ comment, currentUser, onReply }: {
  comment: CommentItem;
  currentUser: { userId: string; name: string } | null;
  onReply: (parentId: string, content: string) => Promise<void>;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const initials = comment.user.name.slice(0, 2).toUpperCase();
  const date = new Date(comment.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    setSubmitting(true);
    await onReply(comment.id, replyText.trim());
    setReplyText('');
    setShowReply(false);
    setSubmitting(false);
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '14px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--teal), var(--coral))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '13px', flexShrink: 0,
          }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{comment.user.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{date}</div>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '8px' }}>{comment.content}</p>
        {currentUser && (
          <button
            onClick={() => setShowReply(!showReply)}
            style={{ fontSize: '12px', color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
          >
            {showReply ? '✕ Отмена' : '↩ Ответить'}
          </button>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {comment.replies.map(reply => {
            const rInit = reply.user.name.slice(0, 2).toUpperCase();
            const rDate = new Date(reply.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            return (
              <div key={reply.id} style={{ background: 'var(--teal-pale)', border: '1.5px solid var(--teal-light)', borderRadius: '12px', padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '11px' }}>{rInit}</div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{reply.user.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{rDate}</div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{reply.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {showReply && (
        <div style={{ marginLeft: '24px', marginTop: '8px' }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Ваш ответ..."
            rows={2}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--teal-light)', fontSize: '13px', fontFamily: 'Sora, sans-serif', resize: 'none', background: 'var(--surface)', color: 'var(--text)' }}
          />
          <button
            onClick={handleSubmitReply}
            disabled={!replyText.trim() || submitting}
            style={{ marginTop: '6px', padding: '7px 16px', borderRadius: '8px', background: 'var(--teal)', color: 'white', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', opacity: (!replyText.trim() || submitting) ? 0.5 : 1, fontFamily: 'Sora, sans-serif' }}
          >
            {submitting ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function DetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [mainBook, setMainBook] = useState<BookEdition | null>(null);
  const [editions, setEditions] = useState<BookEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [searchingEditions, setSearchingEditions] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ userId: string; name: string; token: string } | null>(null);
  const [dbBookId, setDbBookId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      try {
        const u = JSON.parse(storedUser);
        setCurrentUser({ userId: u.id, name: u.name, token });
      } catch {}
    }
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      const { source, key } = parseBookId(id);
      try {
        let book: BookEdition | null = null;
        if (source === 'kazakhstan') {
          const res = await fetch('/api/books/kazakhstan?q=');
          const data = await res.json();
          const found = (data.books || []).find((b: any) => b.id === id);
          if (found) book = { ...found, hasFullText: found.hasPdf ?? false, readerUrl: found.hasPdf ? found.pdfUrl : null, url: found.hasPdf ? found.pdfUrl : found.pageUrl };
        } else if (source === 'google') {
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${key}`);
          const item = await res.json();
          if (item.volumeInfo) {
            const info = item.volumeInfo; const access = item.accessInfo;
            const hasFullText = access?.viewability === 'ALL_PAGES' || access?.epub?.isAvailable || access?.pdf?.isAvailable;
            const readUrl = info.canonicalVolumeLink || info.previewLink;
            book = { id, title: info.title, authors: info.authors || [], description: info.description || '', image: (info.imageLinks?.thumbnail || '').replace('http:', 'https:'), price: 'Бесплатно', url: readUrl, pageUrl: info.infoLink, source: 'Google Books', hasFullText, readerUrl: hasFullText ? readUrl : null };
          }
        } else if (source === 'itbook') {
          const res = await fetch(`https://api.itbook.store/1.0/books/${key}`);
          const item = await res.json();
          if (item.title) book = { id, title: item.title, authors: item.authors ? item.authors.split(', ') : [], description: item.desc || '', image: item.image || '', price: item.price === '$0.00' ? 'Бесплатно' : item.price, url: item.url, pageUrl: item.url, source: 'IT Book Store', hasFullText: false, readerUrl: null };
        } else if (source === 'gutenberg') {
          const res = await fetch(`https://gutendex.com/books/${key}`);
          const item = await res.json();
          if (item.title) {
            const htmlUrl = item.formats?.['text/html'];
            book = { id, title: item.title, authors: item.authors?.map((a: any) => a.name) || [], description: item.summaries?.[0] || item.subjects?.slice(0, 5).join(', ') || '', image: item.formats?.['image/jpeg'] || '', price: 'Бесплатно', url: htmlUrl || `https://www.gutenberg.org/ebooks/${key}`, pageUrl: `https://www.gutenberg.org/ebooks/${key}`, source: 'Project Gutenberg', hasFullText: !!htmlUrl, readerUrl: htmlUrl || null };
          }
        } else if (source === 'openlibrary') {
          const res = await fetch(`https://openlibrary.org/works/${key}.json`);
          const item = await res.json();
          if (item.title) {
            const desc = typeof item.description === 'string' ? item.description : item.description?.value || '';
            book = { id, title: item.title, authors: [], description: desc, image: item.covers?.[0] ? `https://covers.openlibrary.org/b/id/${item.covers[0]}-L.jpg` : '', price: 'Бесплатно', url: `https://openlibrary.org/works/${key}`, pageUrl: `https://openlibrary.org/works/${key}`, source: 'Open Library', hasFullText: false, readerUrl: null };
          }
        }
        setMainBook(book);
        if (book) {
          // Ensure book exists in DB
          try {
            const dbRes = await fetch('/api/books', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title: book.title, author: book.authors[0] || 'Unknown', description: book.description, coverUrl: book.image, source: book.source, sourceId: id }),
            });
            const dbBook = await dbRes.json();
            if (dbBook.id) setDbBookId(dbBook.id);
          } catch {}
          setSearchingEditions(true);
          await fetchAllEditions(book);
          setSearchingEditions(false);
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchBook();
  }, [id]);

  const fetchAllEditions = async (book: BookEdition) => {
    const titleQuery = book.title.replace(/\.\s*\d+\s*класс.*/i, '').replace(/\(.*?\)/g, '').trim();
    const results: BookEdition[] = [];
    try {
      const olRes = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(titleQuery)}&fields=key,title,author_name,cover_i,ia,public_scan_b,lending_identifier_s,edition_count&limit=8`);
      const olData = await olRes.json();
      for (const item of (olData.docs || []).slice(0, 6)) {
        const iaId = item.ia?.[0] || item.lending_identifier_s;
        const hasFullText = !!(iaId || item.public_scan_b);
        results.push({ id: `ol-ed-${item.key?.replace('/works/', '')}`, title: item.title, authors: item.author_name || [], description: item.edition_count ? `${item.edition_count} изданий` : '', image: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : '', price: 'Бесплатно', url: hasFullText && iaId ? `https://archive.org/embed/${iaId}` : `https://openlibrary.org${item.key}`, pageUrl: `https://openlibrary.org${item.key}`, source: 'Open Library', hasFullText, readerUrl: hasFullText && iaId ? `https://archive.org/embed/${iaId}` : null });
      }
    } catch {}
    try {
      const gRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(titleQuery)}&maxResults=8&printType=books`);
      const gData = await gRes.json();
      for (const item of (gData.items || []).slice(0, 5)) {
        const info = item.volumeInfo; const access = item.accessInfo;
        const hasFullText = access?.viewability === 'ALL_PAGES' || access?.epub?.isAvailable;
        results.push({ id: `g-ed-${item.id}`, title: info.title, authors: info.authors || [], description: info.publishedDate ? `Год: ${info.publishedDate.slice(0, 4)}` : '', image: (info.imageLinks?.thumbnail || '').replace('http:', 'https:'), price: 'Бесплатно', url: info.canonicalVolumeLink || info.previewLink, pageUrl: info.infoLink, source: 'Google Books', hasFullText, readerUrl: hasFullText ? (info.canonicalVolumeLink || info.previewLink) : null });
      }
    } catch {}
    setEditions(results.filter(r => r.title?.toLowerCase() !== book.title?.toLowerCase() || r.source !== book.source));
  };

  const loadComments = useCallback(async () => {
    if (!dbBookId) return;
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/books/${dbBookId}/comments`);
      const data = await res.json();
      if (data.data) setComments(data.data);
    } catch {}
    setCommentsLoading(false);
  }, [dbBookId]);

  const loadRatings = useCallback(async () => {
    if (!dbBookId) return;
    try {
      const res = await fetch(`/api/books/${dbBookId}/ratings`);
      const data = await res.json();
      if (data.data) {
        const ratings = data.data;
        const avg = ratings.length > 0 ? ratings.reduce((s: number, r: any) => s + r.score, 0) / ratings.length : 0;
        setAvgRating(avg);
        setRatingCount(ratings.length);
      }
    } catch {}
  }, [dbBookId]);

  const checkFavorite = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !dbBookId) return;
    try {
      const res = await fetch('/api/favorites', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.data) setIsFavorite(data.data.some((f: any) => f.bookId === dbBookId));
    } catch {}
  }, [dbBookId]);

  useEffect(() => {
    if (dbBookId) {
      loadComments();
      loadRatings();
      checkFavorite();
    }
  }, [dbBookId, loadComments, loadRatings, checkFavorite]);

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    if (!dbBookId) return;
    setFavLoading(true);
    try {
      if (!isFavorite) {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ bookId: dbBookId }),
        });
        setIsFavorite(true);
      } else {
        const res = await fetch('/api/favorites', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        const fav = data.data?.find((f: any) => f.bookId === dbBookId);
        if (fav) {
          await fetch(`/api/favorites/${fav.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
          setIsFavorite(false);
        }
      }
    } catch {}
    setFavLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !dbBookId) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    setSubmitting(true);
    try {
      await fetch(`/api/books/${dbBookId}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score: userRating }),
      });
      const res = await fetch(`/api/books/${dbBookId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (res.ok) {
        setNewComment('');
        setUserRating(5);
        await loadComments();
        await loadRatings();
      }
    } catch {}
    setSubmitting(false);
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!dbBookId) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    try {
      const res = await fetch(`/api/books/${dbBookId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content, parentId }),
      });
      if (res.ok) await loadComments();
    } catch {}
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '44px', height: '44px', border: '3px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Загружаем книгу...</p>
        </div>
      </div>
    );
  }

  if (!mainBook) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>📚</p>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Книга не найдена</h1>
          <Link href="/search" style={{ color: 'var(--teal)', fontWeight: 600 }}>← Вернуться к поиску</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <Link href="/search" style={{ color: 'var(--teal)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>← Назад к поиску</Link>

        {/* Main card */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          {/* Cover hero */}
          <div style={{ position: 'relative', height: '260px', overflow: 'hidden', background: mainBook.image ? undefined : 'linear-gradient(135deg, var(--teal) 0%, var(--coral) 100%)' }}>
            {mainBook.image ? (
              <img src={mainBook.image} alt={mainBook.title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px) brightness(0.7)', transform: 'scale(1.05)' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>📚</div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />

            {/* Book cover overlay */}
            <div style={{ position: 'absolute', bottom: '20px', left: '24px', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
              <div style={{ width: '90px', height: '130px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', flexShrink: 0, background: mainBook.image ? undefined : 'linear-gradient(135deg, var(--teal-dark), var(--coral-dark))' }}>
                {mainBook.image ? (
                  <img src={mainBook.image} alt={mainBook.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📚</div>
                )}
              </div>
              <div style={{ paddingBottom: '4px' }}>
                {mainBook.grade && (
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '11px', fontWeight: 600, marginBottom: '6px' }}>
                    {mainBook.grade} класс
                  </span>
                )}
                <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'white', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)', fontFamily: 'DM Serif Display, serif', maxWidth: '500px' }}>
                  {mainBook.title}
                </h1>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              {mainBook.authors.length > 0 && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>✍️ {mainBook.authors.join(', ')}</span>}
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📦 {mainBook.source}</span>
              {mainBook.subject && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📗 {mainBook.subject}</span>}
              {avgRating > 0 && <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: 600 }}>★ {avgRating.toFixed(1)} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({ratingCount})</span></span>}
              {mainBook.hasFullText && (
                <span style={{ padding: '3px 10px', borderRadius: '20px', background: 'var(--teal-pale)', color: 'var(--teal-dark)', fontSize: '12px', fontWeight: 600 }}>Читать онлайн</span>
              )}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
              {mainBook.description || 'Описание отсутствует.'}
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              {mainBook.hasFullText && mainBook.readerUrl ? (
                <Link
                  href={`/reader?src=${encodeURIComponent(mainBook.readerUrl)}&title=${encodeURIComponent(mainBook.title)}&back=${encodeURIComponent('/details/' + id)}`}
                  style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--teal), var(--teal-dark))', color: 'white', fontWeight: 700, fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 12px rgba(61,174,183,0.35)' }}
                >
                  📖 Читать
                </Link>
              ) : null}
              <a
                href={mainBook.pageUrl || mainBook.url}
                target="_blank" rel="noopener noreferrer"
                style={{ padding: '12px 20px', borderRadius: '12px', background: 'var(--coral)', color: 'white', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}
              >
                Открыть на сайте ↗
              </a>
              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                style={{
                  padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '14px',
                  border: '1.5px solid', borderColor: isFavorite ? 'var(--coral)' : 'var(--gray)',
                  background: isFavorite ? 'var(--coral-light)' : 'var(--surface)',
                  color: isFavorite ? 'var(--coral-dark)' : 'var(--text-muted)', cursor: 'pointer',
                }}
              >
                {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
              </button>
              <Link href="/favorites" style={{ padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: '1.5px solid var(--gray)', background: 'var(--surface)', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-block' }}>
                📚 Избранное
              </Link>
            </div>
          </div>
        </div>

        {/* Editions */}
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '20px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📚 Все варианты и издания
            {searchingEditions && <span className="animate-spin" style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%' }} />}
          </h2>
          {!searchingEditions && editions.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Других изданий не найдено.</p>
          )}
          <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {editions.map(ed => (
              <div key={ed.id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1.5px solid var(--gray)', borderRadius: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '56px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {ed.image ? <img src={ed.image} alt={ed.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📘'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ed.title}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>{ed.source} · {ed.price}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {ed.hasFullText && ed.readerUrl ? (
                      <Link href={`/reader?src=${encodeURIComponent(ed.readerUrl)}&title=${encodeURIComponent(ed.title)}&back=${encodeURIComponent('/details/' + id)}`}
                        style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--teal-pale)', color: 'var(--teal-dark)', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
                        📖 Читать
                      </Link>
                    ) : (
                      <a href={ed.pageUrl || ed.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--coral-light)', color: 'var(--coral-dark)', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
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
        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '20px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>
            Отзывы и комментарии
            {ratingCount > 0 && (
              <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>
                ★ {avgRating.toFixed(1)} · {ratingCount} {ratingCount === 1 ? 'отзыв' : 'отзывов'}
              </span>
            )}
          </h2>

          <div style={{ background: 'var(--bg)', border: '1.5px solid var(--gray)', borderRadius: '16px', padding: '18px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              {currentUser ? 'Оставить отзыв' : 'Войдите, чтобы оставить отзыв'}
            </h3>
            {currentUser ? (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px' }}>Ваша оценка</div>
                  <StarRating value={userRating} onChange={setUserRating} />
                </div>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Поделитесь впечатлением о книге..."
                  rows={3}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid var(--gray)', fontSize: '14px', fontFamily: 'Sora, sans-serif', resize: 'none', background: 'var(--surface)', color: 'var(--text)', marginBottom: '10px' }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submitting}
                  style={{ padding: '10px 22px', borderRadius: '10px', background: 'var(--teal)', color: 'white', border: 'none', fontWeight: 600, fontSize: '13px', cursor: (!newComment.trim() || submitting) ? 'not-allowed' : 'pointer', opacity: (!newComment.trim() || submitting) ? 0.5 : 1, fontFamily: 'Sora, sans-serif' }}
                >
                  {submitting ? 'Публикую...' : 'Опубликовать'}
                </button>
              </>
            ) : (
              <Link href="/auth" style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '10px', background: 'var(--teal)', color: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                Войти
              </Link>
            )}
          </div>

          {commentsLoading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Загрузка...</p>
          ) : comments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px', fontSize: '14px' }}>
              Пока нет отзывов. Будьте первым! 🌟
            </p>
          ) : (
            <div>
              {comments.map(comment => (
                <CommentBlock key={comment.id} comment={comment} currentUser={currentUser} onReply={handleReply} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
