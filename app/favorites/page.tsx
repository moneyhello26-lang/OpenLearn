'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FavoriteBook {
  id: string;
  bookId: string;
  addedAt: string;
  book: {
    id: string;
    title: string;
    author: string;
    coverUrl?: string;
    source: string;
    sourceId: string;
    rating: number;
    reviewCount: number;
  };
}

interface FavoriteCourse {
  id: string;
  courseExtId: string;
  title: string;
  coverUrl?: string;
  instructor: string;
  addedAt: string;
}

type Tab = 'books' | 'courses';

export default function FavoritesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('books');
  const [books, setBooks] = useState<FavoriteBook[]>([]);
  const [courses, setCourses] = useState<FavoriteCourse[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      router.push('/auth');
      return;
    }
    try { setUser(JSON.parse(stored)); } catch {}
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const loadBooks = async () => {
      setLoadingBooks(true);
      try {
        const res = await fetch('/api/favorites?limit=50', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBooks(data.data || []);
      } catch {}
      setLoadingBooks(false);
    };

    const loadCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await fetch('/api/course-favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data.data || []);
      } catch {}
      setLoadingCourses(false);
    };

    loadBooks();
    loadCourses();
  }, []);

  const removeBookFavorite = async (favoriteId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(books.filter(b => b.id !== favoriteId));
    } catch {}
  };

  const removeCourseFavorite = async (courseExtId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch('/api/course-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseExtId }),
      });
      setCourses(courses.filter(c => c.courseExtId !== courseExtId));
    } catch {}
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin" style={{ width: '44px', height: '44px', border: '3px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', fontFamily: 'DM Serif Display, serif', marginBottom: '4px' }}>
                📚 Избранное
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Ваши сохранённые книги и курсы, {user.name}
              </p>
            </div>
            <Link href="/search" style={{ padding: '10px 18px', borderRadius: '12px', background: 'var(--teal)', color: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
              + Найти ещё
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '14px', padding: '4px', width: 'fit-content' }}>
          {(['books', 'courses'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '9px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px',
                border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                background: tab === t ? 'var(--teal)' : 'transparent',
                color: tab === t ? 'white' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {t === 'books' ? `📚 Книги${books.length > 0 ? ` (${books.length})` : ''}` : `🎓 Курсы${courses.length > 0 ? ` (${courses.length})` : ''}`}
            </button>
          ))}
        </div>

        {/* Books tab */}
        {tab === 'books' && (
          <div>
            {loadingBooks ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div className="animate-spin" style={{ width: '44px', height: '44px', border: '3px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>Загружаем избранные книги...</p>
              </div>
            ) : books.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: '20px', border: '1.5px solid var(--gray)' }}>
                <p style={{ fontSize: '48px', marginBottom: '12px' }}>📚</p>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Нет избранных книг</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Найдите интересную книгу и нажмите «В избранное», чтобы сохранить её здесь
                </p>
                <Link href="/search" style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--teal)', color: 'white', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
                  Найти книги →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {books.map(fav => (
                  <div key={fav.id} style={{ display: 'flex', gap: '16px', background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '16px', padding: '16px', alignItems: 'flex-start', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(61,174,183,0.12)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    {/* Cover */}
                    <div style={{ width: '64px', height: '90px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: 'var(--coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                      {fav.book.coverUrl ? (
                        <img src={fav.book.coverUrl} alt={fav.book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : '📚'}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {fav.book.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        {fav.book.author}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--gray-dark)' }}>📦 {fav.book.source}</span>
                        {fav.book.rating > 0 && <span style={{ fontSize: '12px', color: '#f59e0b' }}>★ {fav.book.rating.toFixed(1)}</span>}
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Добавлено {formatDate(fav.addedAt)}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <Link
                          href={`/details/${fav.book.sourceId}`}
                          style={{ padding: '7px 14px', borderRadius: '8px', background: 'var(--teal)', color: 'white', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
                        >
                          Открыть →
                        </Link>
                        <button
                          onClick={() => removeBookFavorite(fav.id)}
                          style={{ padding: '7px 14px', borderRadius: '8px', background: 'var(--coral-light)', color: 'var(--coral-dark)', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Sora, sans-serif' }}
                        >
                          ✕ Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Courses tab */}
        {tab === 'courses' && (
          <div>
            {loadingCourses ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div className="animate-spin" style={{ width: '44px', height: '44px', border: '3px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%', margin: '0 auto 16px' }} />
                <p style={{ color: 'var(--text-muted)' }}>Загружаем избранные курсы...</p>
              </div>
            ) : courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--surface)', borderRadius: '20px', border: '1.5px solid var(--gray)' }}>
                <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</p>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>Нет избранных курсов</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Откройте страницу курса и нажмите «В избранное», чтобы сохранить его здесь
                </p>
                <Link href="/search" style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--teal)', color: 'white', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
                  Найти курсы →
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {courses.map(fav => (
                  <div key={fav.id} style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--teal)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(61,174,183,0.12)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gray)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                  >
                    <div style={{ height: '140px', overflow: 'hidden', background: fav.coverUrl ? undefined : 'linear-gradient(135deg, var(--teal), var(--coral))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {fav.coverUrl ? (
                        <img src={fav.coverUrl} alt={fav.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '40px' }}>🎓</span>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {fav.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        👤 {fav.instructor || 'Преподаватель'}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        Добавлено {formatDate(fav.addedAt)}
                      </p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/course/${fav.courseExtId}`}
                          style={{ flex: 1, padding: '8px', borderRadius: '8px', background: 'var(--teal)', color: 'white', fontSize: '12px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}
                        >
                          🚀 Продолжить
                        </Link>
                        <button
                          onClick={() => removeCourseFavorite(fav.courseExtId)}
                          style={{ padding: '8px 12px', borderRadius: '8px', background: 'var(--coral-light)', color: 'var(--coral-dark)', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
