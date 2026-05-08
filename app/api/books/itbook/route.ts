import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'programming';

  try {
    const response = await fetch(`https://api.itbook.store/1.0/search/${encodeURIComponent(query)}`);
    const data = await response.json();

    const books = data.books?.map((book: any) => ({
      id: `itbook-${book.isbn13}`,
      title: book.title,
      authors: book.authors?.split(', ') || [],
      description: book.subtitle || '',
      image: book.image,
      price: book.price,
      url: book.url,
      source: 'ITBook.store',
      type: 'book',
      category: 'IT и программирование'
    })) || [];

    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}