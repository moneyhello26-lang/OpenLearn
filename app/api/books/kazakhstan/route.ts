import { NextRequest, NextResponse } from 'next/server';

const subjectSlug: Record<string, string> = {
  'Математика': 'matematika',
  'Алгебра': 'algebra',
  'Геометрия': 'geometriya',
  'Физика': 'fizika',
  'Информатика': 'informatika',
};

function okulykUrl(grade: number, subjectKey: string) {
  const slug = subjectSlug[subjectKey] || subjectKey.toLowerCase();
  return `https://okulyk.com/${grade}-klass/${slug}-${grade}/`;
}

const KZ_TEXTBOOKS = [
    id: 'kz-math-5-ru', title: 'Математика. 5 класс',
    authors: ['Акпаева А.Б.', 'Ибраева А.Т.'],
    description: 'Учебник математики для 5 класса общеобразовательных школ Казахстана. Натуральные числа, дроби, проценты, геометрические фигуры.',
    grade: 5, subject: 'Математика', language: 'Русский',
  },
  {
    id: 'kz-math-6-ru', title: 'Математика. 6 класс',
    authors: ['Акпаева А.Б.', 'Ибраева А.Т.'],
    description: 'Рациональные числа, пропорции, уравнения, геометрия.',
    grade: 6, subject: 'Математика', language: 'Русский',
  },
  {
    id: 'kz-algebra-7-ru', title: 'Алгебра. 7 класс',
    authors: ['Абылкасымова А.Е.', 'Жумагулов Б.Т.'],
    description: 'Алгебраические выражения, линейные уравнения и неравенства, системы уравнений, функции.',
    grade: 7, subject: 'Алгебра', language: 'Русский',
  },
  {
    id: 'kz-algebra-8-ru', title: 'Алгебра. 8 класс',
    authors: ['Абылкасымова А.Е.'],
    description: 'Квадратные уравнения, квадратные корни, степени, функции.',
    grade: 8, subject: 'Алгебра', language: 'Русский',
  },
  {
    id: 'kz-algebra-9-ru', title: 'Алгебра. 9 класс',
    authors: ['Абылкасымова А.Е.'],
    description: 'Квадратичная функция, тригонометрия, арифметическая и геометрическая прогрессии.',
    grade: 9, subject: 'Алгебра', language: 'Русский',
  },
  {
    id: 'kz-algebra-10-ru', title: 'Алгебра и начала анализа. 10 класс',
    authors: ['Жумагулов Б.Т.', 'Абылкасымова А.Е.'],
    description: 'Производная, пределы, тригонометрические уравнения, логарифмы.',
    grade: 10, subject: 'Алгебра', language: 'Русский',
  },
  {
    id: 'kz-algebra-11-ru', title: 'Алгебра и начала анализа. 11 класс',
    authors: ['Жумагулов Б.Т.', 'Абылкасымова А.Е.'],
    description: 'Интеграл, уравнения, неравенства. Подготовка к ЕНТ.',
    grade: 11, subject: 'Алгебра', language: 'Русский',
  },
  // ===== ГЕОМЕТРИЯ =====
  {
    id: 'kz-geometry-7-ru', title: 'Геометрия. 7 класс',
    authors: ['Шыныбеков А.Н.'],
    description: 'Геометрические фигуры, треугольники, параллельные прямые, доказательства теорем.',
    grade: 7, subject: 'Геометрия', language: 'Русский',
  },
  {
    id: 'kz-geometry-8-ru', title: 'Геометрия. 8 класс',
    authors: ['Шыныбеков А.Н.'],
    description: 'Четырёхугольники, площади, подобие треугольников, теорема Пифагора.',
    grade: 8, subject: 'Геометрия', language: 'Русский',
  },
  {
    id: 'kz-geometry-9-ru', title: 'Геометрия. 9 класс',
    authors: ['Шыныбеков А.Н.'],
    description: 'Векторы, координаты, окружность, многоугольники.',
    grade: 9, subject: 'Геометрия', language: 'Русский',
  },
  {
    id: 'kz-geometry-10-ru', title: 'Геометрия. 10 класс',
    authors: ['Шыныбеков А.Н.'],
    description: 'Стереометрия: прямые и плоскости, многогранники.',
    grade: 10, subject: 'Геометрия', language: 'Русский',
  },
  {
    id: 'kz-geometry-11-ru', title: 'Геометрия. 11 класс',
    authors: ['Шыныбеков А.Н.'],
    description: 'Тела вращения, объёмы, координаты в пространстве.',
    grade: 11, subject: 'Геометрия', language: 'Русский',
  },
  // ===== ФИЗИКА =====
  {
    id: 'kz-physics-7-ru', title: 'Физика. 7 класс',
    authors: ['Туякбаев Б.К.'],
    description: 'Введение в физику, механическое движение, силы, давление, тепловые явления.',
    grade: 7, subject: 'Физика', language: 'Русский',
  },
  {
    id: 'kz-physics-8-ru', title: 'Физика. 8 класс',
    authors: ['Туякбаев Б.К.'],
    description: 'Тепловые явления, электрический ток, электромагнетизм, оптика.',
    grade: 8, subject: 'Физика', language: 'Русский',
  },
  {
    id: 'kz-physics-9-ru', title: 'Физика. 9 класс',
    authors: ['Туякбаев Б.К.'],
    description: 'Законы движения, импульс, работа и энергия, электромагнитная индукция, атомная физика.',
    grade: 9, subject: 'Физика', language: 'Русский',
  },
  {
    id: 'kz-physics-10-ru', title: 'Физика. 10 класс',
    authors: ['Туякбаев Б.К.', 'Кронгарт Б.К.'],
    description: 'Кинематика, динамика, законы сохранения, молекулярная физика, термодинамика.',
    grade: 10, subject: 'Физика', language: 'Русский',
  },
  {
    id: 'kz-physics-11-ru', title: 'Физика. 11 класс',
    authors: ['Туякбаев Б.К.', 'Кронгарт Б.К.'],
    description: 'Электродинамика, колебания и волны, оптика, квантовая и ядерная физика.',
    grade: 11, subject: 'Физика', language: 'Русский',
  },
  // ===== ИНФОРМАТИКА =====
  {
    id: 'kz-cs-5-ru', title: 'Информатика. 5 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Устройство компьютера, операционная система, текстовый редактор, работа с файлами.',
    grade: 5, subject: 'Информатика', language: 'Русский',
  },
  {
    id: 'kz-cs-6-ru', title: 'Информатика. 6 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Электронные таблицы, базы данных, интернет, создание веб-страниц.',
    grade: 6, subject: 'Информатика', language: 'Русский',
  },
  {
    id: 'kz-cs-7-ru', title: 'Информатика. 7 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Алгоритмы, блок-схемы, основы программирования на Scratch.',
    grade: 7, subject: 'Информатика', language: 'Русский',
  },
  {
    id: 'kz-cs-8-ru', title: 'Информатика. 8 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Программирование на Pascal/Python, алгоритмы сортировки, компьютерные сети.',
    grade: 8, subject: 'Информатика', language: 'Русский',
  },
  {
    id: 'kz-cs-9-ru', title: 'Информатика. 9 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'ООП, базы данных SQL, интернет-технологии.',
    grade: 9, subject: 'Информатика', language: 'Русский',
  },
  {
    id: 'kz-cs-10-ru', title: 'Информатика. 10 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Python, веб-разработка, введение в машинное обучение, кибербезопасность.',
    grade: 10, subject: 'Информатика', language: 'Русский',
  },
  {
    id: 'kz-cs-11-ru', title: 'Информатика. 11 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Алгоритмы и структуры данных, сетевые технологии, ИИ.',
    grade: 11, subject: 'Информатика', language: 'Русский',
  },
].map(b => ({
  ...b,
  image: `https://okulyk.com/wp-content/themes/okulyk.com/favicon/ms-icon-144x144.png`,
  price: 'Бесплатно',
  type: 'book',
  category: 'Казахстан. Школьная программа',
  source: 'okulyk.com (МОН РК)',
  // Прямая страница на okulyk.com — там можно читать онлайн или скачать PDF
  pageUrl: okulykUrl(b.grade, b.subject),
  hasPdf: false,    // редирект на okulyk.com, они сами дают PDF
  readerUrl: null,
  url: okulykUrl(b.grade, b.subject),
}));

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const grade = searchParams.get('grade') || '';
  const subject = searchParams.get('subject') || '';

  let results = KZ_TEXTBOOKS;

  if (grade) results = results.filter(b => b.grade === parseInt(grade));
  if (subject) results = results.filter(b => b.subject.toLowerCase().includes(subject.toLowerCase()));

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.authors.some(a => a.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ books: results, total: results.length, source: 'okulyk.com (МОН РК)' });
}