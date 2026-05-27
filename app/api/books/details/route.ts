import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
  }

  try {
    if (id.startsWith('google-')) {
      const key = id.replace('google-', '');
      const apiKey = process.env.GOOGLE_API_KEY ? `?key=${process.env.GOOGLE_API_KEY}` : '';
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${key}${apiKey}`);
      const item = await res.json();
      
      if (item.error) {
        return NextResponse.json({ error: item.error.message }, { status: 500 });
      }

      if (item.volumeInfo) {
        const info = item.volumeInfo; 
        const access = item.accessInfo;
        const hasFullText = access?.viewability === 'ALL_PAGES' || access?.epub?.isAvailable || access?.pdf?.isAvailable;
        const readUrl = info.canonicalVolumeLink || info.previewLink;
        
        return NextResponse.json({
          id, 
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
          hasFullText, 
          readerUrl: hasFullText ? `google:${key}` : null
        });
      }
    }

    return NextResponse.json({ error: 'Book not found or unsupported source' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch details' }, { status: 500 });
  }
}
