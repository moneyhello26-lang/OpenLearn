import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'physics';
  const apiKey = process.env.SPRINGER_API_KEY; // Нужно получить API ключ после регистрации

  if (!apiKey) {
    return NextResponse.json({
      books: [],
      note: 'Springer API требует бесплатной регистрации для получения API ключа'
    });
  }

  try {
    const response = await fetch(
      `https://api.springernature.com/metadata/json?q=${encodeURIComponent(query)}&s=1&p=10&api_key=${apiKey}`
    );
    const data = await response.json();

    const books = data.records?.filter((book: any) => book.contentType === 'Book')
      .map((book: any) => ({
        id: `springer-${book.doi}`,
        title: book.title,
        authors: book.creators?.map((c: any) => c.creator) || [],
        description: book.abstract || '',
        image: book.cover_url || '',
        price: 'Бесплатно',
        url: book.url,
        source: 'SpringerOpen',
        type: 'book',
        category: 'Технические и STEM профессии'
      })) || [];

    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}