'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface BookEdition {
  id: string; title: string; authors: string[]; description: string;
  image: string; price: string; url: string; pageUrl?: string;
  readerUrl?: string | null; source: string; hasFullText?: boolean;
  grade?: number; subject?: string;
}
interface CommentUser { id: string; name: string; avatar?: string }
interface CommentItem {
  id: string; userId: string; user: CommentUser; content: string;
  createdAt: string; replies: CommentItem[];
}

function parseBookId(id: string) {
  if (id.startsWith('google-')) return { source: 'google', key: id.replace('google-', '') };
  if (id.startsWith('itbook-')) return { source: 'itbook', key: id.replace('itbook-', '') };
  if (id.startsWith('gutenberg-')) return { source: 'gutenberg', key: id.replace('gutenberg-', '') };
  if (id.startsWith('openlibrary-')) return { source: 'openlibrary', key: id.replace('openlibrary-', '') };
  if (id.startsWith('kz-')) return { source: 'kazakhstan', key: id };
  return { source: 'unknown', key: id };
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const ro = !onChange;
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" disabled={ro}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !ro && setHover(s)}
          onMouseLeave={() => setHover(0)}
          style={{ fontSize: '24px', cursor: ro ? 'default' : 'pointer', border: 'none', background: 'none', padding: '0 1px', color: s <= (hover || value) ? '#f59e0b' : '#d1d5db', transition: 'color 0.12s' }}>
          ★
        </button>
      ))}
    </div>
  );
}

function CommentBlock({ comment, authUser, bookId, onRefresh }: {
  comment: CommentItem;
  authUser: { token: string; name: string } | null;
  bookId: string;
  onRefresh: () => void;
}) {
  const [showReply, setShowReply] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const initials = comment.user.name.slice(0, 2).toUpperCase();
  const date = new Date(comment.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  const submitReply = async () => {
    if (!text.trim() || !authUser) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/books/${bookId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authUser.token}` },
        body: JSON.stringify({ content: text.trim(), parentId: comment.id }),
      });
      if (res.ok) { setText(''); setShowReply(false); onRefresh(); }
    } catch {}
    setBusy(false);
  };

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '14px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--teal), var(--coral))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>{initials}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{comment.user.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{date}</div>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: authUser ? '8px' : 0 }}>{comment.content}</p>
        {authUser && (
          <button onClick={() => setShowReply(!showReply)}
            style={{ fontSize: '12px', color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
            {showReply ? '✕ Отмена' : '↩ Ответить'}
          </button>
        )}
      </div>

      {comment.replies.length > 0 && (
        <div style={{ marginLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {comment.replies.map(r => {
            const ri = r.user.name.slice(0, 2).toUpperCase();
            const rd = new Date(r.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            return (
              <div key={r.id} style={{ background: 'var(--teal-pale)', border: '1.5px solid var(--teal-light)', borderRadius: '12px', padding: '10px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '11px' }}>{ri}</div>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{r.user.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{rd}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55 }}>{r.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {showReply && (
        <div style={{ marginLeft: '24px', marginTop: '8px' }}>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Ваш ответ..." rows={2}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--teal-light)', fontSize: '13px', fontFamily: 'Sora, sans-serif', resize: 'none', background: 'var(--surface)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }} />
          <button onClick={submitReply} disabled={!text.trim() || busy}
            style={{ marginTop: '6px', padding: '7px 18px', borderRadius: '8px', background: 'var(--teal)', color: 'white', border: 'none', fontSize: '12px', fontWeight: 600, cursor: (!text.trim() || busy) ? 'not-allowed' : 'pointer', opacity: (!text.trim() || busy) ? 0.5 : 1, fontFamily: 'Sora, sans-serif' }}>
            {busy ? 'Отправка...' : 'Отправить'}
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
  const [searchingEditions, setSearchingEditions] = useState(false);

  const [dbBookId, setDbBookId] = useState<string | null>(null);
  const dbBookIdRef = useRef<string | null>(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favBusy, setFavBusy] = useState(false);

  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newText, setNewText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [authUser, setAuthUser] = useState<{ userId: string; name: string; token: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      try { const u = JSON.parse(stored); setAuthUser({ userId: u.id, name: u.name, token }); } catch {}
    }
  }, []);

  const loadComments = useCallback(async (bid?: string) => {
    const bookId = bid || dbBookIdRef.current;
    if (!bookId) return;
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}/comments`);
      if (res.ok) { const d = await res.json(); setComments(d.data || []); }
    } catch (e) { console.error('loadComments', e); }
    setCommentsLoading(false);
  }, []);

  const loadRatings = useCallback(async (bid?: string) => {
    const bookId = bid || dbBookIdRef.current;
    if (!bookId) return;
    try {
      const res = await fetch(`/api/books/${bookId}/ratings`);
      if (res.ok) {
        const d = await res.json();
        const rs: any[] = d.data || [];
        const avg = rs.length > 0 ? rs.reduce((s: number, r: any) => s + r.score, 0) / rs.length : 0;
        setAvgRating(avg); setRatingCount(rs.length);
      }
    } catch {}
  }, []);

  const checkFavorite = useCallback(async (bookId: string, token: string) => {
    try {
      const res = await fetch('/api/favorites?limit=50', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const d = await res.json();
        setIsFavorite((d.data || []).some((f: any) => f.bookId === bookId));
      }
    } catch {}
  }, []);

  const ensureBook = useCallback(async (book: BookEdition): Promise<string | null> => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: book.title,
          author: book.authors[0] || 'Unknown',
          description: book.description,
          coverUrl: book.image,
          source: book.source,
          sourceId: id,
        }),
      });
      if (res.ok || res.status === 201) { const d = await res.json(); return d.id || null; }
    } catch {}
    return null;
  }, [id]);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true);
      const { source, key } = parseBookId(id);
      let book: BookEdition | null = null;
      try {
        if (source === 'kazakhstan') {
          const res = await fetch('/api/books/kazakhstan?q=');
          const data = await res.json();
          const found = (data.books || []).find((b: any) => b.id === id);
          if (found) book = { ...found, hasFullText: found.hasPdf ?? false, readerUrl: found.hasPdf ? found.pdfUrl : null, url: found.hasPdf ? found.pdfUrl : found.pageUrl };
        } else if (source === 'google') {
          const res = await fetch(`/api/books/details?id=${id}`);
          if (res.ok) {
            book = await res.json();
          } else {
            console.error('Failed to fetch google book details', await res.text());
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
            book = { id, title: item.title, authors: item.authors?.map((a: any) => a.name) || [], description: item.summaries?.[0] || item.subjects?.slice(0,5).join(', ') || '', image: item.formats?.['image/jpeg'] || '', price: 'Бесплатно', url: htmlUrl || `https://www.gutenberg.org/ebooks/${key}`, pageUrl: `https://www.gutenberg.org/ebooks/${key}`, source: 'Project Gutenberg', hasFullText: !!htmlUrl, readerUrl: htmlUrl || null };
          }
        } else if (source === 'openlibrary') {
          const res = await fetch(`https://openlibrary.org/works/${key}.json`);
          const item = await res.json();
          if (item.title) {
            const desc = typeof item.description === 'string' ? item.description : item.description?.value || '';
            book = { id, title: item.title, authors: [], description: desc, image: item.covers?.[0] ? `https://covers.openlibrary.org/b/id/${item.covers[0]}-L.jpg` : '', price: 'Бесплатно', url: `https://openlibrary.org/works/${key}`, pageUrl: `https://openlibrary.org/works/${key}`, source: 'Open Library', hasFullText: false, readerUrl: null };
          }
        }
      } catch (e) { console.error('fetchBook', e); }

      setMainBook(book);
      setLoading(false);

      if (book) {
        // Register in DB
        const bid = await ensureBook(book);
        if (bid) {
          dbBookIdRef.current = bid;
          setDbBookId(bid);
          loadComments(bid);
          loadRatings(bid);
          const token = localStorage.getItem('token');
          if (token) checkFavorite(bid, token);
        }

        setSearchingEditions(true);
        const titleQ = book.title.replace(/\.\s*\d+\s*класс.*/i,'').replace(/\(.*?\)/g,'').trim();
        const results: BookEdition[] = [];
        try {
          const r = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(titleQ)}&fields=key,title,author_name,cover_i,ia,public_scan_b,lending_identifier_s&limit=6`);
          const d = await r.json();
          for (const it of (d.docs||[]).slice(0,6)) {
            const iaId = it.ia?.[0] || it.lending_identifier_s;
            const hf = !!(iaId || it.public_scan_b);
            results.push({ id:`ol-${it.key?.replace('/works/','')}`, title:it.title, authors:it.author_name||[], description:'', image:it.cover_i?`https://covers.openlibrary.org/b/id/${it.cover_i}-M.jpg`:'', price:'Бесплатно', url:hf&&iaId?`https://archive.org/embed/${iaId}`:`https://openlibrary.org${it.key}`, pageUrl:`https://openlibrary.org${it.key}`, source:'Open Library', hasFullText:hf, readerUrl:hf&&iaId?`https://archive.org/embed/${iaId}`:null });
          }
        } catch {}
        setEditions(results.filter(r => r.title?.toLowerCase() !== book!.title?.toLowerCase() || r.source !== book!.source));
        setSearchingEditions(false);
      }
    };
    fetch_();
  }, [id, ensureBook, loadComments, loadRatings, checkFavorite]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    const bid = dbBookIdRef.current;
    if (!bid || !mainBook) {
      alert('Подождите, книга загружается...');
      return;
    }
    setFavBusy(true);
    try {
      if (!isFavorite) {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ bookId: bid }),
        });
        if (res.ok || res.status === 201) setIsFavorite(true);
        else if (res.status === 400) {
          // Already in favorites (race condition) - just mark as favorite
          const e = await res.json();
          if (e.error === 'Book already in favorites') setIsFavorite(true);
          else console.error('fav error', e);
        }
      } else {
        // Find and delete
        const res = await fetch('/api/favorites?limit=50', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const d = await res.json();
          const fav = (d.data||[]).find((f: any) => f.bookId === bid);
          if (fav) {
            await fetch(`/api/favorites/${fav.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            setIsFavorite(false);
          }
        }
      }
    } catch (e) { console.error('toggleFavorite', e); }
    setFavBusy(false);
  };

  const submitComment = async () => {
    if (!newText.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    const bid = dbBookIdRef.current;
    if (!bid) {
      alert('Подождите, книга загружается...');
      return;
    }
    setSubmitting(true);
    try {
      // Rating
      await fetch(`/api/books/${bid}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score: userRating }),
      });
      // Comment
      const res = await fetch(`/api/books/${bid}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newText.trim() }),
      });
      if (res.ok || res.status === 201) {
        setNewText(''); setUserRating(5);
        await loadComments(); await loadRatings();
      } else { const e = await res.json(); console.error('comment error', e); }
    } catch (e) { console.error('submitComment', e); }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:'44px', height:'44px', border:'3px solid var(--teal-light)', borderTopColor:'var(--teal)', borderRadius:'50%' }} className="animate-spin" />
    </div>
  );
  if (!mainBook) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ fontSize:'48px', marginBottom:'12px' }}>📚</p>
        <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)', marginBottom:'12px' }}>Книга не найдена</h1>
        <Link href="/search" style={{ color:'var(--teal)', fontWeight:600 }}>← Назад к поиску</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ maxWidth:'860px', margin:'0 auto', padding:'32px 20px', display:'flex', flexDirection:'column', gap:'20px' }}>

        <Link href="/search" style={{ color:'var(--teal)', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>← Назад к поиску</Link>

        {/* Book card */}
        <div style={{ background:'var(--surface)', border:'1.5px solid var(--gray)', borderRadius:'20px', overflow:'hidden', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>
          {/* Hero cover */}
          <div style={{ position:'relative', height:'240px', background: mainBook.image ? undefined : 'linear-gradient(135deg, var(--teal), var(--coral))' }}>
            {mainBook.image && <img src={mainBook.image} alt={mainBook.title} style={{ width:'100%', height:'100%', objectFit:'cover', filter:'blur(3px) brightness(0.6)', transform:'scale(1.06)' }} />}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)' }} />
            <div style={{ position:'absolute', bottom:'16px', left:'20px', display:'flex', gap:'18px', alignItems:'flex-end' }}>
              <div style={{ width:'80px', height:'114px', borderRadius:'10px', overflow:'hidden', boxShadow:'0 8px 24px rgba(0,0,0,0.4)', flexShrink:0, background:'var(--coral-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>
                {mainBook.image ? <img src={mainBook.image} alt={mainBook.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '📚'}
              </div>
              <div style={{ paddingBottom:'4px' }}>
                {mainBook.grade && <span style={{ display:'inline-block', padding:'3px 10px', borderRadius:'20px', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', color:'white', fontSize:'11px', fontWeight:600, marginBottom:'6px' }}>{mainBook.grade} класс</span>}
                <h1 style={{ fontSize:'22px', fontWeight:700, color:'white', margin:0, fontFamily:'DM Serif Display, serif', textShadow:'0 2px 8px rgba(0,0,0,0.4)', maxWidth:'560px' }}>{mainBook.title}</h1>
              </div>
            </div>
          </div>

          <div style={{ padding:'20px 24px' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'center', marginBottom:'14px' }}>
              {mainBook.authors.length > 0 && <span style={{ fontSize:'14px', color:'var(--text-muted)' }}>✍️ {mainBook.authors.join(', ')}</span>}
              <span style={{ fontSize:'14px', color:'var(--text-muted)' }}>📦 {mainBook.source}</span>
              {mainBook.hasFullText && <span style={{ padding:'3px 10px', borderRadius:'20px', background:'var(--teal-pale)', color:'var(--teal-dark)', fontSize:'12px', fontWeight:600 }}>Читать онлайн</span>}
              {avgRating > 0 && <span style={{ fontSize:'14px', color:'#f59e0b', fontWeight:600 }}>★ {avgRating.toFixed(1)} <span style={{ color:'var(--text-muted)', fontWeight:400 }}>({ratingCount})</span></span>}
            </div>
            <p style={{ fontSize:'14px', color:'var(--text-muted)', lineHeight:1.75, marginBottom:'18px' }}>{mainBook.description || 'Описание отсутствует.'}</p>

            {/* Action buttons */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
              {mainBook.hasFullText && mainBook.readerUrl && (
                <Link href={`/reader?src=${encodeURIComponent(mainBook.readerUrl)}&title=${encodeURIComponent(mainBook.title)}&back=${encodeURIComponent('/details/'+id)}`}
                  style={{ padding:'12px 24px', borderRadius:'12px', background:'linear-gradient(135deg, var(--teal), var(--teal-dark))', color:'white', fontWeight:700, fontSize:'14px', textDecoration:'none', boxShadow:'0 4px 12px rgba(61,174,183,0.3)' }}>
                  📖 Читать
                </Link>
              )}
              <a href={mainBook.pageUrl || mainBook.url} target="_blank" rel="noopener noreferrer"
                style={{ padding:'12px 20px', borderRadius:'12px', background:'var(--coral)', color:'white', fontWeight:600, fontSize:'14px', textDecoration:'none' }}>
                Открыть ↗
              </a>
              <button onClick={toggleFavorite} disabled={favBusy}
                style={{ padding:'12px 20px', borderRadius:'12px', fontWeight:600, fontSize:'14px', border:'1.5px solid', borderColor: isFavorite ? 'var(--coral)' : 'var(--gray)', background: isFavorite ? 'var(--coral-light)' : 'var(--surface)', color: isFavorite ? 'var(--coral-dark)' : 'var(--text-muted)', cursor: favBusy ? 'wait' : 'pointer', fontFamily:'Sora, sans-serif', transition:'all 0.2s' }}>
                {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
              </button>
              <Link href="/favorites"
                style={{ padding:'12px 18px', borderRadius:'12px', fontWeight:600, fontSize:'14px', border:'1.5px solid var(--gray)', background:'var(--surface)', color:'var(--text-muted)', textDecoration:'none', display:'inline-block' }}>
                📚 Моё избранное
              </Link>
            </div>
          </div>
        </div>

        {/* Editions */}
        {(searchingEditions || editions.length > 0) && (
          <div style={{ background:'var(--surface)', border:'1.5px solid var(--gray)', borderRadius:'20px', padding:'24px' }}>
            <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px' }}>
              📚 Все варианты и издания
              {searchingEditions && <div className="animate-spin" style={{ width:'16px', height:'16px', border:'2px solid var(--teal-light)', borderTopColor:'var(--teal)', borderRadius:'50%' }} />}
            </h2>
            <div style={{ display:'grid', gap:'10px', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {editions.map(ed => (
                <div key={ed.id} style={{ display:'flex', gap:'12px', padding:'12px', border:'1.5px solid var(--gray)', borderRadius:'12px', alignItems:'flex-start' }}>
                  <div style={{ width:'40px', height:'56px', borderRadius:'8px', overflow:'hidden', flexShrink:0, background:'var(--coral-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
                    {ed.image ? <img src={ed.image} alt={ed.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '📘'}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:'13px', fontWeight:600, color:'var(--text)', marginBottom:'3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ed.title}</p>
                    <p style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'6px' }}>{ed.source} · {ed.price}</p>
                    <div style={{ display:'flex', gap:'6px' }}>
                      {ed.hasFullText && ed.readerUrl
                        ? <Link href={`/reader?src=${encodeURIComponent(ed.readerUrl)}&title=${encodeURIComponent(ed.title)}&back=${encodeURIComponent('/details/'+id)}`} style={{ fontSize:'11px', padding:'4px 10px', background:'var(--teal-pale)', color:'var(--teal-dark)', borderRadius:'6px', textDecoration:'none', fontWeight:600 }}>📖 Читать</Link>
                        : <a href={ed.pageUrl || ed.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:'11px', padding:'4px 10px', background:'var(--coral-light)', color:'var(--coral-dark)', borderRadius:'6px', textDecoration:'none', fontWeight:600 }}>Открыть ↗</a>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div style={{ background:'var(--surface)', border:'1.5px solid var(--gray)', borderRadius:'20px', padding:'24px' }}>
          <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)', marginBottom:'20px' }}>
            💬 Отзывы и комментарии
            {ratingCount > 0 && <span style={{ fontSize:'14px', fontWeight:400, color:'var(--text-muted)', marginLeft:'10px' }}>★ {avgRating.toFixed(1)} · {ratingCount} {ratingCount===1?'отзыв':'отзывов'}</span>}
          </h2>

          {/* Add comment */}
          <div style={{ background:'var(--bg)', border:'1.5px solid var(--gray)', borderRadius:'16px', padding:'18px', marginBottom:'24px' }}>
            {authUser ? (
              <>
                <p style={{ fontSize:'14px', fontWeight:600, color:'var(--text)', marginBottom:'12px' }}>Оставить отзыв</p>
                <div style={{ marginBottom:'12px' }}>
                  <p style={{ fontSize:'12px', color:'var(--text-muted)', marginBottom:'6px' }}>Ваша оценка</p>
                  <Stars value={userRating} onChange={setUserRating} />
                </div>
                <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Поделитесь впечатлением о книге..." rows={3}
                  style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'1.5px solid var(--gray)', fontSize:'14px', fontFamily:'Sora, sans-serif', resize:'none', background:'var(--surface)', color:'var(--text)', marginBottom:'10px', outline:'none', boxSizing:'border-box' }} />
                <button onClick={submitComment} disabled={!newText.trim() || submitting}
                  style={{ padding:'10px 24px', borderRadius:'10px', background:'var(--teal)', color:'white', border:'none', fontWeight:600, fontSize:'13px', cursor:(!newText.trim()||submitting)?'not-allowed':'pointer', opacity:(!newText.trim()||submitting)?0.5:1, fontFamily:'Sora, sans-serif' }}>
                  {submitting ? 'Публикую...' : 'Опубликовать'}
                </button>
              </>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <p style={{ fontSize:'14px', color:'var(--text-muted)' }}>Войдите, чтобы оставить отзыв</p>
                <Link href="/auth" style={{ padding:'9px 20px', borderRadius:'10px', background:'var(--teal)', color:'white', fontWeight:600, fontSize:'13px', textDecoration:'none' }}>Войти</Link>
              </div>
            )}
          </div>

          {/* Comments list */}
          {commentsLoading ? (
            <div style={{ textAlign:'center', padding:'30px' }}>
              <div className="animate-spin" style={{ width:'36px', height:'36px', border:'3px solid var(--teal-light)', borderTopColor:'var(--teal)', borderRadius:'50%', margin:'0 auto' }} />
            </div>
          ) : comments.length === 0 ? (
            <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'14px', padding:'24px 0' }}>Пока нет отзывов. Будьте первым! 🌟</p>
          ) : (
            <div>
              {comments.map(c => (
                <CommentBlock key={c.id} comment={c} authUser={authUser} bookId={dbBookId||''} onRefresh={loadComments} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
