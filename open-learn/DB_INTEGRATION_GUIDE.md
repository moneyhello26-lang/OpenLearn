# Database Integration Guide

## Overview

This document describes the integrated MySQL database system for the OpenLearn platform using Prisma ORM.

## Features

- **User Authentication**: Register, login, and manage user profiles
- **Favorites**: Save and manage favorite books
- **Reading History**: Track reading progress and status
- **Ratings & Reviews**: Rate books and leave detailed reviews
- **Comments**: Add and manage comments on books
- **Courses**: Enroll in courses and track progress

## Database Setup

### Prerequisites

- MySQL Server (5.7+)
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables** in `.env.local`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/openlearn?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

3. **Create the database**:
```bash
mysql -u root -p
CREATE DATABASE openlearn;
```

4. **Run migrations**:
```bash
npx prisma migrate dev --name init
```

5. **Generate Prisma client**:
```bash
npx prisma generate
```

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:
```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Profile

#### Get Profile
```http
GET /api/users/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "avatar": "https://...",
  "bio": "Book lover"
}
```

### Favorites

#### Add to Favorites
```http
POST /api/favorites
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book-id"
}
```

#### Get Favorites
```http
GET /api/favorites?page=1&limit=10
Authorization: Bearer <token>
```

#### Remove from Favorites
```http
DELETE /api/favorites/{favoriteId}
Authorization: Bearer <token>
```

### Reading History

#### Update Reading Progress
```http
POST /api/reading-history
Authorization: Bearer <token>
Content-Type: application/json

{
  "bookId": "book-id",
  "currentPage": 150,
  "totalPages": 300,
  "status": "reading"
}
```

#### Get Reading History
```http
GET /api/reading-history?page=1&limit=10
Authorization: Bearer <token>
```

### Books

#### Create/Add Book
```http
POST /api/books
Content-Type: application/json

{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Description",
  "coverUrl": "https://...",
  "isbn": "isbn-number",
  "source": "gutendex",
  "sourceId": "external-id",
  "downloadUrl": "https://...",
  "pageCount": 300,
  "language": "en"
}
```

#### Get Books with Search
```http
GET /api/books?page=1&limit=10&search=search-term
```

#### Get Book Details
```http
GET /api/books/{bookId}/detail
```

### Ratings

#### Add Rating
```http
POST /api/books/{bookId}/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": 5,
  "review": "Excellent book!"
}
```

#### Get Ratings
```http
GET /api/books/{bookId}/ratings?page=1&limit=10
```

### Comments

#### Add Comment
```http
POST /api/books/{bookId}/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great book, highly recommend!"
}
```

#### Get Comments
```http
GET /api/books/{bookId}/comments?page=1&limit=10
```

#### Delete Comment
```http
DELETE /api/comments/{commentId}
Authorization: Bearer <token>
```

## Frontend Hooks

### useApi Hook

```typescript
import { useApi } from '@/lib/hooks'

export function MyComponent() {
  const { data, loading, error, refetch } = useApi('/api/users/me')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <div>{data?.name}</div>
}
```

### apiCall Function

```typescript
import { apiCall } from '@/lib/hooks'

async function addFavorite(bookId: string) {
  try {
    const result = await apiCall('/api/favorites', {
      method: 'POST',
      body: { bookId }
    })
    console.log('Added to favorites:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

## Database Schema

### User
- `id`: Unique identifier
- `email`: User email (unique)
- `name`: User name
- `password`: Hashed password
- `avatar`: Profile avatar URL
- `bio`: User biography
- `createdAt`: Account creation date
- `updatedAt`: Last update date

### Book
- `id`: Unique identifier
- `title`: Book title
- `author`: Author name
- `description`: Book description
- `coverUrl`: Cover image URL
- `isbn`: ISBN number
- `source`: Data source (gutendex, google, etc.)
- `sourceId`: External ID from source
- `downloadUrl`: Book download link
- `rating`: Average rating
- `reviewCount`: Number of reviews
- `createdAt`: Date added
- `updatedAt`: Last update date

### Favorite
- `id`: Unique identifier
- `userId`: User reference
- `bookId`: Book reference
- `addedAt`: Date added to favorites

### ReadingHistory
- `id`: Unique identifier
- `userId`: User reference
- `bookId`: Book reference
- `startDate`: Reading start date
- `lastReadDate`: Last read date
- `currentPage`: Current page number
- `totalPages`: Total pages
- `status`: reading, completed, abandoned
- `progress`: Progress percentage

### Rating
- `id`: Unique identifier
- `userId`: User reference
- `bookId`: Book reference
- `score`: Rating score (1-5)
- `review`: Review text
- `createdAt`: Date created
- `updatedAt`: Last update date

### Comment
- `id`: Unique identifier
- `userId`: User reference
- `bookId`: Book reference
- `content`: Comment text
- `createdAt`: Date created
- `updatedAt`: Last update date

## Development

### Run Development Server
```bash
npm run dev
```

### Database Management

#### View Database
```bash
npx prisma studio
```

#### Create Migration
```bash
npx prisma migrate dev --name migration-name
```

#### Reset Database
```bash
npx prisma migrate reset
```

## Security Notes

1. Always use HTTPS in production
2. Change JWT_SECRET in production
3. Hash passwords before storage (already implemented)
4. Validate and sanitize all inputs
5. Use environment variables for sensitive data
6. Implement rate limiting for API endpoints
7. Add CORS configuration as needed

## Troubleshooting

### "connection refused" error
- Check MySQL server is running
- Verify DATABASE_URL is correct
- Check database user permissions

### "table doesn't exist" error
- Run migrations: `npx prisma migrate dev`
- Check schema.prisma is valid

### JWT token errors
- Ensure JWT_SECRET is set in .env.local
- Check token hasn't expired
- Verify token format: "Bearer <token>"

## Next Steps

1. Implement email verification
2. Add password reset functionality
3. Implement social login
4. Add file upload for avatars
5. Implement book recommendations
6. Add search analytics
7. Create admin dashboard
