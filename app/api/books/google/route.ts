import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'business';

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&filter=free-ebooks&maxResults=20`
    );
    const data = await response.json();

    const books = data.items?.map((item: any) => ({
      id: `google-${item.id}`,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || '',
      image: item.volumeInfo.imageLinks?.thumbnail || '',
      price: 'Бесплатно',
      url: item.volumeInfo.previewLink || item.volumeInfo.infoLink,
      source: 'Google Books',
      type: 'book',
      category: 'Универсальный поиск'
    })) || [];

    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}