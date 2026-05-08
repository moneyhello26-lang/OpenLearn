import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'literature';

  try {
    const response = await fetch(`https://gutendex.com/books/?search=${encodeURIComponent(query)}`);
    const data = await response.json();

    const books = data.results?.map((book: any) => ({
      id: `gutendex-${book.id}`,
      title: book.title,
      authors: book.authors?.map((a: any) => a.name) || [],
      description: book.summaries?.[0] || '',
      image: book.formats?.['image/jpeg'] || '',
      price: 'Бесплатно',
      url: book.formats?.['text/html'] || book.formats?.['application/epub+zip'] || '',
      source: 'Project Gutenberg',
      type: 'book',
      category: 'Классика и гуманитарные науки'
    })) || [];

    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}