export interface CourseData {
  id: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  price: string;
  category: string;
  duration?: string;
  level?: string;
  lessonsCount?: number;
  tags?: string[];
}

export const COURSE_CATEGORIES = [
  { id: 'all', label: 'Все курсы', icon: '✨' },
  { id: 'languages', label: 'Языки', icon: '🌍' },
  { id: 'programming', label: 'Программирование', icon: '💻' },
  { id: 'design', label: 'Дизайн', icon: '🎨' },
  { id: 'science', label: 'Наука', icon: '🔬' },
  { id: 'business', label: 'Бизнес', icon: '📊' },
  { id: 'music', label: 'Музыка', icon: '🎵' },
] as const;

export const ALL_COURSES: CourseData[] = [
  // ── Languages ──────────────────────────────────────────────
  {
    id: 'course-eng-beginner',
    title: 'Английский язык: с нуля до A2',
    authors: ['Алия Нурланова'],
    description:
      'Полный курс английского языка для начинающих. Вы освоите базовую грамматику, научитесь строить предложения, понимать простые тексты и вести повседневные диалоги.\n\nКурс включает:\n• Алфавит и произношение\n• Базовая грамматика (Present Simple, Past Simple)\n• 1500+ слов повседневной лексики\n• Аудирование и диалоги\n• Практические задания и тесты\n• Разговорные клубы',
    image: 'https://images.unsplash.com/photo-1543109740-4bdb38fda756?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'languages',
    duration: '36 часов',
    level: 'Начинающий',
    lessonsCount: 48,
    tags: ['английский', 'A2', 'грамматика'],
  },
  {
    id: 'course-eng-advanced',
    title: 'Английский язык: B2–C1 Advanced',
    authors: ['Дмитрий Волков'],
    description:
      'Продвинутый курс английского для уверенных пользователей. Погружение в идиомы, сложную грамматику, академическое письмо и подготовку к IELTS/TOEFL.\n\n• Advanced Grammar (Conditionals, Inversion)\n• Academic Writing & Essays\n• Listening to native speakers\n• IELTS Speaking practice\n• Business English module',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'languages',
    duration: '42 часа',
    level: 'Продвинутый',
    lessonsCount: 56,
    tags: ['английский', 'IELTS', 'advanced'],
  },
  {
    id: 'course-kazakh',
    title: 'Қазақ тілі: разговорный курс',
    authors: ['Айгерим Бекболатова'],
    description:
      'Интерактивный курс казахского языка с упором на разговорную практику. Подходит для начинающих и тех, кто хочет улучшить навыки общения.\n\n• Фонетика и произношение\n• Бытовые диалоги\n• Грамматика (падежи, времена)\n• Культура и традиции\n• Песни и стихи для запоминания',
    image: 'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'languages',
    duration: '28 часов',
    level: 'Начинающий',
    lessonsCount: 35,
    tags: ['казахский', 'разговорный', 'культура'],
  },
  {
    id: 'course-german',
    title: 'Немецкий язык: от A1 до B1',
    authors: ['Елена Шмидт'],
    description:
      'Системный курс немецкого языка. От первых слов до уверенного общения в путешествиях и на работе.\n\n• Грамматика по уровням\n• Аудио от носителей языка\n• Деловой немецкий\n• Подготовка к Goethe-Zertifikat',
    image: 'https://images.unsplash.com/photo-1527866959252-deab85ef7d1b?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'languages',
    duration: '32 часа',
    level: 'Начинающий',
    lessonsCount: 40,
    tags: ['немецкий', 'Goethe', 'B1'],
  },

  // ── Programming ────────────────────────────────────────────
  {
    id: 'course-1',
    title: 'Введение в React',
    authors: ['Иван Петров'],
    description:
      'Полный курс по React для начинающих разработчиков. Вы научитесь создавать современные веб-приложения с использованием React, TypeScript и лучших практик разработки.\n\nКурс включает:\n• Основы React и JSX\n• Компоненты и пропсы\n• State и жизненный цикл\n• Hooks (useState, useEffect, useContext)\n• HTTP запросы и маршрутизация\n• Создание полноценного приложения',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'programming',
    duration: '24 часа',
    level: 'Начинающий',
    lessonsCount: 32,
    tags: ['react', 'javascript', 'frontend'],
  },
  {
    id: 'course-2',
    title: 'Основы Python',
    authors: ['Анна Сидорова'],
    description:
      'Изучите Python с нуля до продвинутого уровня.\n\n• Синтаксис Python\n• Переменные и типы данных\n• Условные операторы и циклы\n• Функции и модули\n• Работа с файлами\n• ООП в Python\n• Исключения и обработка ошибок',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'programming',
    duration: '18 часов',
    level: 'Начинающий',
    lessonsCount: 24,
    tags: ['python', 'backend', 'ООП'],
  },
  {
    id: 'course-fullstack',
    title: 'Full-Stack JavaScript',
    authors: ['Артём Касымов'],
    description:
      'Станьте full-stack разработчиком: от фронтенда на React до бэкенда на Node.js + PostgreSQL.\n\n• HTML/CSS/JS основы\n• React + Next.js\n• Node.js + Express\n• PostgreSQL + Prisma\n• Деплой на Vercel\n• REST API и аутентификация',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'programming',
    duration: '60 часов',
    level: 'Средний',
    lessonsCount: 78,
    tags: ['fullstack', 'node.js', 'react'],
  },

  // ── Design ─────────────────────────────────────────────────
  {
    id: 'course-3',
    title: 'UX/UI Дизайн',
    authors: ['Мария Иванова'],
    description:
      'Научитесь создавать красивые и удобные пользовательские интерфейсы.\n\n• Принципы UX дизайна\n• Wireframing и прототипирование\n• Работа с Figma\n• Цветовая теория и типографика\n• Адаптивный дизайн',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'design',
    duration: '15 часов',
    level: 'Средний',
    lessonsCount: 20,
    tags: ['figma', 'UI', 'прототипирование'],
  },
  {
    id: 'course-graphic',
    title: 'Графический дизайн: основы',
    authors: ['Камила Ахметова'],
    description:
      'Изучите принципы графического дизайна и создавайте визуальный контент профессионального уровня.\n\n• Композиция и сетки\n• Работа с цветом\n• Типографика\n• Adobe Illustrator\n• Создание логотипов и брендинга',
    image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'design',
    duration: '20 часов',
    level: 'Начинающий',
    lessonsCount: 26,
    tags: ['illustrator', 'логотипы', 'брендинг'],
  },

  // ── Science ────────────────────────────────────────────────
  {
    id: 'course-math',
    title: 'Математика для ЕНТ',
    authors: ['Нурлан Сагинбаев'],
    description:
      'Полная подготовка к математической части ЕНТ. Все темы от алгебры до стереометрии с разбором реальных заданий.\n\n• Алгебра и функции\n• Геометрия и стереометрия\n• Тригонометрия\n• Комбинаторика и вероятность\n• 500+ задач с разбором\n• Пробные тесты',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'science',
    duration: '40 часов',
    level: 'Средний',
    lessonsCount: 52,
    tags: ['ЕНТ', 'алгебра', 'геометрия'],
  },
  {
    id: 'course-physics',
    title: 'Физика: механика и термодинамика',
    authors: ['Олег Борисов'],
    description:
      'Глубокое погружение в классическую механику и термодинамику. Курс для школьников и абитуриентов.\n\n• Кинематика и динамика\n• Законы сохранения\n• Колебания и волны\n• Термодинамика\n• Лабораторные работы',
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'science',
    duration: '30 часов',
    level: 'Средний',
    lessonsCount: 38,
    tags: ['физика', 'механика', 'ЕНТ'],
  },
  {
    id: 'course-biology',
    title: 'Биология: клетка и генетика',
    authors: ['Дана Мухамеджанова'],
    description:
      'Курс по молекулярной биологии и генетике. Идеально для подготовки к экзаменам и олимпиадам.\n\n• Строение клетки\n• ДНК и РНК\n• Генетика и наследственность\n• Эволюция\n• Экология и биосфера',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'science',
    duration: '22 часа',
    level: 'Средний',
    lessonsCount: 28,
    tags: ['биология', 'генетика', 'клетка'],
  },

  // ── Business ───────────────────────────────────────────────
  {
    id: 'course-startup',
    title: 'Стартап: от идеи до запуска',
    authors: ['Тимур Алиев'],
    description:
      'Практический курс по созданию стартапа. Вы пройдёте все этапы от валидации идеи до первых клиентов.\n\n• Customer Development\n• MVP и прототипирование\n• Бизнес-модель Canvas\n• Маркетинг и продажи\n• Привлечение инвестиций\n• Юридические аспекты',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'business',
    duration: '16 часов',
    level: 'Начинающий',
    lessonsCount: 20,
    tags: ['стартап', 'MVP', 'бизнес'],
  },
  {
    id: 'course-marketing',
    title: 'Digital-маркетинг',
    authors: ['Сара Ким'],
    description:
      'Освойте инструменты цифрового маркетинга: от SMM до контекстной рекламы.\n\n• Основы маркетинга\n• SMM и контент-стратегия\n• Google Ads и таргетинг\n• Email-маркетинг\n• Аналитика и метрики',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'business',
    duration: '14 часов',
    level: 'Начинающий',
    lessonsCount: 18,
    tags: ['маркетинг', 'SMM', 'реклама'],
  },

  // ── Music ──────────────────────────────────────────────────
  {
    id: 'course-guitar',
    title: 'Гитара с нуля',
    authors: ['Алексей Петренко'],
    description:
      'Научитесь играть на гитаре за 30 дней. Курс для полных новичков с пошаговыми видеоуроками.\n\n• Основы аккордов\n• Бой и перебор\n• 20 популярных песен\n• Чтение табулатур\n• Настройка гитары',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'music',
    duration: '12 часов',
    level: 'Начинающий',
    lessonsCount: 30,
    tags: ['гитара', 'аккорды', 'песни'],
  },
  {
    id: 'course-music-theory',
    title: 'Теория музыки',
    authors: ['Жанна Искакова'],
    description:
      'Разберитесь в музыкальной теории: от нот до гармонии. Полезно для любого музыканта.\n\n• Нотная грамота\n• Ритм и размер\n• Интервалы и аккорды\n• Тональности и лады\n• Гармония и композиция',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=600&h=400&fit=crop',
    price: 'Бесплатно',
    category: 'music',
    duration: '10 часов',
    level: 'Начинающий',
    lessonsCount: 15,
    tags: ['теория', 'ноты', 'гармония'],
  },
];

/** Lookup a single course by its id */
export function getCourseById(id: string): CourseData | undefined {
  return ALL_COURSES.find((c) => c.id === id);
}

/** Get distinct category counts */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = { all: ALL_COURSES.length };
  for (const c of ALL_COURSES) {
    counts[c.category] = (counts[c.category] || 0) + 1;
  }
  return counts;
}
