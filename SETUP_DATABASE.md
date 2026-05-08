# Database Setup Guide for Windows

## MySQL Installation

### Option 1: Using MySQL Installer (Recommended)

1. Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/

2. Run the installer and follow these steps:
   - Choose "Server only" installation
   - Choose "Development Default" or "Server Computer" configuration
   - Configure MySQL as a Windows Service with default port 3306
   - Configure MySQL Server (standalone machine)
   - Set root password (remember this!)
   - Create MySQL service

3. Verify installation:
   ```powershell
   mysql -u root -p
   ```
   Enter the password you set. You should see the MySQL prompt.

### Option 2: Using Chocolatey

```powershell
choco install mysql
```

### Option 3: Using Docker (Alternative)

If you prefer Docker:

```powershell
# Pull MySQL image
docker pull mysql:8.0

# Run MySQL container
docker run --name openlearn-mysql -e MYSQL_ROOT_PASSWORD=password -d -p 3306:3306 mysql:8.0

# Create database
docker exec openlearn-mysql mysql -u root -ppassword -e "CREATE DATABASE openlearn;"
```

## Database Setup

### 1. Connect to MySQL

```powershell
mysql -u root -p
```

Enter your password when prompted.

### 2. Create Database

```sql
CREATE DATABASE openlearn;
```

### 3. Verify Creation

```sql
SHOW DATABASES;
```

You should see `openlearn` in the list.

### 4. Exit MySQL

```sql
EXIT;
```

## Configure Your Project

1. Update `.env.local` with your MySQL credentials:

```env
DATABASE_URL="mysql://root:yourpassword@localhost:3306/openlearn"
JWT_SECRET="your-random-secret-key-here"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

Replace:
- `yourpassword` with your MySQL root password
- `localhost` with your MySQL server address if different
- `3306` with your port if different

2. Install dependencies (if not already done):

```bash
npm install
```

3. Run Prisma migrations:

```bash
npm run db:push
```

Or for development with migration creation:

```bash
npm run db:migrate
```

4. (Optional) View database with Prisma Studio:

```bash
npm run db:studio
```

## Troubleshooting

### "Can't connect to MySQL server"

1. Check if MySQL service is running:
   ```powershell
   # For MySQL 8.0
   Get-Service MySQL80 | Start-Service
   
   # Or search for MySQL service
   Get-Service | Where-Object {$_.Name -like "*MySQL*"}
   ```

2. Verify credentials:
   ```powershell
   mysql -h localhost -u root -p
   ```

3. Check if port 3306 is in use:
   ```powershell
   netstat -ano | findstr ":3306"
   ```

### "Access denied for user 'root'@'localhost'"

- Wrong password: Reset MySQL root password
- User doesn't exist: Create the user:
  ```sql
  CREATE USER 'openlearn'@'localhost' IDENTIFIED BY 'password';
  GRANT ALL PRIVILEGES ON openlearn.* TO 'openlearn'@'localhost';
  FLUSH PRIVILEGES;
  ```

Then update `.env.local`:
```
DATABASE_URL="mysql://openlearn:password@localhost:3306/openlearn"
```

### "Unknown database 'openlearn'"

Create the database:
```sql
CREATE DATABASE openlearn;
```

### "Prisma migrations fail"

1. Make sure database is created:
   ```sql
   CREATE DATABASE openlearn;
   ```

2. Reset Prisma (warning: deletes all data):
   ```bash
   npm run db:reset
   ```

3. Try migrations again:
   ```bash
   npm run db:push
   ```

## Verify Setup

To verify everything is working:

```bash
# Test the database connection
npm run db:studio

# This should open Prisma Studio at http://localhost:5555
# You should see all your tables created
```

## Next Steps

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test API endpoints (see DB_INTEGRATION_GUIDE.md)

3. Use the sample components (UserProfile, AuthForm) in your pages

## Security Notes

1. Change default root password immediately
2. Don't commit `.env.local` to Git (it's in .gitignore)
3. Use strong passwords in production
4. Consider creating a separate database user instead of using root:
   ```sql
   CREATE USER 'openlearn_user'@'localhost' IDENTIFIED BY 'strong_password_here';
   GRANT ALL PRIVILEGES ON openlearn.* TO 'openlearn_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. Configure MySQL for remote access only if needed (default is localhost only, which is secure)

## Backup and Restore

### Backup database:
```powershell
mysqldump -u root -p openlearn > backup.sql
```

### Restore database:
```powershell
mysql -u root -p openlearn < backup.sql
```

## Additional Resources

- MySQL Documentation: https://dev.mysql.com/doc/
- Prisma Documentation: https://www.prisma.io/docs/
- MySQL GUI Tools: MySQL Workbench (https://dev.mysql.com/downloads/workbench/)

