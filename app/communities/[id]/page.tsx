'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface User { id: string; name: string; avatar: string | null; }
interface Message { id: string; content: string; bookLink: string | null; createdAt: string; user: User; }
interface Community { id: string; name: string; description: string | null; members: { user: User }[]; }

export default function CommunityPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [community, setCommunity] = useState<Community | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const [authUser, setAuthUser] = useState<{ id: string; token: string } | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        const res = await fetch(`/api/communities/${id}`);
        if (res.ok) {
          const c = await res.json();
          setCommunity(c);
          if (authUser && c.members.some((m: any) => m.user.id === authUser.id)) {
            setIsMember(true);
            const mRes = await fetch(`/api/communities/${id}/messages`);
            if (mRes.ok) setMessages((await mRes.json()).data || []);
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    if (id) load();
  }, [id, authUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const joinCommunity = async () => {
    if (!authUser) { router.push('/auth'); return; }
    setJoining(true);
    try {
      const res = await fetch(`/api/communities/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authUser.token}` }
      });
      if (res.ok) {
        setIsMember(true);
        const mRes = await fetch(`/api/communities/${id}/messages`);
        if (mRes.ok) setMessages((await mRes.json()).data || []);
      }
    } catch {}
    setJoining(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !isMember || !newMessage.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/communities/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authUser.token}` },
        body: JSON.stringify({ content: newMessage.trim() })
      });
      if (res.ok) {
        const m = await res.json();
        setMessages([...messages, m]);
        setNewMessage('');
      }
    } catch {}
    setSending(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full" /></div>;
  if (!community) return <div className="min-h-screen flex items-center justify-center">Сообщество не найдено</div>;

  return (
    <div className="min-h-screen pt-24 pb-8 bg-[var(--bg)] px-6">
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-[var(--surface)] border-[1.5px] border-[var(--gray)] rounded-2xl overflow-hidden shadow-sm">
        
        <div className="p-6 border-b-[1.5px] border-[var(--gray)] flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--bg)]">
          <div className="flex items-center gap-4">
            <Link href="/communities" className="text-[var(--text-muted)] hover:text-[var(--teal)] transition-colors">← Назад</Link>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)]">{community.name}</h1>
              <p className="text-[var(--text-muted)] text-sm">{community.members.length} участников</p>
            </div>
          </div>
          {!isMember && (
            <button onClick={joinCommunity} disabled={joining} className="btn-glow">
              {joining ? 'Вступаем...' : 'Вступить в сообщество'}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[var(--bg)]">
          {!isMember ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-[var(--surface)] border-[1.5px] border-[var(--gray)] rounded-2xl flex items-center justify-center text-2xl mb-4">🔒</div>
              <p className="mb-2 font-bold text-[var(--text)]">Только для участников</p>
              <p className="text-sm leading-relaxed">Вступите в сообщество, чтобы читать сообщения и общаться с другими любителями книг.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-[var(--text-muted)] py-10 italic">
              Сообщений пока нет. Напишите первым!
            </div>
          ) : (
            messages.map((m, i) => {
              const isOwn = m.user.id === authUser?.id;
              const showAvatar = i === 0 || messages[i-1].user.id !== m.user.id;
              
              return (
                <div key={m.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  {showAvatar ? (
                    <Link href={`/user/${m.user.id}`} className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1 hover:opacity-80">
                      {m.user.avatar ? <img src={m.user.avatar} className="w-full h-full rounded-full object-cover" /> : m.user.name.slice(0,2).toUpperCase()}
                    </Link>
                  ) : <div className="w-8 shrink-0" />}
                  
                  <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                    {showAvatar && <span className="text-xs text-[var(--text-muted)] mb-1 mx-1">{m.user.name}</span>}
                    <div className={`px-4 py-2.5 rounded-2xl ${isOwn ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-[var(--surface)] border-[1.5px] border-[var(--gray)] text-[var(--text)] rounded-tl-none'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      {m.bookLink && (
                        <a href={m.bookLink} className={`block mt-2 text-xs p-2 rounded-lg ${isOwn ? 'bg-teal-700 hover:bg-teal-800' : 'bg-[var(--teal-pale)] text-[var(--teal-dark)] hover:bg-[var(--teal-light)]'} transition-colors font-semibold`}>
                          📚 Открыть книгу
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {isMember && (
          <form onSubmit={sendMessage} className="p-4 border-t-[1.5px] border-[var(--gray)] bg-[var(--surface)] flex gap-2">
            <input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)} 
              placeholder="Написать сообщение..." 
              className="flex-1 input rounded-full py-3 px-5 text-sm"
              disabled={sending}
            />
            <button disabled={!newMessage.trim() || sending} className="bg-[var(--teal)] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--teal-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="transform rotate-[-45deg] ml-1 mb-1">➔</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
