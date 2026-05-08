import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'science';

  try {
    const response = await fetch(`https://directory.doabooks.org/rest/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();

    const books = data.results?.map((book: any) => ({
      id: `doab-${book.id}`,
      title: book.title,
      authors: book.authors || [],
      description: book.description || '',
      image: book.cover_url || '',
      price: 'Бесплатно',
      url: book.url,
      source: 'DOAB',
      type: 'book',
      category: 'Наука и академические профессии'
    })) || [];

    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}