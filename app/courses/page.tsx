'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ALL_COURSES, COURSE_CATEGORIES, getCategoryCounts } from '@/lib/courses-data';
import type { CourseData } from '@/lib/courses-data';

/* ────────── Level badge colour map ────────── */
const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  'Начинающий': { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  'Средний':    { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  'Продвинутый':{ bg: 'rgba(239,68,68,0.15)',  text: '#EF4444' },
};

/* ────────── Category gradient map (for card accents) ────────── */
const CAT_GRADIENT: Record<string, string> = {
  languages:    'linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)',
  programming:  'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
  design:       'linear-gradient(135deg, #EC4899 0%, #F97316 100%)',
  science:      'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
  business:     'linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)',
  music:        'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
};

/* ══════════════════════════════════════════════════════════════
   Course Card Component
   ══════════════════════════════════════════════════════════════ */
function CourseCard({ course, isFav, onToggleFav, favBusy }: {
  course: CourseData;
  isFav: boolean;
  onToggleFav: (c: CourseData) => void;
  favBusy: boolean;
}) {
  const level = course.level ? LEVEL_COLORS[course.level] || LEVEL_COLORS['Начинающий'] : null;
  const gradient = CAT_GRADIENT[course.category] || CAT_GRADIENT.programming;

  return (
    <div
      id={`course-card-${course.id}`}
      className="course-card group"
      style={{
        background: 'linear-gradient(180deg, rgba(24,24,27,0.9) 0%, rgba(15,15,15,0.95) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'transform 0.35s cubic-bezier(.2,.8,.2,1), border-color 0.3s, box-shadow 0.3s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(-6px)';
        el.style.borderColor = 'rgba(255,255,255,0.15)';
        el.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(139,92,246,0.08)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = 'translateY(0)';
        el.style.borderColor = 'rgba(255,255,255,0.06)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* ── Image ── */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px' }}>🎓</div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,15,15,1) 0%, rgba(15,15,15,0.3) 40%, transparent 70%)' }} />

        {/* Top-right favourite button */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFav(course); }}
          disabled={favBusy}
          aria-label={isFav ? 'Удалить из избранного' : 'Добавить в избранное'}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            width: '38px', height: '38px', borderRadius: '12px',
            background: isFav ? 'rgba(236,72,153,0.25)' : 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            border: isFav ? '1px solid rgba(236,72,153,0.4)' : '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: favBusy ? 'wait' : 'pointer',
            transition: 'all 0.25s ease',
            fontSize: '18px',
          }}
        >
          {isFav ? '❤️' : '🤍'}
        </button>

        {/* Level badge */}
        {level && course.level && (
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            padding: '4px 12px', borderRadius: '20px',
            background: level.bg, backdropFilter: 'blur(8px)',
            color: level.text, fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.02em', textTransform: 'uppercase',
          }}>
            {course.level}
          </span>
        )}

        {/* Accent line at bottom of image */}
        <div style={{ position: 'absolute', bottom: 0, left: '20px', right: '20px', height: '2px', background: gradient, borderRadius: '2px', opacity: 0.6 }} />
      </div>

      {/* ── Content ── */}
      <Link href={`/course/${course.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ padding: '20px 20px 22px' }}>
          {/* Category chip */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              color: '#8A8F98', fontSize: '11px', fontWeight: 600,
            }}>
              {COURSE_CATEGORIES.find(c => c.id === course.category)?.icon}{' '}
              {COURSE_CATEGORIES.find(c => c.id === course.category)?.label || course.category}
            </span>
          </div>

          <h3 style={{
            fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '8px',
            lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.title}
          </h3>

          <p style={{
            fontSize: '13px', color: '#8A8F98', marginBottom: '16px',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
            lineHeight: 1.6,
          }}>
            {course.description.split('\n')[0]}
          </p>

          {/* Meta row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', fontSize: '12px', color: '#6B7280' }}>
            {course.authors[0] && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  width: '22px', height: '22px', borderRadius: '7px',
                  background: gradient, display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '10px', fontWeight: 800,
                }}>
                  {course.authors[0].charAt(0)}
                </span>
                <span style={{ color: '#9CA3AF' }}>{course.authors[0]}</span>
              </span>
            )}
            {course.duration && <span>⏱ {course.duration}</span>}
            {course.lessonsCount && <span>📖 {course.lessonsCount} уроков</span>}
          </div>

          {/* Price / CTA row */}
          <div style={{
            marginTop: '16px', paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: '14px', fontWeight: 700,
              background: 'linear-gradient(90deg, #10B981, #3B82F6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {course.price}
            </span>
            <span style={{
              fontSize: '12px', fontWeight: 600, color: '#A87FFB',
              display: 'flex', alignItems: 'center', gap: '4px',
              transition: 'gap 0.2s',
            }}>
              Подробнее <span style={{ transition: 'transform 0.2s' }}>→</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Courses Page
   ══════════════════════════════════════════════════════════════ */
export default function CoursesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const [favBusy, setFavBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  const categoryCounts = useMemo(() => getCategoryCounts(), []);

  /* ── Load favourites on mount ── */
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/course-favorites', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.data) {
          setFavIds(new Set((data.data as { courseExtId: string }[]).map(f => f.courseExtId)));
        }
      })
      .catch(() => {});
  }, []);

  /* ── Toggle favourite ── */
  const toggleFav = async (course: CourseData) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/auth';
      return;
    }
    setFavBusy(true);
    try {
      const res = await fetch('/api/course-favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          courseExtId: course.id,
          title: course.title,
          coverUrl: course.image,
          instructor: course.authors[0] || '',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavIds(prev => {
          const next = new Set(prev);
          if (data.favorited) next.add(course.id);
          else next.delete(course.id);
          return next;
        });
      }
    } catch (e) { console.error('toggleFav', e); }
    setFavBusy(false);
  };

  /* ── Filtered courses ── */
  const filteredCourses = useMemo(() => {
    let result = ALL_COURSES;
    if (activeCategory !== 'all') {
      result = result.filter(c => c.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.authors.some(a => a.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0A0A0C' }}>
      {/* ── Background ambience ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(99,102,241,0.5) 0%, transparent 45%),
                            radial-gradient(circle at 80% 70%, rgba(139,92,246,0.4) 0%, transparent 40%),
                            radial-gradient(circle at 50% 90%, rgba(236,72,153,0.3) 0%, transparent 35%)`
        }} />
        <div className="constellation-bg absolute inset-0 opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">

        {/* ════════════════════ Hero Header ════════════════════ */}
        <div className="text-center mb-14 slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[#A87FFB] animate-pulse" />
            <span className="text-xs font-medium text-[#8A8F98]">{ALL_COURSES.length} курсов доступно бесплатно</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
            <span className="text-white">Каталог </span>
            <span style={{
              background: 'linear-gradient(90deg, #A87FFB 0%, #D946EF 50%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>курсов</span>
          </h1>
          <p className="text-lg text-[#8A8F98] max-w-xl mx-auto leading-relaxed">
            Выберите направление и начните обучение прямо сейчас. Все курсы бесплатны и доступны без ограничений.
          </p>
        </div>

        {/* ════════════════════ Search ════════════════════ */}
        <div className="max-w-2xl mx-auto mb-10 slide-up delay-1">
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#6B7280] text-lg pointer-events-none">🔍</span>
            <input
              id="courses-search"
              type="text"
              placeholder="Поиск курсов по названию, автору или теме..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{
                paddingLeft: '48px', paddingRight: '20px',
                paddingTop: '16px', paddingBottom: '16px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '15px',
                width: '100%',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
            />
          </div>
        </div>

        {/* ════════════════════ Category pills ════════════════════ */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 slide-up delay-2">
          {COURSE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                id={`cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(168,127,251,0.4)' : 'rgba(255,255,255,0.08)',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(168,127,251,0.2) 0%, rgba(139,92,246,0.15) 100%)'
                    : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#D4BBFF' : '#8A8F98',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'inherit',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#8A8F98';
                  }
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  padding: '1px 7px', borderRadius: '8px',
                  background: isActive ? 'rgba(168,127,251,0.25)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#C4A8FF' : '#6B7280',
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ════════════════════ Results info ════════════════════ */}
        {searchQuery.trim() && (
          <div className="text-center mb-8">
            <p className="text-sm text-[#8A8F98]">
              {filteredCourses.length > 0
                ? <>Найдено <span className="text-white font-semibold">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'курс' : filteredCourses.length < 5 ? 'курса' : 'курсов'} по запросу «<span className="text-[#A87FFB]">{searchQuery}</span>»</>
                : <>Ничего не найдено по запросу «<span className="text-[#A87FFB]">{searchQuery}</span>»</>
              }
            </p>
          </div>
        )}

        {/* ════════════════════ Course Grid ════════════════════ */}
        {filteredCourses.length > 0 ? (
          <div
            className="slide-up delay-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredCourses.map((course, i) => (
              <div key={course.id} style={{ animationDelay: `${0.05 * i}s` }} className="fade-in" >
                <CourseCard
                  course={course}
                  isFav={favIds.has(course.id)}
                  onToggleFav={toggleFav}
                  favBusy={favBusy}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 slide-up">
            <div style={{
              width: '100px', height: '100px', borderRadius: '28px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', margin: '0 auto 20px',
            }}>
              🔍
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Курсы не найдены</h3>
            <p className="text-[#8A8F98] mb-6 max-w-md mx-auto">
              Попробуйте изменить поисковый запрос или выбрать другую категорию
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              style={{
                padding: '12px 28px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #A87FFB 0%, #8B5CF6 100%)',
                color: 'white', fontWeight: 600, fontSize: '14px',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        )}

        {/* ════════════════════ Bottom CTA ════════════════════ */}
        <div className="mt-20 text-center slide-up">
          <div style={{
            background: 'linear-gradient(180deg, rgba(24,24,27,0.6) 0%, rgba(15,15,15,0.6) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '24px', padding: '48px 32px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.15,
              background: 'radial-gradient(circle at 50% 0%, rgba(168,127,251,0.3), transparent 60%)',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Не нашли нужный курс?</h2>
              <p className="text-[#8A8F98] mb-8 max-w-lg mx-auto">
                Мы постоянно добавляем новые курсы. Расскажите нам, что бы вы хотели изучить, и мы добавим это в первую очередь.
              </p>
              <Link
                href="/ai-demo"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '14px 32px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #A87FFB 0%, #8B5CF6 100%)',
                  color: 'white', fontWeight: 600, fontSize: '15px',
                  textDecoration: 'none',
                  boxShadow: '0 0 30px rgba(139,92,246,0.3)',
                  transition: 'all 0.3s',
                }}
              >
                🤖 Спросить AI-ассистента
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
