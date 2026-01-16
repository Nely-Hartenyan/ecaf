# Настройка переменных окружения на Vercel

## ⚠️ Критически важно: NEXTAUTH_SECRET

Если вы получаете ошибку:
```
Error: AUTH_SECRET environment variable is required in production
```

Это значит, что на Vercel не установлена переменная `NEXTAUTH_SECRET` или `AUTH_SECRET`.

## Решение:

### Шаг 1: Сгенерируйте секретный ключ

Выполните в терминале:
```bash
openssl rand -base64 32
```

Скопируйте полученный ключ (например: `xK9mP2vQ7wR4tY8uI0oP3aS6dF1gH2jK5lM8nQ1rT4vW7xY0zA3bC6eF9gH2j`)

### Шаг 2: Добавьте переменную на Vercel

1. Зайдите на [vercel.com](https://vercel.com)
2. Откройте ваш проект
3. Перейдите в **Settings** → **Environment Variables**
4. Нажмите **Add New**
5. Добавьте переменную:
   - **Key:** `NEXTAUTH_SECRET` (или `AUTH_SECRET`)
   - **Value:** вставьте сгенерированный ключ
   - **Environment:** выберите все (Production, Preview, Development)
6. Нажмите **Save**

### Шаг 3: Перезапустите деплой

После добавления переменной:
1. Перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите **Redeploy** (три точки → Redeploy)

Или просто сделайте новый коммит и пуш - Vercel автоматически запустит новый деплой.

## Все необходимые переменные на Vercel:

### Обязательные:

1. **NEXTAUTH_SECRET** или **AUTH_SECRET** ⚠️
   - Сгенерируйте: `openssl rand -base64 32`
   - Добавьте в Environment Variables

2. **NEXTAUTH_URL**
   - Ваш production домен: `https://your-project.vercel.app`
   - Или автоматический домен Vercel

3. **DATABASE_URL**
   - Если используете Prisma Postgres - создается автоматически
   - Если используете внешний провайдер - добавьте вручную

### Опциональные:

4. **BLOB_READ_WRITE_TOKEN**
   - Создается автоматически при создании Vercel Blob Storage

## Проверка переменных:

После добавления переменных проверьте:
1. Все переменные видны в Settings → Environment Variables
2. Переменные применены ко всем окружениям (Production, Preview, Development)
3. Новый деплой запущен после добавления переменных

## Если ошибка все еще появляется:

1. Убедитесь, что переменная называется именно `NEXTAUTH_SECRET` или `AUTH_SECRET`
2. Проверьте, что переменная добавлена для окружения **Production**
3. Убедитесь, что после добавления переменной был запущен новый деплой
4. Проверьте логи деплоя - там должно быть видно, какие переменные загружены
