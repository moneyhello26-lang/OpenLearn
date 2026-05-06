import { NextRequest, NextResponse } from 'next/server';

// Казахстанские учебники 5-11 класс (физика, математика, информатика)
// Источник: emektep.kz (официальный портал МОН РК) и bilimland.kz
// PDF-файлы берутся с открытого доступа МОН РК

const KZ_TEXTBOOKS = [
  // ===== МАТЕМАТИКА =====
  {
    id: 'kz-math-5-ru',
    title: 'Математика. 5 класс',
    authors: ['Акпаева А.Б.', 'Ибраева А.Т.'],
    description: 'Учебник математики для 5 класса общеобразовательных школ Казахстана. Содержит темы: натуральные числа, дроби, проценты, геометрические фигуры.',
    image: 'https://emektep.kz/api/textbook/cover/math5ru',
    grade: 5, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1078',
    pageUrl: 'https://emektep.kz/catalog/books/5klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-math-6-ru',
    title: 'Математика. 6 класс',
    authors: ['Акпаева А.Б.', 'Ибраева А.Т.'],
    description: 'Учебник математики для 6 класса. Темы: рациональные числа, пропорции, уравнения, геометрия.',
    image: '',
    grade: 6, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1079',
    pageUrl: 'https://emektep.kz/catalog/books/6klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-algebra-7-ru',
    title: 'Алгебра. 7 класс',
    authors: ['Абылкасымова А.Е.', 'Жумагулов Б.Т.'],
    description: 'Учебник алгебры для 7 класса. Алгебраические выражения, линейные уравнения и неравенства, системы уравнений, функции.',
    image: '',
    grade: 7, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1080',
    pageUrl: 'https://emektep.kz/catalog/books/7klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-geometry-7-ru',
    title: 'Геометрия. 7 класс',
    authors: ['Шыныбеков А.Н.'],
    description: 'Учебник геометрии для 7 класса. Геометрические фигуры, треугольники, параллельные прямые, доказательства теорем.',
    image: '',
    grade: 7, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1081',
    pageUrl: 'https://emektep.kz/catalog/books/7klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-algebra-8-ru',
    title: 'Алгебра. 8 класс',
    authors: ['Абылкасымова А.Е.'],
    description: 'Учебник алгебры для 8 класса. Квадратные уравнения, квадратные корни, степени, функции.',
    image: '',
    grade: 8, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1082',
    pageUrl: 'https://emektep.kz/catalog/books/8klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-geometry-8-ru',
    title: 'Геометрия. 8 класс',
    authors: ['Шыныбеков А.Н.'],
    description: 'Учебник геометрии для 8 класса. Четырёхугольники, площади, подобие треугольников, теорема Пифагора.',
    image: '',
    grade: 8, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1083',
    pageUrl: 'https://emektep.kz/catalog/books/8klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-algebra-9-ru',
    title: 'Алгебра. 9 класс',
    authors: ['Абылкасымова А.Е.'],
    description: 'Учебник алгебры для 9 класса. Квадратичная функция, тригонометрия, арифметическая и геометрическая прогрессии.',
    image: '',
    grade: 9, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1084',
    pageUrl: 'https://emektep.kz/catalog/books/9klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-math-10-ru',
    title: 'Математика. 10 класс (общественно-гуманитарный профиль)',
    authors: ['Абылкасымова А.Е.', 'Нурмуканов М.'],
    description: 'Учебник математики для 10 класса общественно-гуманитарного направления. Тригонометрия, показательные и логарифмические функции.',
    image: '',
    grade: 10, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1085',
    pageUrl: 'https://emektep.kz/catalog/books/10klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-algebra-10-stem-ru',
    title: 'Алгебра и начала анализа. 10 класс (естественно-математический профиль)',
    authors: ['Жумагулов Б.Т.', 'Абылкасымова А.Е.'],
    description: 'Учебник алгебры и начал математического анализа для 10 класса ЕМН. Производная, пределы, тригонометрические уравнения, логарифмы.',
    image: '',
    grade: 10, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1086',
    pageUrl: 'https://emektep.kz/catalog/books/10klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-algebra-11-stem-ru',
    title: 'Алгебра и начала анализа. 11 класс (ЕМН)',
    authors: ['Жумагулов Б.Т.', 'Абылкасымова А.Е.'],
    description: 'Учебник алгебры для 11 класса ЕМН. Интеграл, уравнения, неравенства, методы решения задач ЕНТ.',
    image: '',
    grade: 11, subject: 'Математика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1087',
    pageUrl: 'https://emektep.kz/catalog/books/11klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },

  // ===== ФИЗИКА =====
  {
    id: 'kz-physics-7-ru',
    title: 'Физика. 7 класс',
    authors: ['Туякбаев Б.К.', 'Шайморданов А.'],
    description: 'Учебник физики для 7 класса. Введение в физику, механическое движение, силы, давление, тепловые явления.',
    image: '',
    grade: 7, subject: 'Физика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1090',
    pageUrl: 'https://emektep.kz/catalog/books/7klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-physics-8-ru',
    title: 'Физика. 8 класс',
    authors: ['Туякбаев Б.К.'],
    description: 'Учебник физики для 8 класса. Тепловые явления, электрический ток, электромагнетизм, оптика.',
    image: '',
    grade: 8, subject: 'Физика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1091',
    pageUrl: 'https://emektep.kz/catalog/books/8klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-physics-9-ru',
    title: 'Физика. 9 класс',
    authors: ['Туякбаев Б.К.'],
    description: 'Учебник физики для 9 класса. Законы движения, импульс, работа и энергия, электромагнитная индукция, атомная физика.',
    image: '',
    grade: 9, subject: 'Физика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1092',
    pageUrl: 'https://emektep.kz/catalog/books/9klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-physics-10-ru',
    title: 'Физика. 10 класс',
    authors: ['Туякбаев Б.К.', 'Кронгарт Б.К.'],
    description: 'Учебник физики для 10 класса ЕМН. Кинематика, динамика, законы сохранения, молекулярная физика, термодинамика.',
    image: '',
    grade: 10, subject: 'Физика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1093',
    pageUrl: 'https://emektep.kz/catalog/books/10klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-physics-11-ru',
    title: 'Физика. 11 класс',
    authors: ['Туякбаев Б.К.', 'Кронгарт Б.К.'],
    description: 'Учебник физики для 11 класса. Электродинамика, колебания и волны, оптика, квантовая и ядерная физика.',
    image: '',
    grade: 11, subject: 'Физика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1094',
    pageUrl: 'https://emektep.kz/catalog/books/11klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },

  // ===== ИНФОРМАТИКА =====
  {
    id: 'kz-cs-5-ru',
    title: 'Информатика. 5 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Учебник информатики для 5 класса. Устройство компьютера, операционная система, текстовый редактор, работа с файлами.',
    image: '',
    grade: 5, subject: 'Информатика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1100',
    pageUrl: 'https://emektep.kz/catalog/books/5klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-cs-6-ru',
    title: 'Информатика. 6 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Учебник информатики для 6 класса. Электронные таблицы, базы данных, интернет, создание веб-страниц.',
    image: '',
    grade: 6, subject: 'Информатика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1101',
    pageUrl: 'https://emektep.kz/catalog/books/6klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-cs-7-ru',
    title: 'Информатика. 7 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Учебник информатики для 7 класса. Алгоритмы, блок-схемы, основы программирования на Scratch, работа с данными.',
    image: '',
    grade: 7, subject: 'Информатика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1102',
    pageUrl: 'https://emektep.kz/catalog/books/7klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-cs-8-ru',
    title: 'Информатика. 8 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Учебник информатики для 8 класса. Программирование на Pascal/Python, алгоритмы сортировки, компьютерные сети.',
    image: '',
    grade: 8, subject: 'Информатика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1103',
    pageUrl: 'https://emektep.kz/catalog/books/8klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-cs-9-ru',
    title: 'Информатика. 9 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Учебник информатики для 9 класса. Объектно-ориентированное программирование, базы данных SQL, интернет-технологии.',
    image: '',
    grade: 9, subject: 'Информатика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1104',
    pageUrl: 'https://emektep.kz/catalog/books/9klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-cs-10-ru',
    title: 'Информатика. 10 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Учебник информатики для 10 класса. Программирование на Python, веб-разработка, машинное обучение (введение), кибербезопасность.',
    image: '',
    grade: 10, subject: 'Информатика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1105',
    pageUrl: 'https://emektep.kz/catalog/books/10klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
  {
    id: 'kz-cs-11-ru',
    title: 'Информатика. 11 класс',
    authors: ['Балапанов Е.Х.', 'Бөрібаев Б.'],
    description: 'Учебник информатики для 11 класса. Алгоритмы и структуры данных, сетевые технологии, проектная деятельность, ИИ.',
    image: '',
    grade: 11, subject: 'Информатика', language: 'Русский',
    source: 'МОН РК / emektep.kz',
    pdfUrl: 'https://emektep.kz/qr/1106',
    pageUrl: 'https://emektep.kz/catalog/books/11klass',
    hasPdf: true, price: 'Бесплатно', type: 'book', category: 'Казахстан. Школьная программа'
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const grade = searchParams.get('grade') || '';
  const subject = searchParams.get('subject') || '';

  let results = KZ_TEXTBOOKS;

  if (grade) {
    results = results.filter(b => b.grade === parseInt(grade));
  }

  if (subject) {
    results = results.filter(b =>
      b.subject.toLowerCase().includes(subject.toLowerCase())
    );
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.authors.some(a => a.toLowerCase().includes(q))
    );
  }

  return NextResponse.json({
    books: results,
    total: results.length,
    source: 'Kazakhstan MES (МОН РК)',
  });
}