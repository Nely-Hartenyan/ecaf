# Настройка локальной разработки

## Быстрый старт

### 1. Запустите Docker Desktop

Убедитесь, что Docker Desktop запущен на вашем Mac.

### 2. Запустите локальную базу данных

```bash
# Запустить PostgreSQL в Docker
npm run db:up
# или
docker-compose up -d
```

### 3. Примените миграции

```bash
# Сгенерировать Prisma Client
npm run db:generate

# Применить миграции
npm run db:migrate
```

### 4. Заполните базу данных (опционально)

```bash
npm run db:seed
```

### 5. Запустите проект

```bash
npm run dev
```

## Файл .env.local

Файл `.env.local` уже создан с настройками для локальной базы данных:
- `DATABASE_URL` - подключение к локальной PostgreSQL
- `NEXTAUTH_URL` - http://localhost:3000
- `NEXTAUTH_SECRET` - для разработки

## Использование production базы данных

Если хотите использовать базу данных из Vercel:

1. Получите переменные из Vercel:
   ```bash
   vercel env pull .env.local
   ```

2. Или вручную отредактируйте `.env.local` и замените `DATABASE_URL` на значение из Vercel.

## Полезные команды

```bash
# Остановить базу данных
npm run db:down

# Перезапустить базу данных (с очисткой)
npm run db:reset

# Открыть Prisma Studio (GUI для БД)
npm run db:studio
```
