import { NextRequest, NextResponse } from 'next/server';

// Open Library — бесплатный публичный API (openlibrary.org)
// Поддерживает поиск и возвращает полный текст для книг в открытом доступе
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'programming';

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,cover_i,first_publish_year,subject,ia,lending_identifier_s,public_scan_b&limit=20`
    );
    const data = await response.json();

    const books = (data.docs || []).map((book: any) => {
      // Если есть Internet Archive ID — полный текст доступен онлайн
      const iaId = book.ia?.[0] || book.lending_identifier_s;
      const hasFullText = !!(iaId || book.public_scan_b);
      const readUrl = iaId
        ? `https://archive.org/embed/${iaId}`
        : `https://openlibrary.org${book.key}`;
      const pageUrl = `https://openlibrary.org${book.key}`;

      return {
        id: `openlibrary-${book.key?.replace('/works/', '') || Math.random()}`,
        title: book.title || 'Без названия',
        authors: book.author_name || [],
        description: `Опубликовано: ${book.first_publish_year || 'неизвестно'}. Тематика: ${(book.subject || []).slice(0, 3).join(', ')}`,
        image: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : '',
        price: 'Бесплатно',
        // Если есть полный текст — передаём embed URL, иначе страницу книги
        url: hasFullText ? readUrl : pageUrl,
        pageUrl,
        source: 'Open Library',
        type: 'book',
        category: 'IT и программирование',
        hasFullText,
        iaId: iaId || null,
      };
    });

    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from Open Library' }, { status: 500 });
  }
}