# OpenLearn.kz — Исправления и настройка

## Что было исправлено

### 1. package.json
- Удалён несуществующий пакет `"next.js": "^1.0.3"`
- Исправлена версия Next.js: `"^16.2.4"` → `"15.3.1"` (16.x не существует)
- Исправлена версия `@prisma/client` и `prisma`: `^7.8.0` → `^5.22.0`
- Исправлена версия `bcryptjs`: `^3.0.3` → `^2.4.3`
- Версии react/react-dom приведены к `^19.0.0`
- Версия `eslint-config-next` синхронизирована с Next.js: `15.3.1`

### 2. prisma/schema.prisma
- Добавлена отсутствующая строка `url = env("DATABASE_URL")` в блок datasource
  (без неё Prisma не знает куда подключаться)

### 3. .env и .env.local
- Исправлен `DATABASE_URL` на правильный формат для SQLite: `file:./dev.db`
  (был неправильный `prisma+postgres://localhost:51213/...`)

### 4. next.config.ts
- Убрана опция `turbopack.root` — вызывала конфликты с путями модулей
- Добавлены `images.remotePatterns` для обложек книг

### 5. lib/prisma.ts
- Убрана излишняя опция `log: ['query']` которая иногда вызывала проблемы

### 6. components/AuthForm.tsx
- Полностью переписан с улучшенным UX
- Добавлена валидация длины пароля
- Добавлена кнопка показа/скрытия пароля
- Улучшены сообщения об ошибках на русском

### 7. components/Header.tsx
- Добавлен авторизованный режим: аватар + выпадающее меню
- Кнопки "Войти" и "Регистрация" для неавторизованных
- Кнопка "Выйти" в меню пользователя

### 8. app/auth/page.tsx (НОВЫЙ)
- Отдельная страница авторизации по адресу /auth
- Поддержка входа и регистрации с переключением

## Как запустить

```bash
cd open-learn

# 1. Установить зависимости (удали node_modules если есть старые)
rm -rf node_modules .next
npm install

# 2. Создать базу данных
npx prisma generate
npx prisma db push

# 3. Запустить
npm run dev
```

## Структура аутентификации

- `POST /api/auth/register` — регистрация (name, email, password)
- `POST /api/auth/login` — вход (email, password)
- Токен JWT сохраняется в `localStorage`
- Страница: `/auth`

## База данных (SQLite)

Файл базы данных: `prisma/dev.db`
Схема: `prisma/schema.prisma`

Модели: User, Book, Favorite, ReadingHistory, Rating, Comment, Course, UserCourse
