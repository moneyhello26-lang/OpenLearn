CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "isbn" TEXT,
    "publishedDate" DATETIME,
    "pageCount" INTEGER,
    "language" TEXT DEFAULT 'en',
    "source" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "downloadUrl" TEXT,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "favorites_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "reading_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadDate" DATETIME NOT NULL,
    "currentPage" INTEGER NOT NULL DEFAULT 0,
    "totalPages" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'reading',
    "progress" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "reading_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "reading_history_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ratings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverUrl" TEXT,
    "instructor" TEXT NOT NULL,
    "duration" INTEGER,
    "level" TEXT NOT NULL DEFAULT 'beginner',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "user_courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'enrolled',
    "enrolledAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "user_courses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

CREATE INDEX "books_title_idx" ON "books"("title");

CREATE INDEX "books_author_idx" ON "books"("author");

CREATE UNIQUE INDEX "books_source_sourceId_key" ON "books"("source", "sourceId");

CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

CREATE INDEX "favorites_bookId_idx" ON "favorites"("bookId");

CREATE UNIQUE INDEX "favorites_userId_bookId_key" ON "favorites"("userId", "bookId");

CREATE INDEX "reading_history_userId_idx" ON "reading_history"("userId");

CREATE INDEX "reading_history_bookId_idx" ON "reading_history"("bookId");

CREATE UNIQUE INDEX "reading_history_userId_bookId_key" ON "reading_history"("userId", "bookId");

CREATE INDEX "ratings_userId_idx" ON "ratings"("userId");

CREATE INDEX "ratings_bookId_idx" ON "ratings"("bookId");

CREATE UNIQUE INDEX "ratings_userId_bookId_key" ON "ratings"("userId", "bookId");

CREATE INDEX "comments_userId_idx" ON "comments"("userId");

CREATE INDEX "comments_bookId_idx" ON "comments"("bookId");

CREATE INDEX "courses_title_idx" ON "courses"("title");

CREATE INDEX "user_courses_userId_idx" ON "user_courses"("userId");

CREATE INDEX "user_courses_courseId_idx" ON "user_courses"("courseId");

CREATE UNIQUE INDEX "user_courses_userId_courseId_key" ON "user_courses"("userId", "courseId");
