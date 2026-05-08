# 🚀 Quick Start Guide

## 5-Minute Setup

### Step 1: Verify Installation (30 seconds)

```bash
cd open-learn
npm list @prisma/client
npm list mysql2
```

✅ If both show versions, you're good!

### Step 2: Set Up MySQL (2 minutes)

**On Windows:**

#### Option A: Using Chocolatey
```powershell
choco install mysql
mysql -u root -p
```

#### Option B: Using Docker
```powershell
docker run --name openlearn-mysql -e MYSQL_ROOT_PASSWORD=password -d -p 3306:3306 mysql:8.0
docker exec openlearn-mysql mysql -u root -ppassword -e "CREATE DATABASE openlearn;"
```

#### Option C: Download Installer
Visit: https://dev.mysql.com/downloads/mysql/

### Step 3: Configure Environment (1 minute)

Edit `.env.local`:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/openlearn"
JWT_SECRET="change-me-to-random-string-in-production"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

Replace `YOUR_PASSWORD` with your MySQL root password.

### Step 4: Create Database (30 seconds)

If using MySQL CLI:
```powershell
mysql -u root -p
CREATE DATABASE openlearn;
EXIT;
```

Or if using Docker, it's already created!

### Step 5: Apply Migrations (30 seconds)

```bash
npm run db:push
```

✅ You should see: "✓ Prisma schema validated"

## Start Developing! 🎉

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test the API

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

Copy the `token` from response!

### Get Your Profile
```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer TOKEN_HERE"
```

Replace `TOKEN_HERE` with the token you copied.

## Useful Commands

```bash
# View database UI
npm run db:studio

# Reset database (WARNING: deletes all data)
npm run db:reset

# Create a new migration
npm run db:migrate

# Build for production
npm run build

# Start production server
npm run start
```

## File Structure

- **API Routes**: `app/api/` - All backend endpoints
- **Components**: `components/` - Ready-to-use React components
- **Utils**: `lib/` - Helper functions and Prisma client
- **Schema**: `prisma/schema.prisma` - Database definition
- **Documentation**: `*.md` files - Full guides

## Common Issues

### "Can't connect to MySQL"
- Is MySQL running? Start it!
- Check DATABASE_URL in .env.local
- Verify username/password are correct

### "Unknown database 'openlearn'"
```sql
CREATE DATABASE openlearn;
```

### "Table doesn't exist"
```bash
npm run db:push
```

### "Port 3000 in use"
```bash
npm run dev -- -p 3001
```

## Next Steps

1. ✅ Read [DB_INTEGRATION_GUIDE.md](DB_INTEGRATION_GUIDE.md) - Full API docs
2. ✅ Check [API_EXAMPLES.md](API_EXAMPLES.md) - Usage examples
3. ✅ Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Full structure
4. ✅ Integrate components into your pages
5. ✅ Deploy to production!

## Features Available

✨ **Ready to Use:**
- User authentication (register/login)
- User profiles
- Favorite books
- Reading history
- Book ratings (1-5 stars)
- Comments
- Book search
- Course management

## Need Help?

1. Check the [SETUP_DATABASE.md](SETUP_DATABASE.md) for detailed setup
2. See [DB_INTEGRATION_GUIDE.md](DB_INTEGRATION_GUIDE.md) for API details
3. Review [API_EXAMPLES.md](API_EXAMPLES.md) for code samples
4. Check error messages carefully!

## Production Deployment Checklist

Before going live:
- [ ] Change JWT_SECRET to random string
- [ ] Use strong MySQL password
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Use managed MySQL service (AWS RDS, etc.)
- [ ] Add rate limiting
- [ ] Enable error logging
- [ ] Set up backups
- [ ] Add monitoring

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run db:push` | Create tables |
| `npm run db:studio` | View database |
| `npm run build` | Build for production |
| `npm run db:reset` | Reset database ⚠️ |

## API Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/users/me` | Get profile |
| POST | `/api/favorites` | Add favorite |
| GET | `/api/favorites` | List favorites |
| POST | `/api/reading-history` | Track reading |
| GET | `/api/reading-history` | Get history |
| POST | `/api/books/{id}/ratings` | Add rating |
| GET | `/api/books/{id}/comments` | Get comments |

## Example: Using a Component

```tsx
import { UserProfile } from '@/components/UserProfile'

export default function Page() {
  return <UserProfile />
}
```

## Example: Using an API

```tsx
'use client'
import { useApi } from '@/lib/hooks'

export function MyComponent() {
  const { data, loading, error } = useApi('/api/users/me')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <div>Welcome {data?.name}!</div>
}
```

---

**You're all set! Start building!** 🚀

For detailed information, see the documentation files included in the project.
