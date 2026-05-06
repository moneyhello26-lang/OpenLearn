'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
  type: 'course';
  category: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  rating: number;
  date: string;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    // Имитация загрузки данных курса
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Имитация данных курсов (в реальном приложении здесь будет API запрос)
        const mockCourses: CourseDetails[] = [
          {
            id: 'course-1',
            title: 'Введение в React',
            authors: ['Иван Петров'],
            description: 'Полный курс по React для начинающих разработчиков. Вы научитесь создавать современные веб-приложения с использованием React, TypeScript и лучших практик разработки. Курс включает:\n\n• Основы React и JSX\n• Компоненты и пропсы\n• State и жизненный цикл\n• Hooks (useState, useEffect, useContext)\n• Работа с формами\n• HTTP запросы\n• Маршрутизация\n• Создание полноценного приложения\n\nПо окончании курса вы сможете создавать современные React приложения.',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
            price: 'Бесплатно',
            url: '/course/react-intro',
            source: 'OpenLearn',
            type: 'course',
            category: 'Программирование'
          },
          {
            id: 'course-2',
            title: 'Основы Python',
            authors: ['Анна Сидорова'],
            description: 'Изучите Python с нуля до продвинутого уровня. Курс включает:\n\n• Синтаксис Python\n• Переменные и типы данных\n• Условные операторы и циклы\n• Функции и модули\n• Работа с файлами\n• Объектно-ориентированное программирование\n• Работа с данными (списки, словари, множества)\n• Исключения и обработка ошибок\n• Создание приложений\n\nКурс подходит для абсолютных новичков и включает множество практических заданий.',
            image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=300&fit=crop',
            price: 'Бесплатно',
            url: '/course/python-basics',
            source: 'OpenLearn',
            type: 'course',
            category: 'Программирование'
          },
          {
            id: 'course-3',
            title: 'UX/UI Дизайн',
            authors: ['Мария Иванова'],
            description: 'Научитесь создавать красивые и удобные пользовательские интерфейсы. Курс охватывает:\n\n• Принципы UX дизайна\n• Исследование пользователей\n• Создание пользовательских персонажей\n• Карты пользовательского пути\n• Wireframing и прототипирование\n• Работа с Figma\n• Цветовая теория и типографика\n• Адаптивный дизайн\n• Создание дизайн-систем\n\nКурс включает практические проекты и портфолио.',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
            price: 'Бесплатно',
            url: '/course/ui-design',
            source: 'OpenLearn',
            type: 'course',
            category: 'Дизайн'
          }
        ];

        const foundCourse = mockCourses.find(c => c.id === id);
        setCourse(foundCourse || null);

        // Имитация комментариев
        const mockComments: Comment[] = [
          {
            id: '1',
            user: 'Алексей М.',
            text: 'Отличный курс! Материал подается очень доступно, много практики.',
            rating: 5,
            date: '2024-01-15'
          },
          {
            id: '2',
            user: 'Мария К.',
            text: 'Очень полезный курс для начинающих. Понравилось, что есть домашние задания.',
            rating: 4,
            date: '2024-01-10'
          },
          {
            id: '3',
            user: 'Дмитрий П.',
            text: 'Хорошая структура курса. Жду продолжения с более сложными темами.',
            rating: 5,
            date: '2024-01-08'
          }
        ];
        setComments(mockComments);

      } catch (error) {
        console.error('Error fetching course:', error);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [id]);

  const handleAddToFavorites = () => {
    setIsFavorite(!isFavorite);
    // Здесь будет логика добавления в избранное
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: 'Текущий пользователь', // В реальном приложении будет имя пользователя
        text: newComment,
        rating,
        date: new Date().toISOString().split('T')[0]
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setRating(5);
    }
  };

  const handleStartCourse = () => {
    // Здесь будет логика начала курса
    alert('Курс начат! Перенаправляем на первую лекцию...');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Курс не найден</h1>
          <Link href="/search" className="text-blue-600 hover:text-blue-700">
            Вернуться к поиску
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = comments.length > 0
    ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length
    : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start gap-6">
              <div className="w-48 h-64 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg shrink-0 flex items-center justify-center overflow-hidden">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-4xl">
                    🎓
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{course.title}</h1>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Курс
                    </span>
                  </div>

                  <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Преподаватель{course.authors.length > 1 ? 'и' : ''}: {course.authors.join(', ') || 'Не указан'}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-zinc-500">📚 {course.category}</span>
                    <span className="text-zinc-500">Источник: {course.source}</span>
                    {averageRating > 0 && (
                      <span className="text-yellow-500">
                        ⭐ {averageRating.toFixed(1)} ({comments.length} отзывов)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-600">{course.price}</span>
                  <button
                    onClick={handleAddToFavorites}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      isFavorite
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600'
                    }`}
                  >
                    {isFavorite ? '❤️ В избранном' : '🤍 Добавить в избранное'}
                  </button>
                  <button
                    onClick={handleStartCourse}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    🚀 Начать курс
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">О курсе</h2>
            <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">{course.description}</div>
          </div>

          {/* Course Content Preview */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Что вы изучите</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Модуль 1: Основы</h3>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Введение в тему</li>
                  <li>• Базовые концепции</li>
                  <li>• Практические задания</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Модуль 2: Продвинутые темы</h3>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  <li>• Глубокое изучение</li>
                  <li>• Реальные проекты</li>
                  <li>• Финальное задание</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">Отзывы и комментарии</h2>

            {/* Add Comment */}
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Добавить отзыв</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Рейтинг
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 звезд</option>
                    <option value={4}>⭐⭐⭐⭐ 4 звезды</option>
                    <option value={3}>⭐⭐⭐ 3 звезды</option>
                    <option value={2}>⭐⭐ 2 звезды</option>
                    <option value={1}>⭐ 1 звезда</option>
                  </select>
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Напишите ваш отзыв о курсе..."
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 resize-none"
                />

                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  Опубликовать отзыв
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-zinc-500 dark:text-zinc-400 text-center py-8">
                  Пока нет отзывов. Будьте первым!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50">{comment.user}</span>
                        <span className="text-yellow-500">
                          {'⭐'.repeat(comment.rating)}
                        </span>
                      </div>
                      <span className="text-sm text-zinc-500">{comment.date}</span>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}