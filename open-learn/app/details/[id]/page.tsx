'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ItemDetails {
  id: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  price: string;
  url: string;
  source: string;
  type: 'book' | 'course';
  category: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  rating: number;
  date: string;
}

export default function DetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<ItemDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    // Имитация загрузки данных (в реальном приложении здесь будет API запрос)
    const fetchItem = async () => {
      setLoading(true);
      try {
        // Для демонстрации используем статические данные
        // В реальном приложении здесь будет запрос к API
        const mockData: ItemDetails = {
          id,
          title: id.startsWith('course-') ? 'Введение в React' : 'Python для начинающих',
          authors: id.startsWith('course-') ? ['Иван Петров'] : ['Анна Сидорова'],
          description: id.startsWith('course-')
            ? 'Полный курс по React для начинающих разработчиков. Вы научитесь создавать современные веб-приложения с использованием React, TypeScript и лучших практик разработки.'
            : 'Эта книга поможет вам освоить основы программирования на Python. От простых концепций до сложных алгоритмов - все объяснено доступным языком.',
          image: '',
          price: id.startsWith('course-') ? '$49' : 'Бесплатно',
          url: id.startsWith('course-') ? '/course/react-intro' : 'https://example.com/book',
          source: id.startsWith('course-') ? 'OpenLearn' : 'ITBook.store',
          type: id.startsWith('course-') ? 'course' : 'book',
          category: 'Программирование'
        };

        setItem(mockData);

        // Имитация комментариев
        const mockComments: Comment[] = [
          {
            id: '1',
            user: 'Алексей М.',
            text: 'Отличный материал! Очень полезно для начинающих.',
            rating: 5,
            date: '2024-01-15'
          },
          {
            id: '2',
            user: 'Мария К.',
            text: 'Хорошо структурировано, но хотелось бы больше практических заданий.',
            rating: 4,
            date: '2024-01-10'
          }
        ];
        setComments(mockComments);

      } catch (error) {
        console.error('Error fetching item:', error);
      }
      setLoading(false);
    };

    fetchItem();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Материал не найден</h1>
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
              <div className="w-48 h-64 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg shrink-0 flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-white font-bold text-4xl">
                    {item.type === 'book' ? '📚' : '🎓'}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{item.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.type === 'book'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {item.type === 'book' ? 'Книга' : 'Курс'}
                    </span>
                  </div>

                  <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Автор{item.authors.length > 1 ? 'ы' : ''}: {item.authors.join(', ') || 'Не указан'}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-zinc-500">📚 {item.category}</span>
                    <span className="text-zinc-500">Источник: {item.source}</span>
                    {averageRating > 0 && (
                      <span className="text-yellow-500">
                        ⭐ {averageRating.toFixed(1)} ({comments.length} отзывов)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-blue-600">{item.price}</span>
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
                  {item.type === 'book' && item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      📖 Читать книгу
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Описание</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.description}</p>
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
                  placeholder="Напишите ваш отзыв..."
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