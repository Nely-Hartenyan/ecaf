# Инструкция по деплою

## Быстрый деплой на Vercel

### Шаг 1: Подготовка

1. Убедитесь, что код закоммичен и запушен в Git репозиторий
2. Проверьте, что проект собирается локально: `npm run build`

### Шаг 2: Создание проекта на Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш репозиторий
4. Vercel автоматически определит Next.js

### Шаг 3: Настройка базы данных

**Вариант 1: Prisma Postgres (РЕКОМЕНДУЕТСЯ - самый простой для Prisma)**

1. В настройках проекта → "Storage" → "Create New" → выберите "Prisma Postgres" из Marketplace
2. Нажмите "Create" или "Add" для добавления Prisma Postgres
3. Prisma Postgres автоматически создаст все необходимые переменные окружения:
   - `DATABASE_URL` (готова для использования с Prisma)
   - Другие необходимые переменные для подключения

**Вариант 2: Vercel Postgres (альтернатива)**

1. В настройках проекта → "Storage" → "Create Database" → "Postgres"
2. Создайте базу данных
3. Vercel автоматически создаст переменные:
   - `POSTGRES_PRISMA_URL` (для Prisma)
   - `POSTGRES_URL_NON_POOLING` (для прямых подключений)
4. Создайте переменную `DATABASE_URL="${POSTGRES_PRISMA_URL}"` в Environment Variables

**Вариант 3: Внешний провайдер (Neon, Supabase, Railway)**

1. Создайте PostgreSQL базу данных
2. Скопируйте connection string
3. Добавьте в Vercel Environment Variables как `DATABASE_URL`

### Шаг 4: Переменные окружения

В настройках проекта Vercel → "Settings" → "Environment Variables" добавьте:

**Если используете Prisma Postgres (Вариант 1):**

✅ **Отлично!** Prisma Postgres автоматически создаст переменную `DATABASE_URL` - ничего дополнительно настраивать не нужно!

**Если используете Vercel Postgres (Вариант 2):**

Vercel автоматически создаст переменные `POSTGRES_PRISMA_URL` и `POSTGRES_URL_NON_POOLING`. 
Для Prisma миграций нужно создать `DATABASE_URL`:

```env
# Создайте переменную DATABASE_URL из POSTGRES_PRISMA_URL:
DATABASE_URL="${POSTGRES_PRISMA_URL}"
```

**Если используете внешний провайдер (Вариант 3):**

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
```

**Обязательные переменные для всех вариантов:**

```env
# NextAuth (ОБЯЗАТЕЛЬНО - установите ОБЕ переменные!)
NEXTAUTH_URL="https://your-project.vercel.app"
NEXTAUTH_SECRET="your-secret-key"  # Сгенерируйте: openssl rand -base64 32

# ИЛИ используйте AUTH_SECRET (NextAuth v5 также поддерживает это):
AUTH_SECRET="your-secret-key"  # Альтернатива NEXTAUTH_SECRET

# Vercel Blob Storage (создается автоматически при создании Blob Storage)
# BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..." # Добавляется автоматически
```

**Важно:**

- ⚠️ **ОБЯЗАТЕЛЬНО** установите `NEXTAUTH_SECRET` или `AUTH_SECRET` на Vercel!
- `NEXTAUTH_URL` должен быть вашим production доменом (например: `https://your-project.vercel.app`)
- `NEXTAUTH_SECRET` должен быть уникальным и безопасным
- Для генерации секрета используйте: `openssl rand -base64 32`

### Шаг 5: Деплой

1. Нажмите "Deploy"
2. Vercel автоматически:
   - Установит зависимости
   - Выполнит `prisma generate` (благодаря `postinstall` скрипту)
   - Применит миграции (благодаря `vercel.json`)
   - Соберет проект

### Шаг 6: Первый запуск

После успешного деплоя:

1. **Примените миграции** (если не применились автоматически):

   ```bash
   # Установите Vercel CLI
   npm i -g vercel

   # Подключитесь к проекту
   vercel link

   # Примените миграции
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. **Заполните базу данных** (опционально):

   ```bash
   npx prisma db seed
   ```

3. **Проверьте работу сайта** на вашем домене

## ⚠️ Важно: Загрузка файлов

Код уже настроен для работы с Vercel Blob Storage! В локальной разработке файлы сохраняются в `public/uploads`, а на Vercel автоматически используется Blob Storage.

### Настройка Vercel Blob Storage

1. **Создайте Blob Storage:**

   - В настройках проекта Vercel → "Storage" → "Create Database" → "Blob"
   - Создайте Blob Storage

2. **Токен создается автоматически:**

   - Vercel автоматически добавит переменную `BLOB_READ_WRITE_TOKEN` в Environment Variables
   - Ничего дополнительно настраивать не нужно!

3. **Как это работает:**
   - **Локально (development):** Файлы сохраняются в `public/uploads/` (работает без настройки)
   - **На Vercel (production):** Файлы автоматически сохраняются в Vercel Blob Storage (если `BLOB_READ_WRITE_TOKEN` установлен)

**Важно:** Убедитесь, что после создания Blob Storage переменная `BLOB_READ_WRITE_TOKEN` появилась в Environment Variables. Если нет, добавьте её вручную.

## Альтернативные платформы

### Railway

1. Подключите GitHub репозиторий
2. Добавьте PostgreSQL service
3. Настройте переменные окружения
4. Railway автоматически задеплоит

### Render

1. Создайте Web Service
2. Подключите репозиторий
3. Добавьте PostgreSQL database
4. Build Command: `prisma generate && prisma migrate deploy && npm run build`
5. Start Command: `npm start`

## Чеклист перед деплоем

- [ ] Код закоммичен и запушен в Git
- [ ] Проект собирается локально (`npm run build`)
- [ ] База данных создана (рекомендуется Prisma Postgres из Marketplace)
- [ ] Переменная `DATABASE_URL` настроена (создается автоматически для Prisma Postgres)
- [ ] ⚠️ **ОБЯЗАТЕЛЬНО:** `NEXTAUTH_SECRET` или `AUTH_SECRET` установлен на Vercel
- [ ] `NEXTAUTH_URL` указывает на production домен (например: `https://your-project.vercel.app`)
- [ ] Vercel Blob Storage создан (токен добавляется автоматически)
- [ ] Тестовые пароли изменены

### ⚠️ Критически важно: NEXTAUTH_SECRET

**Без этой переменной деплой НЕ пройдет!**

1. Сгенерируйте секретный ключ:
   ```bash
   openssl rand -base64 32
   ```

2. Добавьте в Vercel:
   - Зайдите в Settings → Environment Variables
   - Добавьте переменную `NEXTAUTH_SECRET` (или `AUTH_SECRET`)
   - Вставьте сгенерированный ключ
   - Выберите все окружения (Production, Preview, Development)
   - Сохраните

3. Перезапустите деплой после добавления переменной

## После деплоя

1. Проверьте работу сайта
2. Войдите в админ-панель
3. Измените пароли администраторов
4. Проверьте загрузку файлов
5. Настройте кастомный домен (опционально)
