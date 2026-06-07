'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface User { 
  id: string; 
  name: string; 
  avatar: string | null; 
  bio: string | null; 
  createdAt: string;
  stats: {
    totalFavorites: number;
    courseFavorites: number;
    totalComments: number;
    totalRatings: number;
  };
  favorites: any[];
}
interface Review { id: string; content: string; createdAt: string; author: { id: string; name: string; avatar: string | null; } }

export default function PublicProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [friends, setFriends] = useState<{id: string, name: string, avatar: string|null}[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newReview, setNewReview] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);

  const [friendStatus, setFriendStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [friendBusy, setFriendBusy] = useState(false);

  const [authUser, setAuthUser] = useState<{ id: string; token: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      try { setAuthUser({ id: JSON.parse(stored).id, token }); } catch {}
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) setUser(await res.json());

        const rRes = await fetch(`/api/users/${id}/reviews`);
        if (rRes.ok) setReviews((await rRes.json()).data || []);

        const fListRes = await fetch(`/api/users/${id}/friends`);
        if (fListRes.ok) setFriends(await fListRes.json());

        if (authUser) {
          const fRes = await fetch('/api/friends', { headers: { Authorization: `Bearer ${authUser.token}` } });
          if (fRes.ok) {
            const data = await fRes.json();
            const isFriend = data.data.friends.some((f: any) => f.userId === id || f.friendId === id);
            if (isFriend) setFriendStatus('accepted');
            else {
              // Note: the api returns requests received. To know if we sent a request, we'd need another endpoint, 
              // but we can try sending and if it says "Already requested" we know it's pending.
            }
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    if (id) load();
    
    const interval = setInterval(async () => {
      if (!id) return;
      try {
        const fListRes = await fetch(`/api/users/${id}/friends`);
        if (fListRes.ok) setFriends(await fListRes.json());

        const rRes = await fetch(`/api/users/${id}/reviews`);
        if (rRes.ok) setReviews((await rRes.json()).data || []);

        if (authUser) {
          const fRes = await fetch('/api/friends', { headers: { Authorization: `Bearer ${authUser.token}` } });
          if (fRes.ok) {
            const data = await fRes.json();
            const isFriend = data.data.friends.some((f: any) => f.userId === id || f.friendId === id);
            if (isFriend) setFriendStatus('accepted');
          }
        }
      } catch (e) { console.error(e); }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [id, authUser]);

  const addFriend = async () => {
    if (!authUser) { router.push('/auth'); return; }
    setFriendBusy(true);
    try {
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authUser.token}` },
        body: JSON.stringify({ friendId: id })
      });
      if (res.ok || res.status === 201) setFriendStatus('pending');
      else {
        const e = await res.json();
        if (e.error === 'Already requested') setFriendStatus('pending');
        else alert('Error: ' + e.error);
      }
    } catch {}
    setFriendBusy(false);
  };

  const submitReview = async () => {
    if (!authUser) { router.push('/auth'); return; }
    if (!newReview.trim()) return;
    setReviewBusy(true);
    try {
      const res = await fetch(`/api/users/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authUser.token}` },
        body: JSON.stringify({ content: newReview.trim() })
      });
      if (res.ok) {
        const rev = await res.json();
        setReviews([rev, ...reviews]);
        setNewReview('');
      }
    } catch {}
    setReviewBusy(false);
  };

  const deleteReview = async (reviewId: string) => {
    if (!authUser) return;
    if (!confirm('Удалить отзыв?')) return;
    try {
      const res = await fetch(`/api/users/${id}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authUser.token}` }
      });
      if (res.ok) setReviews(reviews.filter(r => r.id !== reviewId));
    } catch {}
  };

  if (loading) return (
    <div className="min-h-screen pt-24 px-6 max-w-4xl mx-auto flex flex-col gap-12">
      <div className="flex gap-6 items-center">
        <div className="w-24 h-24 rounded-full skeleton" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-48 skeleton" />
          <div className="h-4 w-32 skeleton" />
        </div>
      </div>
    </div>
  );
  if (!user) return <div className="min-h-screen flex items-center justify-center text-white">Пользователь не найден</div>;

  const isSelf = authUser?.id === user.id;
  const joinedDate = new Date(user.createdAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto slide-up constellation-bg">
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-16 relative">
        <div className="profile-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1" style={{ letterSpacing: '-0.03em' }}>
            {user.name}
          </h1>
          <p className="text-[var(--glow-accent)] font-medium mb-3 flex items-center gap-2">
            <span className="text-muted text-xs font-normal">Участник с {joinedDate}</span>
          </p>
          {user.bio && (
            <p className="text-muted text-sm max-w-2xl leading-relaxed">{user.bio}</p>
          )}
        </div>
        {!isSelf && (
          <div className="mt-4 md:mt-0">
            {friendStatus === 'accepted' ? (
              <button disabled className="btn-secondary opacity-80 cursor-default">✓ В друзьях</button>
            ) : friendStatus === 'pending' ? (
              <button disabled className="btn-secondary opacity-80 cursor-default">⏳ Заявка отправлена</button>
            ) : (
              <button onClick={addFriend} disabled={friendBusy} className="btn-glow whitespace-nowrap">{friendBusy ? '...' : 'Добавить в друзья'}</button>
            )}
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 delay-1 slide-up">
        <span className="text-[var(--glow-accent)]">⚡</span> Статистика активности
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 delay-1 slide-up">
        <div className="stat-card group">
          <div className="stat-icon text-pink-400 group-hover:bg-pink-500/10 transition-colors">⭐</div>
          <div className="stat-value">{user.stats.totalFavorites}</div>
          <div className="stat-label">Избранных книг</div>
        </div>
        <div className="stat-card group">
          <div className="stat-icon text-blue-400 group-hover:bg-blue-500/10 transition-colors">🎓</div>
          <div className="stat-value">{user.stats.courseFavorites}</div>
          <div className="stat-label">Избранных курсов</div>
        </div>
        <div className="stat-card group">
          <div className="stat-icon text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">💬</div>
          <div className="stat-value">{user.stats.totalComments}</div>
          <div className="stat-label">Оставлено комментариев</div>
        </div>
        <div className="stat-card group">
          <div className="stat-icon text-amber-400 group-hover:bg-amber-500/10 transition-colors">🌟</div>
          <div className="stat-value">{user.stats.totalRatings}</div>
          <div className="stat-label">Поставлено оценок</div>
        </div>
      </div>

      <div className="profile-section delay-3 slide-up mb-16">
        <h2 className="text-xl font-bold tracking-tight mb-6">Избранное</h2>
        <div className="space-y-3">
          {user.favorites.length > 0 ? (
            user.favorites.map((item) => (
              <div key={item.id} className="history-item group cursor-pointer" onClick={() => router.push(`/details/${item.book.sourceId}`)}>
                <div className="book-cover">
                  {item.book.coverUrl ? <img src={item.book.coverUrl} alt="" /> : '⭐'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate text-white group-hover:text-[var(--glow-accent)] transition-colors">{item.book.title}</h4>
                  <p className="text-xs text-muted mt-1 truncate">{item.book.author}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl">
              <p className="text-muted text-sm">Нет избранных книг</p>
            </div>
          )}
        </div>
      </div>

      {/* Friends List */}
      <div className="profile-section delay-3 slide-up mb-16">
        <h2 className="text-xl font-bold tracking-tight mb-6">Друзья ({friends.length})</h2>
        {friends.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl">
            <p className="text-muted text-sm">Пока нет друзей</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {friends.map(friend => (
              <Link key={friend.id} href={`/user/${friend.id}`} className="group block">
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 flex flex-col items-center text-center hover:border-[var(--glow-accent)] transition-colors">
                  <div className="w-16 h-16 rounded-full mb-3 bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden">
                    {friend.avatar ? <img src={friend.avatar} className="w-full h-full object-cover" /> : friend.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-[var(--glow-accent)] transition-colors truncate w-full">{friend.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="profile-section delay-4 slide-up">
        <h2 className="text-xl font-bold tracking-tight mb-6 flex items-center gap-2">Отзывы о пользователе</h2>
        
        {!isSelf && authUser && (
          <div className="mb-8 p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl">
            <textarea 
              value={newReview} onChange={e => setNewReview(e.target.value)} 
              placeholder="Напишите пару добрых слов об этом пользователе..." 
              className="w-full p-4 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.2)] text-white resize-none outline-none focus:border-[var(--glow-accent)] transition-colors mb-3"
              rows={3}
            />
            <button onClick={submitReview} disabled={reviewBusy || !newReview.trim()} className="btn-glow text-sm px-6 py-2">
              {reviewBusy ? 'Отправка...' : 'Оставить отзыв'}
            </button>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-muted italic text-sm text-center py-6 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl">Пока нет ни одного отзыва.</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="p-5 rounded-2xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] transition-colors hover:bg-[rgba(255,255,255,0.04)]">
                <div className="flex justify-between items-start mb-3">
                  <Link href={`/user/${review.author.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                      {review.author.avatar ? <img src={review.author.avatar} className="w-full h-full rounded-full object-cover" /> : review.author.name.slice(0,2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">{review.author.name}</p>
                      <p className="text-xs text-muted mt-0.5">{new Date(review.createdAt).toLocaleDateString('ru-RU')}</p>
                    </div>
                  </Link>
                  {(isSelf || authUser?.id === review.author.id) && (
                    <button onClick={() => deleteReview(review.id)} className="text-red-400/80 hover:text-red-400 text-xs hover:underline transition-colors">
                      Удалить
                    </button>
                  )}
                </div>
                <p className="text-[rgba(255,255,255,0.8)] text-sm leading-relaxed mt-2">{review.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
