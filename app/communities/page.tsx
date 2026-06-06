'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Community { id: string; name: string; description: string | null; coverUrl: string | null; _count: { members: number } }

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  const [authUser, setAuthUser] = useState<{ token: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthUser({ token });
    
    const load = async () => {
      try {
        const res = await fetch('/api/communities', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (res.ok) setCommunities((await res.json()).data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const createCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !createForm.name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authUser.token}` },
        body: JSON.stringify(createForm)
      });
      if (res.ok) {
        const newC = await res.json();
        setCommunities([{...newC, _count: { members: 1 }}, ...communities]);
        setShowCreate(false);
        setCreateForm({ name: '', description: '' });
      }
    } catch {}
    setCreating(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen pb-20 pt-24 bg-[var(--bg)] px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">Сообщества</h1>
            <p className="text-[var(--text-muted)] text-sm">Общайтесь, делитесь книгами и находите единомышленников</p>
          </div>
          {authUser && (
            <button onClick={() => setShowCreate(!showCreate)} className="btn-glow whitespace-nowrap">
              {showCreate ? 'Отмена' : '+ Создать сообщество'}
            </button>
          )}
        </div>

        {showCreate && authUser && (
          <form onSubmit={createCommunity} className="bg-[var(--surface)] border-[1.5px] border-[var(--teal-light)] rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Новое сообщество</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Название</label>
                <input required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} className="input" placeholder="Клуб любителей фантастики" />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Описание</label>
                <textarea value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})} className="input min-h-[80px] resize-none" placeholder="О чем это сообщество?" />
              </div>
              <button disabled={creating} className="btn-glow w-full md:w-auto">{creating ? 'Создаем...' : 'Создать'}</button>
            </div>
          </form>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-[var(--text-muted)] border-[1.5px] border-dashed border-[var(--gray)] rounded-2xl">
              Пока нет ни одного сообщества. Будьте первым!
            </div>
          )}
          {communities.map(c => (
            <Link key={c.id} href={`/communities/${c.id}`} className="block group">
              <div className="bg-[var(--surface)] border-[1.5px] border-[var(--gray)] rounded-2xl p-6 h-full transition-all group-hover:border-[var(--teal)] group-hover:shadow-[0_4px_16px_rgba(61,174,183,0.1)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xl font-bold mb-4">
                  {c.name.slice(0,1).toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-[var(--text)] mb-2 group-hover:text-[var(--teal)] transition-colors">{c.name}</h3>
                <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">{c.description || 'Нет описания'}</p>
                <div className="text-xs font-semibold text-[var(--teal)] bg-[var(--teal-pale)] w-fit px-3 py-1 rounded-full">
                  Участников: {c._count.members}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
