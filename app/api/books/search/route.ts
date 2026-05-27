import { NextRequest, NextResponse } from 'next/server';

const KZ_KEYWORDS = ['физика', 'математика', 'алгебра', 'геометрия', 'информатика', 'казахстан', 'учебник', 'школа', 'класс', 'physics', 'math', 'geometry', 'algebra'];
const PROG_KEYWORDS = ['программирование', 'python', 'javascript', 'java', 'programming', 'code', 'developer', 'web', 'algorithm', 'machine learning', 'kotlin', 'react', 'node', 'css', 'html', 'linux', 'git', 'database', 'sql', 'c++', 'c#', 'rust', 'go', 'swift', 'typescript'];

function isKzQuery(q: string) { return KZ_KEYWORDS.some(kw => q.toLowerCase().includes(kw)); }
function isProgQuery(q: string) { return PROG_KEYWORDS.some(kw => q.toLowerCase().includes(kw)); }

async function fetchKazakhstan(query: string, baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}/api/books/kazakhstan?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return (data.books || []).map((b: any) => ({
      ...b,
      type: 'book',
      category: 'Казахстан. Школьная программа',
      hasFullText: false,
      readerUrl: null,
      url: b.pageUrl || b.url,
    }));
  } catch { return []; }
}

async function fetchGoogle(query: string) {
  try {
    // Add API key if available in env to prevent rate limits
    const apiKey = process.env.GOOGLE_API_KEY ? `&key=${process.env.GOOGLE_API_KEY}` : '';
    // Fetch all materials, up to 20 results
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20${apiKey}`);
    const data = await res.json();
    
    return (data.items || []).map((item: any) => {
      const info = item.volumeInfo;
      const access = item.accessInfo;
      const hasFullText = access?.viewability === 'ALL_PAGES' || access?.epub?.isAvailable || access?.pdf?.isAvailable;
      const readUrl = info.canonicalVolumeLink || info.previewLink;
      
      return {
        id: `google-${item.id}`,
        title: info.title || '',
        authors: info.authors || [],
        description: info.description || info.subtitle || '',
        image: (info.imageLinks?.thumbnail || '').replace('http:', 'https:'),
        price: item.saleInfo?.saleability === 'FOR_SALE' && item.saleInfo.retailPrice 
          ? `${item.saleInfo.retailPrice.amount} ${item.saleInfo.retailPrice.currencyCode}`
          : (item.saleInfo?.saleability === 'FREE' ? 'Бесплатно' : 'Нет цены'),
        url: readUrl,
        pageUrl: info.infoLink,
        source: 'Google Books',
        type: 'book',
        category: 'Google Library',
        hasFullText,
        // Pass special prefix 'google:' followed by volume ID to our reader
        readerUrl: hasFullText ? `google:${item.id}` : null,
      };
    });
  } catch { return []; }
}

async function fetchITBooks(query: string) {
  try {
    const res = await fetch(`https://api.itbook.store/1.0/search/${encodeURIComponent(query)}`);
    const data = await res.json();
    return (data.books || []).map((book: any) => ({
      id: `itbook-${book.isbn13}`,
      title: book.title,
      authors: book.authors ? book.authors.split(', ') : [],
      description: book.subtitle || '',
      image: book.image,
      price: book.price === '$0.00' ? 'Бесплатно' : book.price,
      url: book.url,
      pageUrl: book.url,
      source: 'IT Book Store',
      type: 'book',
      category: 'IT и программирование',
      hasFullText: false,
      readerUrl: null,
    }));
  } catch { return []; }
}

async function fetchOpenLibrary(query: string, baseUrl: string) {
  try {
    const res = await fetch(`${baseUrl}/api/books/openlibrary?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return (data.books || []).map((b: any) => ({
      ...b,
      readerUrl: b.hasFullText && b.iaId ? `https://archive.org/embed/${b.iaId}` : null,
    }));
  } catch { return []; }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';
  const baseUrl = request.nextUrl.origin;

  if (!query) {
    return NextResponse.json({ results: [], total: 0, query, type });
  }

  try {
    const allBooks: any[] = [];
    const isProg = isProgQuery(query);
    const isKz = isKzQuery(query);

    if (type !== 'course') {
      // 1. Kazakhstan Textbooks
      if (isKz) {
        const kzBooks = await fetchKazakhstan(query, baseUrl);
        allBooks.push(...kzBooks);
      }

      // 2. Always fetch Google Books (broad integration)
      const googleBooksPromise = fetchGoogle(query);
      const openLibPromise = fetchOpenLibrary(query, baseUrl);

      // 3. IT books for programming queries
      if (isProg) {
        const itBooksPromise = fetchITBooks(query);
        const [google, openlib, itbooks] = await Promise.all([googleBooksPromise, openLibPromise, itBooksPromise]);
        allBooks.push(...google, ...itbooks, ...openlib);
      } else {
        const [google, openlib] = await Promise.all([googleBooksPromise, openLibPromise]);
        allBooks.push(...google, ...openlib);
      }
    }

    // Deduplication
    const seen = new Set<string>();
    const deduped = allBooks.filter(b => {
      const key = `${b.title?.toLowerCase()}-${(b.authors?.[0] || '').toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ results: deduped, total: deduped.length, query, type });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed', results: [] }, { status: 500 });
  }
}