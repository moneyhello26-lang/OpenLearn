import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('No book ID provided', { status: 400 });
  }

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Google Books Viewer</title>
    <style>
      body, html { 
        margin: 0; 
        padding: 0; 
        width: 100%; 
        height: 100%; 
        overflow: hidden; 
        background: #f4f4f5; 
        font-family: system-ui, sans-serif;
      }
      #viewerCanvas {
        width: 100%;
        height: 100%;
      }
      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #71717a;
        font-size: 14px;
        text-align: center;
      }
      .spinner {
        width: 24px;
        height: 24px;
        border: 2px solid #3b82f6;
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 12px auto;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    </style>
    <script type="text/javascript" src="https://www.google.com/books/jsapi.js"></script>
    <script type="text/javascript">
      google.books.load();
      function initialize() {
        var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
        viewer.load('${id.replace(/[^a-zA-Z0-9_-]/g, '')}', function() {
          // Failure callback
          document.getElementById('fallback').style.display = 'block';
          document.getElementById('loading').style.display = 'none';
        }, function() {
          // Success callback
          document.getElementById('loading').style.display = 'none';
        });
      }
      google.books.setOnLoadCallback(initialize);
    </script>
  </head>
  <body>
    <div id="loading" class="loading">
      <div class="spinner"></div>
      Подключение к Google Books...
    </div>
    
    <div id="fallback" class="loading" style="display: none;">
      <p style="margin-bottom: 12px; font-weight: 500;">Превью этой книги недоступно для встраивания.</p>
      <a href="https://play.google.com/store/books/details?id=${id.replace(/[^a-zA-Z0-9_-]/g, '')}" target="_blank" 
         style="display: inline-block; padding: 8px 16px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-size: 14px;">
        Открыть на сайте Google
      </a>
    </div>

    <div id="viewerCanvas"></div>
  </body>
</html>
  `;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
