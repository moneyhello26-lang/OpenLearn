'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCourseById } from '@/lib/courses-data';
import type { CourseData } from '@/lib/courses-data';

interface CourseDetails {
  id: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  price: string;
  category: string;
  duration?: string;
  level?: string;
}

interface CommentUser { id: string; name: string; avatar?: string }
interface CommentItem {
  id: string;
  userId: string;
  user: CommentUser;
  content: string;
  createdAt: string;
  replies: CommentItem[];
}

function courseDataToDetails(cd: CourseData): CourseDetails {
  return {
    id: cd.id,
    title: cd.title,
    authors: cd.authors,
    description: cd.description,
    image: cd.image,
    price: cd.price,
    category: cd.category,
    duration: cd.duration,
    level: cd.level,
  };
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const readonly = !onChange;
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" disabled={readonly}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !readonly && setHover(s)}
          onMouseLeave={() => setHover(0)}
          style={{ fontSize: '24px', cursor: readonly ? 'default' : 'pointer', border: 'none', background: 'none', padding: '0 1px', color: s <= (hover || value) ? '#f59e0b' : '#d1d5db', transition: 'color 0.12s' }}>
          ★
        </button>
      ))}
    </div>
  );
}

function CommentBlock({ comment, authUser, courseId, onRefresh }: {
  comment: CommentItem;
  authUser: { token: string; name: string } | null;
  courseId: string;
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
      const res = await fetch('/api/course-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authUser.token}` },
        body: JSON.stringify({ courseExtId: courseId, content: text.trim(), parentId: comment.id }),
      });
      if (res.ok) { setText(''); setShowReply(false); onRefresh(); }
    } catch {}
    setBusy(false);
  };

  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '14px', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--teal), var(--coral))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
            {initials}
          </div>
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
            style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--teal-light)', fontSize: '13px', fontFamily: 'Sora, sans-serif', resize: 'none', background: 'var(--surface)', color: 'var(--text)', outline: 'none' }} />
          <button onClick={submitReply} disabled={!text.trim() || busy}
            style={{ marginTop: '6px', padding: '7px 18px', borderRadius: '8px', background: 'var(--teal)', color: 'white', border: 'none', fontSize: '12px', fontWeight: 600, cursor: (!text.trim() || busy) ? 'not-allowed' : 'pointer', opacity: (!text.trim() || busy) ? 0.5 : 1, fontFamily: 'Sora, sans-serif' }}>
            {busy ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
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
      try {
        const u = JSON.parse(stored);
        setAuthUser({ userId: u.id, name: u.name, token });
      } catch {}
    }
  }, []);

  useEffect(() => {
    const cd = getCourseById(id);
    setCourse(cd ? courseDataToDetails(cd) : null);
    setLoading(false);
  }, [id]);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/course-comments?courseId=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.data || []);
      }
    } catch (e) { console.error('loadComments', e); }
    setCommentsLoading(false);
  }, [id]);

  const loadRatings = useCallback(async () => {
    try {
      const res = await fetch(`/api/course-ratings?courseId=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setAvgRating(data.average || 0);
        setRatingCount(data.count || 0);
      }
    } catch (e) { console.error('loadRatings', e); }
  }, [id]);

  const checkFavorite = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/course-favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const favs: any[] = data.data || [];
        setIsFavorite(favs.some(f => f.courseExtId === id));
      }
    } catch {}
  }, [id]);

  useEffect(() => {
    loadComments();
    loadRatings();
  }, [loadComments, loadRatings]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) checkFavorite(token);
  }, [checkFavorite]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    if (!course) return;
    setFavBusy(true);
    try {
      const res = await fetch('/api/course-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseExtId: id, title: course.title, coverUrl: course.image, instructor: course.authors[0] || '' }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.favorited);
      }
    } catch (e) { console.error('toggleFavorite', e); }
    setFavBusy(false);
  };

  const submitComment = async () => {
    if (!newText.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    setSubmitting(true);
    try {
      
      await fetch('/api/course-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseExtId: id, score: userRating }),
      });
      const res = await fetch('/api/course-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseExtId: id, content: newText.trim() }),
      });
      if (res.ok || res.status === 201) {
        setNewText('');
        setUserRating(5);
        await loadComments();
        await loadRatings();
      } else {
        const err = await res.json();
        console.error('submitComment error:', err);
      }
    } catch (e) { console.error('submitComment', e); }
    setSubmitting(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '44px', height: '44px', border: '3px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%' }} className="animate-spin" />
    </div>
  );

  if (!course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</p>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px' }}>Курс не найден</h1>
        <Link href="/courses" style={{ color: 'var(--teal)', fontWeight: 600 }}>← Назад к курсам</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <Link href="/courses" style={{ color: 'var(--teal)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>← Назад к курсам</Link>

        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <div style={{ position: 'relative', height: '280px' }}>
            {course.image
              ? <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--teal), var(--coral))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>🎓</div>
            }
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
              <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                🎓 {course.category}
              </span>
              <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'white', margin: 0, fontFamily: 'DM Serif Display, serif', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{course.title}</h1>
            </div>
          </div>

          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '18px' }}>
              {course.authors[0] && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>👤 {course.authors.join(', ')}</span>}
              {course.duration && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>⏱ {course.duration}</span>}
              {course.level && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📊 {course.level}</span>}
              {avgRating > 0 && (
                <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: 600 }}>
                  ★ {avgRating.toFixed(1)} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({ratingCount} {ratingCount === 1 ? 'отзыв' : 'отзывов'})</span>
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button
                onClick={() => alert('Начинаем курс! Первая лекция скоро будет доступна.')}
                style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--teal), var(--teal-dark))', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(61,174,183,0.35)', fontFamily: 'Sora, sans-serif' }}>
                🚀 Начать курс
              </button>

              <button onClick={toggleFavorite} disabled={favBusy}
                style={{ padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: '1.5px solid', borderColor: isFavorite ? 'var(--coral)' : 'var(--gray)', background: isFavorite ? 'var(--coral-light)' : 'var(--surface)', color: isFavorite ? 'var(--coral-dark)' : 'var(--text-muted)', cursor: favBusy ? 'wait' : 'pointer', fontFamily: 'Sora, sans-serif', transition: 'all 0.2s' }}>
                {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
              </button>

              <Link href="/favorites"
                style={{ padding: '12px 18px', borderRadius: '12px', fontWeight: 600, fontSize: '14px', border: '1.5px solid var(--gray)', background: 'var(--surface)', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-block' }}>
                📚 Моё избранное
              </Link>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '20px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>О курсе</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{course.description}</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1.5px solid var(--gray)', borderRadius: '20px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>
            💬 Отзывы и комментарии
            {ratingCount > 0 && (
              <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '10px' }}>
                ★ {avgRating.toFixed(1)} · {ratingCount} {ratingCount === 1 ? 'отзыв' : 'отзывов'}
              </span>
            )}
          </h2>

          {}
          <div style={{ background: 'var(--bg)', border: '1.5px solid var(--gray)', borderRadius: '16px', padding: '18px', marginBottom: '24px' }}>
            {authUser ? (
              <>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>Оставить отзыв</p>
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>Ваша оценка курса</p>
                  <Stars value={userRating} onChange={setUserRating} />
                </div>
                <textarea value={newText} onChange={e => setNewText(e.target.value)}
                  placeholder="Поделитесь впечатлением о курсе..." rows={3}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid var(--gray)', fontSize: '14px', fontFamily: 'Sora, sans-serif', resize: 'none', background: 'var(--surface)', color: 'var(--text)', marginBottom: '10px', outline: 'none', boxSizing: 'border-box' }} />
                <button onClick={submitComment} disabled={!newText.trim() || submitting}
                  style={{ padding: '10px 24px', borderRadius: '10px', background: 'var(--teal)', color: 'white', border: 'none', fontWeight: 600, fontSize: '13px', cursor: (!newText.trim() || submitting) ? 'not-allowed' : 'pointer', opacity: (!newText.trim() || submitting) ? 0.5 : 1, fontFamily: 'Sora, sans-serif' }}>
                  {submitting ? 'Публикую...' : 'Опубликовать'}
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Войдите, чтобы оставить отзыв</p>
                <Link href="/auth" style={{ padding: '9px 20px', borderRadius: '10px', background: 'var(--teal)', color: 'white', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>Войти</Link>
              </div>
            )}
          </div>

          {}
          {commentsLoading ? (
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div className="animate-spin" style={{ width: '36px', height: '36px', border: '3px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%', margin: '0 auto' }} />
            </div>
          ) : comments.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', padding: '24px 0' }}>
              Пока нет отзывов. Будьте первым! 🌟
            </p>
          ) : (
            <div>
              {comments.map(c => (
                <CommentBlock key={c.id} comment={c} authUser={authUser} courseId={id} onRefresh={loadComments} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
