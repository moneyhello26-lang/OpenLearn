'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApi, apiCall } from '@/lib/hooks';

interface UserStats {
  booksRead: number;
  booksInProgress: number;
  totalFavorites: number;
  courseFavorites: number;
  totalComments: number;
  totalRatings: number;
  memberSince: string;
}

interface UserData {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
}

interface FavoriteItem {
  id: string;
  bookId: string;
  book: {
    title: string;
    author: string;
    coverUrl: string | null;
    sourceId: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });
  const [isSaving, setIsSaving] = useState(false);

  const [friends, setFriends] = useState<{id: string, name: string, avatar: string|null}[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  // Stats Data
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useApi<UserStats>('/api/users/me/stats');
  
  // Favorites
  const { data: favoritesData, loading: favoritesLoading } = useApi<{data: FavoriteItem[]}>('/api/favorites?limit=4');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Fetch full fresh user data
        const userData = await apiCall<UserData>('/api/users/me', { method: 'GET' });
        setUser(userData);
        setEditForm({ name: userData.name, bio: userData.bio || '' });

        const fListRes = await fetch(`/api/users/${userData.id}/friends`);
        if (fListRes.ok) setFriends(await fListRes.json());

        const rRes = await fetch(`/api/users/${userData.id}/reviews`);
        if (rRes.ok) setReviews((await rRes.json()).data || []);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    
    const interval = setInterval(async () => {
      const localUserStr = localStorage.getItem('user');
      if (!localUserStr) return;
      try {
        const u = JSON.parse(localUserStr);
        const fListRes = await fetch(`/api/users/${u.id}/friends`);
        if (fListRes.ok) setFriends(await fListRes.json());

        const rRes = await fetch(`/api/users/${u.id}/reviews`);
        if (rRes.ok) setReviews((await rRes.json()).data || []);
      } catch (error) {}
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChanged'));
    window.location.href = '/';
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updatedUser = await apiCall<UserData>('/api/users/me', {
        method: 'PUT',
        body: editForm
      });
      setUser(updatedUser);
      setIsEditing(false);
      
      // Update local storage user partial
      const localUserStr = localStorage.getItem('user');
      if (localUserStr) {
        const localUser = JSON.parse(localUserStr);
        localStorage.setItem('user', JSON.stringify({ ...localUser, name: updatedUser.name }));
        window.dispatchEvent(new Event('authChanged'));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 max-w-4xl mx-auto flex flex-col gap-12">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 rounded-full skeleton" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-48 skeleton" />
            <div className="h-4 w-32 skeleton" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-32 skeleton" />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 constellation-bg">
        <div className="glass-floating p-10 max-w-md w-full text-center rounded-[var(--radius)]">
          <div className="text-5xl mb-6">🔒</div>
          <h2 className="text-2xl font-semibold tracking-tight mb-3">Доступ ограничен</h2>
          <p className="text-muted text-sm mb-8">
            Войдите в свой аккаунт, чтобы получить доступ к персональному профилю и статистике обучения.
          </p>
          <Link href="/auth" className="btn-glow w-full">
            Войти в аккаунт
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name.slice(0, 2).toUpperCase();
  const joinedDate = stats?.memberSince 
    ? new Date(stats.memberSince).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    : 'Недавно';

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-5xl mx-auto slide-up constellation-bg">
      
      {/* 1. Hero Section */}
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
            {user.email}
            <span className="text-muted text-xs font-normal">· Участник с {joinedDate}</span>
          </p>
          {user.bio && (
            <p className="text-muted text-sm max-w-2xl leading-relaxed">{user.bio}</p>
          )}
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="btn-secondary whitespace-nowrap mt-4 md:mt-0"
        >
          Редактировать
        </button>
      </div>

      {/* 2. Stats Grid */}
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 delay-1 slide-up">
        <span className="text-[var(--glow-accent)]">⚡</span> Статистика обучения
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16 delay-1 slide-up">

        <div className="stat-card group">
          <div className="stat-icon text-pink-400 group-hover:bg-pink-500/10 transition-colors">⭐</div>
          <div className="stat-value">{statsLoading ? <div className="h-8 w-12 skeleton mb-2" /> : stats?.totalFavorites || 0}</div>
          <div className="stat-label">Избранных книг</div>
        </div>
        <div className="stat-card group">
          <div className="stat-icon text-blue-400 group-hover:bg-blue-500/10 transition-colors">🎓</div>
          <div className="stat-value">{statsLoading ? <div className="h-8 w-12 skeleton mb-2" /> : stats?.courseFavorites || 0}</div>
          <div className="stat-label">Избранных курсов</div>
        </div>
        <div className="stat-card group">
          <div className="stat-icon text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">💬</div>
          <div className="stat-value">{statsLoading ? <div className="h-8 w-12 skeleton mb-2" /> : stats?.totalComments || 0}</div>
          <div className="stat-label">Оставлено комментариев</div>
        </div>
        <div className="stat-card group">
          <div className="stat-icon text-amber-400 group-hover:bg-amber-500/10 transition-colors">🌟</div>
          <div className="stat-value">{statsLoading ? <div className="h-8 w-12 skeleton mb-2" /> : stats?.totalRatings || 0}</div>
          <div className="stat-label">Поставлено оценок</div>
        </div>
      </div>

      <div className="mb-16">
        {/* 4. Favorites Snippet */}
        <div className="profile-section delay-3 slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Избранное</h2>
            <Link href="/favorites" className="text-sm font-medium text-[var(--glow-accent)] hover:text-[var(--glow-secondary)] transition-colors">
              Показать всё &rarr;
            </Link>
          </div>
          
          <div className="space-y-3">
            {favoritesLoading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-20 skeleton" />)
            ) : favoritesData?.data && favoritesData.data.length > 0 ? (
              favoritesData.data.map((item) => (
                <div key={item.id} className="history-item group cursor-pointer" onClick={() => window.location.href = `/details/${item.book.sourceId}`}>
                  <div className="book-cover">
                    {item.book.coverUrl ? <img src={item.book.coverUrl} alt="" /> : '⭐'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate text-white group-hover:text-[var(--glow-accent)] transition-colors">{item.book.title}</h4>
                    <p className="text-xs text-muted mt-1 truncate">{item.book.author}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ♥
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
      </div>

      {/* Friends List */}
      <div className="profile-section delay-3 slide-up mb-16">
        <h2 className="text-xl font-bold tracking-tight mb-6">Ваши друзья ({friends.length})</h2>
        {friends.length === 0 ? (
          <div className="text-center p-6 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl">
            <p className="text-muted text-sm">У вас пока нет друзей</p>
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

      {/* Reviews */}
      <div className="profile-section delay-4 slide-up mb-16">
        <h2 className="text-xl font-bold tracking-tight mb-6">Отзывы о вас</h2>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-muted italic text-sm text-center py-6 border border-dashed border-[rgba(255,255,255,0.1)] rounded-xl">У вас пока нет ни одного отзыва.</p>
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
                </div>
                <p className="text-[rgba(255,255,255,0.8)] text-sm leading-relaxed mt-2">{review.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 text-center delay-4 slide-up">
        <button 
          onClick={handleLogout}
          className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-6 py-2 rounded-full hover:bg-red-500/10"
        >
          Выйти из аккаунта
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Настройки профиля</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Отображаемое имя</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">О себе</label>
                <textarea
                  className="input min-h-[100px] resize-none"
                  value={editForm.bio}
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  placeholder="Расскажите немного о своих интересах в обучении..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex-1"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-glow flex-1"
                >
                  {isSaving ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
