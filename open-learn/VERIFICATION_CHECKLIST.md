# Integration Verification Checklist

Use this checklist to verify that the database integration is complete and working correctly.

## ✅ Installation & Configuration

- [ ] All npm packages installed
  ```bash
  npm list @prisma/client mysql2 bcryptjs jsonwebtoken
  ```

- [ ] `.env.local` file created with valid MySQL credentials
  ```bash
  cat .env.local | grep DATABASE_URL
  ```

- [ ] `.env.local` is in `.gitignore`
  ```bash
  grep ".env" .gitignore
  ```

- [ ] Prisma schema is valid
  ```bash
  npx prisma validate
  ```

- [ ] MySQL database exists
  ```sql
  SHOW DATABASES LIKE 'openlearn';
  ```

## ✅ Database Setup

- [ ] Database migrations applied
  ```bash
  npm run db:push
  ```

- [ ] All tables created
  ```bash
  npm run db:studio
  ```
  Should show 8 tables: users, books, favorites, reading_history, ratings, comments, courses, user_courses

- [ ] Prisma client generated
  ```bash
  ls node_modules/@prisma/client/
  ```

## ✅ API Routes

Test each endpoint is accessible (not necessarily working yet):

- [ ] `POST /api/auth/register` - Exists
- [ ] `POST /api/auth/login` - Exists
- [ ] `GET/PUT /api/users/me` - Exists
- [ ] `GET/POST /api/books` - Exists
- [ ] `GET /api/books/[id]` - Exists
- [ ] `POST/GET /api/favorites` - Exists
- [ ] `DELETE /api/favorites/[id]` - Exists
- [ ] `POST/GET /api/reading-history` - Exists
- [ ] `POST/GET /api/books/[id]/ratings` - Exists
- [ ] `POST/GET /api/books/[id]/comments` - Exists
- [ ] `DELETE /api/comments/[id]` - Exists

## ✅ Utility Files

- [ ] `lib/prisma.ts` - Exists and exports prisma client
  ```bash
  grep -l "prisma" lib/prisma.ts
  ```

- [ ] `lib/auth.ts` - Exists with auth functions
  ```bash
  grep -c "hashPassword\|comparePassword\|generateToken" lib/auth.ts
  ```

- [ ] `lib/errors.ts` - Exists with error handling
  ```bash
  grep -l "ApiError" lib/errors.ts
  ```

- [ ] `lib/hooks.ts` - Exists with React hooks
  ```bash
  grep -l "useApi\|apiCall" lib/hooks.ts
  ```

## ✅ Configuration

- [ ] `middleware.ts` exists
  ```bash
  ls middleware.ts
  ```

- [ ] `prisma.config.ts` configured correctly
  ```bash
  grep "mysql" prisma.config.ts
  ```

- [ ] `prisma/schema.prisma` has all models
  ```bash
  grep -c "^model " prisma/schema.prisma
  ```
  Should show: 8

- [ ] `package.json` has database scripts
  ```bash
  grep "db:" package.json
  ```

## ✅ Components

- [ ] `components/UserProfile.tsx` exists
  ```bash
  ls components/UserProfile.tsx
  ```

- [ ] `components/AuthForm.tsx` exists
  ```bash
  ls components/AuthForm.tsx
  ```

## ✅ Documentation

- [ ] `DB_INTEGRATION_GUIDE.md` - Comprehensive API docs
- [ ] `SETUP_DATABASE.md` - Database setup guide
- [ ] `API_EXAMPLES.md` - Usage examples
- [ ] `PROJECT_STRUCTURE.md` - Project overview
- [ ] `QUICK_START.md` - Quick start guide
- [ ] `INTEGRATION_SUMMARY.md` - Integration summary
- [ ] `.env.example` - Environment template

## ✅ Functional Tests

Start the dev server:
```bash
npm run dev
```

### Test 1: User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

- [ ] Returns 200 OK
- [ ] Response includes `token`
- [ ] Response includes `user` object
- [ ] Password is not returned in response

### Test 2: User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test1@example.com",
    "password": "test123"
  }'
```

- [ ] Returns 200 OK
- [ ] Returns valid JWT token
- [ ] Token can be decoded at jwt.io

### Test 3: Get User Profile

Save token from previous test, then:

```bash
TOKEN="your-token-here"
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] Returns 200 OK
- [ ] Returns user object with name and email
- [ ] Without token: Returns 401 Unauthorized

### Test 4: Update Profile

```bash
TOKEN="your-token-here"
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "bio": "New bio"
  }'
```

- [ ] Returns 200 OK
- [ ] Returns updated user object

### Test 5: Create Book

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "source": "gutendex",
    "sourceId": "123",
    "description": "Test description"
  }'
```

- [ ] Returns 201 Created
- [ ] Returns book object with ID

### Test 6: Search Books

```bash
curl "http://localhost:3000/api/books?search=test"
```

- [ ] Returns 200 OK
- [ ] Returns data array and pagination object
- [ ] Pagination includes: page, limit, total, pages

### Test 7: Add Favorite

```bash
TOKEN="your-token-here"
BOOK_ID="book-id-from-previous-test"

curl -X POST http://localhost:3000/api/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"bookId\": \"$BOOK_ID\"}"
```

- [ ] Returns 201 Created
- [ ] Can retrieve with GET /api/favorites

### Test 8: Prisma Studio

```bash
npm run db:studio
```

- [ ] Opens at http://localhost:5555
- [ ] Shows all tables
- [ ] Can view/edit records

## ✅ Error Handling

Test error scenarios:

### Test: Missing Required Fields
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

- [ ] Returns 400 Bad Request
- [ ] Includes error message

### Test: Invalid Token
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer invalid-token"
```

- [ ] Returns 401 Unauthorized

### Test: Unauthorized Access
```bash
curl http://localhost:3000/api/users/me
```

- [ ] Returns 401 Unauthorized (no token)

## ✅ Database Integrity

### Test: Unique Constraints

Try adding same book to favorites twice:
```bash
# Should succeed first time
curl -X POST http://localhost:3000/api/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"bookId\": \"$BOOK_ID\"}"

# Should fail second time with 400 Bad Request
curl -X POST http://localhost:3000/api/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"bookId\": \"$BOOK_ID\"}"
```

- [ ] First request succeeds
- [ ] Second request returns 400 with error

### Test: Foreign Keys

Try adding rating for non-existent book:
```bash
curl -X POST http://localhost:3000/api/books/nonexistent-id/ratings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"score": 5}'
```

- [ ] Returns 404 Not Found

## ✅ Pagination

```bash
curl "http://localhost:3000/api/books?page=1&limit=5"
```

- [ ] Returns pagination object
- [ ] Pagination includes: page, limit, total, pages
- [ ] Limit is capped at 50

## ✅ Security

- [ ] Passwords are hashed (never stored as plaintext)
  ```bash
  npm run db:studio  # Check users table, password field
  ```

- [ ] JWT secrets are in .env.local (not in code)
  ```bash
  grep -r "JWT_SECRET" app/api/ lib/ --exclude-dir=node_modules
  ```
  Should NOT find hardcoded secret

- [ ] .env.local is in .gitignore
  ```bash
  git check-ignore .env.local
  ```

- [ ] Protected routes require token
  ```bash
  curl http://localhost:3000/api/favorites
  ```
  Should return 401

## ✅ Performance

- [ ] Database has indexes on searched fields
  ```bash
  npm run db:studio  # Check books table for indexes
  ```

- [ ] Pagination works for large datasets
  ```bash
  curl "http://localhost:3000/api/books?page=100&limit=10"
  ```

- [ ] Queries are optimized (no N+1 queries)
  Check terminal output for query count

## ✅ Deployment Readiness

- [ ] Build succeeds
  ```bash
  npm run build
  ```

- [ ] No console errors or warnings in dev mode
  ```bash
  npm run dev  # Check terminal for errors
  ```

- [ ] Environment variables are documented
  ```bash
  cat .env.example
  ```

- [ ] README includes setup instructions
  ```bash
  ls QUICK_START.md SETUP_DATABASE.md
  ```

## ✅ Code Quality

- [ ] TypeScript has no errors
  ```bash
  npx tsc --noEmit
  ```

- [ ] ESLint passes
  ```bash
  npm run lint
  ```

- [ ] No console.log statements in production code
  ```bash
  grep -r "console.log" app/ lib/ --exclude-dir=node_modules | grep -v test
  ```

## Summary

Total checks: 80+

Passed: ___ / 80

Success Rate: ___%

## Next Actions

- [ ] Fix any failed checks
- [ ] Deploy to staging
- [ ] Perform load testing
- [ ] Set up monitoring
- [ ] Deploy to production

## Troubleshooting

If any check fails, see:
1. `QUICK_START.md` - Quick setup
2. `SETUP_DATABASE.md` - Database issues
3. `DB_INTEGRATION_GUIDE.md` - API issues
4. `API_EXAMPLES.md` - Usage examples

---

**Last Updated**: 2024-05-07
**Checklist Version**: 1.0

