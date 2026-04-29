import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all'; // 'all', 'book', 'course'

  try {
    // Для демонстрации добавим несколько курсов (пока статично)
    const courses = [
      {
        id: 'course-1',
        title: 'Введение в React',
        authors: ['Иван Петров'],
        description: 'Полный курс по React для начинающих разработчиков. Вы научитесь создавать современные веб-приложения с использованием React, TypeScript и лучших практик разработки.',
        image: '',
        price: '$49',
        url: '/course/react-intro',
        source: 'OpenLearn',
        type: 'course',
        category: 'Программирование'
      },
      {
        id: 'course-2',
        title: 'Основы Python',
        authors: ['Анна Сидорова'],
        description: 'Изучите Python с нуля до продвинутого уровня. Курс включает основы программирования, работу с данными и создание приложений.',
        image: '',
        price: '$39',
        url: '/course/python-basics',
        source: 'OpenLearn',
        type: 'course',
        category: 'Программирование'
      }
    ];

    // Имитация книг из разных источников
    const mockBooks = [
      {
        id: 'book-1',
        title: 'Python для начинающих',
        authors: ['Джон Доу'],
        description: 'Полное руководство по изучению Python с примерами и упражнениями.',
        image: '',
        price: 'Бесплатно',
        url: 'https://example.com/python-book',
        source: 'ITBook.store',
        type: 'book',
        category: 'IT и программирование'
      },
      {
        id: 'book-2',
        title: 'Введение в алгоритмы',
        authors: ['Томас Кормен'],
        description: 'Классическое руководство по алгоритмам и структурам данных.',
        image: '',
        price: '$25',
        url: 'https://example.com/algorithms',
        source: 'Google Books',
        type: 'book',
        category: 'Наука и академические профессии'
      },
      {
        id: 'book-3',
        title: 'Физика для инженеров',
        authors: ['Ричард Фейнман'],
        description: 'Увлекательное введение в мир физики с практическими примерами.',
        image: '',
        price: 'Бесплатно',
        url: 'https://example.com/physics',
        source: 'SpringerOpen',
        type: 'book',
        category: 'Технические и STEM профессии'
      },
      {
        id: 'book-4',
        title: 'История России',
        authors: ['Василий Ключевский'],
        description: 'Классический труд по истории российской государственности.',
        image: '',
        price: 'Бесплатно',
        url: 'https://example.com/history',
        source: 'Project Gutenberg',
        type: 'book',
        category: 'Классика и гуманитарные науки'
      }
    ];

    let results: any[] = [];

    if (type === 'all' || type === 'book') {
      results.push(...mockBooks);
    }

    if (type === 'all' || type === 'course') {
      results.push(...courses);
    }

    // Фильтрация по запросу если есть
    if (query) {
      results = results.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    return NextResponse.json({
      results,
      total: results.length,
      query,
      type
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search' }, { status: 500 });
  }
}