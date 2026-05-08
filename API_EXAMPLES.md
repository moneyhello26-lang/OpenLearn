# API Examples and Usage Guide

## Quick Start

### 1. Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }'
```

Response:
```json
{
  "user": {
    "id": "clx1234567890",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123"
  }'
```

**Keep the token for authenticated requests!**

## Authenticated Requests

For all endpoints requiring authentication, include the token:
```bash
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Complete API Examples

### User Profile

#### Get Current User Profile
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "id": "clx1234567890",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://...",
  "bio": "Book enthusiast",
  "createdAt": "2024-05-07T10:00:00Z"
}
```

#### Update User Profile
```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Updated bio"
  }'
```

### Books

#### Add a New Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A classic American novel",
    "isbn": "978-0-7432-7356-5",
    "source": "gutendex",
    "sourceId": "12345",
    "coverUrl": "https://...",
    "downloadUrl": "https://...",
    "pageCount": 180,
    "language": "en",
    "publishedDate": "1925-04-10"
  }'
```

#### Search Books
```bash
# Search by title or author
curl "http://localhost:3000/api/books?search=gatsby&page=1&limit=10"
```

Response:
```json
{
  "data": [
    {
      "id": "clx987654321",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "description": "A classic American novel",
      "rating": 4.5,
      "reviewCount": 150,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

#### Get Book Details with Ratings and Comments
```bash
curl "http://localhost:3000/api/books/clx987654321/detail"
```

### Favorites

#### Add Book to Favorites
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "clx987654321"
  }'
```

#### Get All Favorites
```bash
curl "http://localhost:3000/api/favorites?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "data": [
    {
      "id": "favorite123",
      "userId": "clx1234567890",
      "bookId": "clx987654321",
      "addedAt": "2024-05-07T10:00:00Z",
      "book": {
        "id": "clx987654321",
        "title": "The Great Gatsby",
        ...
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

#### Remove from Favorites
```bash
curl -X DELETE http://localhost:3000/api/favorites/favorite123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Reading History

#### Start or Update Reading Progress
```bash
curl -X POST http://localhost:3000/api/reading-history \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "clx987654321",
    "currentPage": 150,
    "totalPages": 300,
    "status": "reading"
  }'
```

Status options: `reading`, `completed`, `abandoned`

#### Get Reading History
```bash
curl "http://localhost:3000/api/reading-history?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "data": [
    {
      "id": "history123",
      "userId": "clx1234567890",
      "bookId": "clx987654321",
      "status": "reading",
      "currentPage": 150,
      "totalPages": 300,
      "progress": 50,
      "startDate": "2024-05-01T10:00:00Z",
      "lastReadDate": "2024-05-07T15:30:00Z",
      "book": {
        "id": "clx987654321",
        "title": "The Great Gatsby",
        ...
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  }
}
```

### Ratings

#### Add or Update Rating
```bash
curl -X POST http://localhost:3000/api/books/clx987654321/ratings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "score": 5,
    "review": "Absolutely brilliant! A must-read classic."
  }'
```

Score must be between 1 and 5.

#### Get All Ratings for a Book
```bash
curl "http://localhost:3000/api/books/clx987654321/ratings?page=1&limit=10"
```

Response:
```json
{
  "data": [
    {
      "id": "rating123",
      "userId": "clx1234567890",
      "bookId": "clx987654321",
      "score": 5,
      "review": "Absolutely brilliant!",
      "createdAt": "2024-05-07T10:00:00Z",
      "user": {
        "name": "John Doe",
        "avatar": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### Comments

#### Add Comment to Book
```bash
curl -X POST http://localhost:3000/api/books/clx987654321/comments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This book changed my perspective on life!"
  }'
```

#### Get All Comments for a Book
```bash
curl "http://localhost:3000/api/books/clx987654321/comments?page=1&limit=10"
```

Response:
```json
{
  "data": [
    {
      "id": "comment123",
      "userId": "clx1234567890",
      "bookId": "clx987654321",
      "content": "This book changed my perspective!",
      "createdAt": "2024-05-07T10:00:00Z",
      "user": {
        "name": "John Doe",
        "avatar": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

#### Delete Comment
```bash
curl -X DELETE http://localhost:3000/api/comments/comment123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Only the comment author can delete their comment.

## Using with React Components

### Example: Using UserProfile Component

```tsx
import { UserProfile } from '@/components/UserProfile'

export default function ProfilePage() {
  return (
    <div>
      <h1>My Profile</h1>
      <UserProfile />
    </div>
  )
}
```

### Example: Using AuthForm Component

```tsx
import { AuthForm } from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div>
      <AuthForm />
    </div>
  )
}
```

### Example: Using Hooks

```tsx
'use client'

import { useApi, apiCall } from '@/lib/hooks'

export function BookList() {
  const { data, loading, error, refetch } = useApi('/api/books?page=1&limit=10')

  const addToFavorites = async (bookId: string) => {
    try {
      await apiCall('/api/favorites', {
        method: 'POST',
        body: { bookId },
      })
      refetch()
    } catch (err) {
      console.error('Error:', err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {data?.data.map((book: any) => (
        <div key={book.id}>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
          <button onClick={() => addToFavorites(book.id)}>
            Add to Favorites
          </button>
        </div>
      ))}
    </div>
  )
}
```

## Error Handling

All errors return appropriate HTTP status codes:

| Status | Meaning |
|--------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Server Error |

### Example Error Response

```json
{
  "error": "Book already in favorites"
}
```

## Rate Limiting Recommendations

Implement rate limiting to prevent abuse:

```bash
# Limit to 100 requests per 15 minutes per IP
npm install express-rate-limit
```

## Testing with Postman

1. Create a new collection
2. Use the examples above as requests
3. Save the token in a Postman environment variable:
   ```
   {{token}}
   ```
4. Use in Authorization header:
   ```
   Bearer {{token}}
   ```

## Testing with cURL Scripts

Create `scripts/test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api"

# Register
TOKEN=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }' | jq -r '.token')

echo "Token: $TOKEN"

# Get profile
curl -X GET $BASE_URL/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## Performance Tips

1. **Pagination**: Always use pagination for list endpoints
   ```bash
   ?page=1&limit=10
   ```

2. **Filtering**: Use search for books
   ```bash
   ?search=gatsby
   ```

3. **Caching**: Implement client-side caching for frequently accessed data

4. **Batch operations**: Combine related requests when possible

## Security Best Practices

1. ✅ Never share your token
2. ✅ Use HTTPS in production
3. ✅ Refresh tokens regularly
4. ✅ Validate all inputs
5. ✅ Don't expose sensitive data in responses
6. ✅ Log all important actions
7. ✅ Monitor for unusual activity

## Next Steps

1. Test all endpoints locally
2. Implement error handling in your frontend
3. Add loading states
4. Cache responses appropriately
5. Add user notifications
6. Deploy to production

