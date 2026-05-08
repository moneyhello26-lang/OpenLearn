'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface CourseDetails {
  id: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  price: string;
  url: string;
  source: string;
  category: string;
  duration?: string;
  level?: string;
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

const MOCK_COURSES: CourseDetails[] = [
  {
    id: 'course-1',
    title: 'Введение в React',
    authors: ['Иван Петров'],
    description: 'Полный курс по React для начинающих разработчиков. Вы научитесь создавать современные веб-приложения с использованием React, TypeScript и лучших практик разработки.\n\nКурс включает:\n• Основы React и JSX\n• Компоненты и пропсы\n• State и жизненный цикл\n• Hooks (useState, useEffect, useContext)\n• Работа с формами\n• HTTP запросы\n• Маршрутизация\n• Создание полноценного приложения',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    url: '#',
    source: 'OpenLearn',
    category: 'Программирование',
    duration: '24 часа',
    level: 'Начинающий',
  },
  {
    id: 'course-2',
    title: 'Основы Python',
    authors: ['Анна Сидорова'],
    description: 'Изучите Python с нуля до продвинутого уровня. Курс подходит для абсолютных новичков и включает множество практических заданий.\n\nЧто вы изучите:\n• Синтаксис Python\n• Переменные и типы данных\n• Условные операторы и циклы\n• Функции и модули\n• Работа с файлами\n• ООП в Python\n• Исключения и обработка ошибок',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    url: '#',
    source: 'OpenLearn',
    category: 'Программирование',
    duration: '18 часов',
    level: 'Начинающий',
  },
  {
    id: 'course-3',
    title: 'UX/UI Дизайн',
    authors: ['Мария Иванова'],
    description: 'Научитесь создавать красивые и удобные пользовательские интерфейсы.\n\nКурс охватывает:\n• Принципы UX дизайна\n• Исследование пользователей\n• Wireframing и прототипирование\n• Работа с Figma\n• Цветовая теория и типографика\n• Адаптивный дизайн\n• Создание дизайн-систем',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    url: '#',
    source: 'OpenLearn',
    category: 'Дизайн',
    duration: '15 часов',
    level: 'Средний',
  },
];

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
            fontSize: '22px',
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (hover || value) ? '#f59e0b' : '#d1d5db',
            background: 'none',
            border: 'none',
            padding: '0 2px',
            transition: 'color 0.1s',
          }}
        >
          ★
        </button>
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
      <div style={{
        background: 'var(--surface)',
        border: '1.5px solid var(--gray)',
        borderRadius: '14px',
        padding: '14px 16px',
      }}>
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

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {comment.replies.map(reply => {
            const rInit = reply.user.name.slice(0, 2).toUpperCase();
            const rDate = new Date(reply.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            return (
              <div key={reply.id} style={{
                background: 'var(--teal-pale)',
                border: '1.5px solid var(--teal-light)',
                borderRadius: '12px',
                padding: '10px 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px',
                    background: 'var(--teal)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '11px', flexShrink: 0,
                  }}>{rInit}</div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text)' }}>{reply.user.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{rDate}</div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{reply.content}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply form */}
      {showReply && (
        <div style={{ marginLeft: '24px', marginTop: '8px' }}>
          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Ваш ответ..."
            rows={2}
            style={{
              width: '100%', padding: '10px 12px', borderRadius: '10px',
              border: '1.5px solid var(--teal-light)', fontSize: '13px',
              fontFamily: 'Sora, sans-serif', resize: 'none',
              background: 'var(--surface)', color: 'var(--text)',
            }}
          />
          <button
            onClick={handleSubmitReply}
            disabled={!replyText.trim() || submitting}
            style={{
              marginTop: '6px', padding: '7px 16px', borderRadius: '8px',
              background: 'var(--teal)', color: 'white', border: 'none',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', opacity: (!replyText.trim() || submitting) ? 0.5 : 1,
            }}
          >
            {submitting ? 'Отправка...' : 'Отправить'}
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
  const [favLoading, setFavLoading] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ userId: string; name: string; token: string } | null>(null);

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
    const found = MOCK_COURSES.find(c => c.id === id);
    setCourse(found || null);
    setLoading(false);
  }, [id]);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/course-comments?courseId=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.data) setComments(data.data);
    } catch {}
    setCommentsLoading(false);
  }, [id]);

  const loadRatings = useCallback(async () => {
    try {
      const res = await fetch(`/api/course-ratings?courseId=${encodeURIComponent(id)}`);
      const data = await res.json();
      setAvgRating(data.average || 0);
      setRatingCount(data.count || 0);
    } catch {}
  }, [id]);

  const checkFavorite = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/course-favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.data) {
        const found = data.data.some((f: any) => f.courseExtId === id);
        setIsFavorite(found);
      }
    } catch {}
  }, [id]);

  useEffect(() => {
    loadComments();
    loadRatings();
    checkFavorite();
  }, [loadComments, loadRatings, checkFavorite]);

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    if (!course) return;
    setFavLoading(true);
    try {
      const res = await fetch('/api/course-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          courseExtId: id,
          title: course.title,
          coverUrl: course.image,
          instructor: course.authors[0] || '',
        }),
      });
      const data = await res.json();
      setIsFavorite(data.favorited);
    } catch {}
    setFavLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    setSubmitting(true);
    try {
      // Submit rating
      await fetch('/api/course-ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseExtId: id, score: userRating }),
      });
      // Submit comment
      const res = await fetch('/api/course-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseExtId: id, content: newComment.trim() }),
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
    const token = localStorage.getItem('token');
    if (!token) { router.push('/auth'); return; }
    try {
      const res = await fetch('/api/course-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseExtId: id, content, parentId }),
      });
      if (res.ok) await loadComments();
    } catch {}
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '44px', height: '44px', border: '3px solid var(--teal-light)', borderTopColor: 'var(--teal)', borderRadius: '50%', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Загружаем курс...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎓</p>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px' }}>Курс не найден</h1>
          <Link href="/search" style={{ color: 'var(--teal)', fontWeight: 600 }}>← Вернуться к поиску</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Back */}
        <Link href="/search" style={{ color: 'var(--teal)', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
          ← Назад к поиску
        </Link>

        {/* Cover */}
        <div style={{
          borderRadius: '20px', overflow: 'hidden',
          border: '1.5px solid var(--gray)',
          background: 'var(--surface)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
            {course.image ? (
              <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--teal) 0%, var(--coral) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                🎓
              </div>
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
            }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                color: 'white', fontSize: '12px', fontWeight: 600, marginBottom: '8px',
              }}>
                🎓 {course.category}
              </span>
              <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'white', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.3)', fontFamily: 'DM Serif Display, serif' }}>
                {course.title}
              </h1>
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                👤 {course.authors.join(', ') || 'Преподаватель не указан'}
              </span>
              {course.duration && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>⏱ {course.duration}</span>}
              {course.level && <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>📊 {course.level}</span>}
              {avgRating > 0 && (
                <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: 600 }}>
                  ★ {avgRating.toFixed(1)} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({ratingCount})</span>
                </span>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <a
                href={course.url !== '#' ? course.url : undefined}
                onClick={course.url === '#' ? (e) => { e.preventDefault(); alert('Начинаем курс! Первая лекция скоро будет доступна.'); } : undefined}
                style={{
                  padding: '12px 28px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)',
                  color: 'white', fontWeight: 700, fontSize: '15px',
                  textDecoration: 'none', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(61,174,183,0.35)',
                  display: 'inline-block',
                }}
              >
                🚀 Начать курс
              </a>
              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                style={{
                  padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '14px',
                  border: '1.5px solid',
                  borderColor: isFavorite ? 'var(--coral)' : 'var(--gray)',
                  background: isFavorite ? 'var(--coral-light)' : 'var(--surface)',
                  color: isFavorite ? 'var(--coral-dark)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {isFavorite ? '❤️ В избранном' : '🤍 В избранное'}
              </button>
              <Link href="/favorites" style={{
                padding: '12px 20px', borderRadius: '12px', fontWeight: 600, fontSize: '14px',
                border: '1.5px solid var(--gray)', background: 'var(--surface)',
                color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-block',
              }}>
                📚 Избранное
              </Link>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{
          background: 'var(--surface)', border: '1.5px solid var(--gray)',
          borderRadius: '20px', padding: '24px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '14px' }}>О курсе</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {course.description}
          </p>
        </div>

        {/* Comments */}
        <div style={{
          background: 'var(--surface)', border: '1.5px solid var(--gray)',
          borderRadius: '20px', padding: '24px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '20px' }}>
            Отзывы и комментарии
            {ratingCount > 0 && (
              <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>
                ★ {avgRating.toFixed(1)} · {ratingCount} {ratingCount === 1 ? 'отзыв' : 'отзывов'}
              </span>
            )}
          </h2>

          {/* Add comment form */}
          <div style={{
            background: 'var(--bg)', border: '1.5px solid var(--gray)',
            borderRadius: '16px', padding: '18px', marginBottom: '24px',
          }}>
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
                  placeholder="Поделитесь впечатлением о курсе..."
                  rows={3}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '10px',
                    border: '1.5px solid var(--gray)', fontSize: '14px',
                    fontFamily: 'Sora, sans-serif', resize: 'none',
                    background: 'var(--surface)', color: 'var(--text)', marginBottom: '10px',
                  }}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submitting}
                  style={{
                    padding: '10px 22px', borderRadius: '10px',
                    background: 'var(--teal)', color: 'white',
                    border: 'none', fontWeight: 600, fontSize: '13px',
                    cursor: (!newComment.trim() || submitting) ? 'not-allowed' : 'pointer',
                    opacity: (!newComment.trim() || submitting) ? 0.5 : 1,
                    fontFamily: 'Sora, sans-serif',
                  }}
                >
                  {submitting ? 'Публикую...' : 'Опубликовать'}
                </button>
              </>
            ) : (
              <Link href="/auth" style={{
                display: 'inline-block', padding: '10px 20px', borderRadius: '10px',
                background: 'var(--teal)', color: 'white', fontWeight: 600, fontSize: '13px',
                textDecoration: 'none',
              }}>
                Войти
              </Link>
            )}
          </div>

          {/* Comments list */}
          {commentsLoading ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Загрузка...</p>
          ) : comments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px', fontSize: '14px' }}>
              Пока нет отзывов. Будьте первым! 🌟
            </p>
          ) : (
            <div>
              {comments.map(comment => (
                <CommentBlock
                  key={comment.id}
                  comment={comment}
                  currentUser={currentUser}
                  onReply={handleReply}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
