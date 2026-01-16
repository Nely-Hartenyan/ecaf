# Быстрое решение: Создать администратора на Vercel

## Проблема
После деплоя логин не работает: "Invalid email or password"

## Решение (5 минут)

### Шаг 1: Установите Vercel CLI
```bash
npm i -g vercel
```

### Шаг 2: Подключитесь к проекту
```bash
cd /Users/nely/Desktop/ecaf
vercel link
```

### Шаг 3: Получите переменные окружения
```bash
vercel env pull .env.local
```

### Шаг 4: Запустите seed скрипт
```bash
npx prisma db seed
```

Это создаст трех администраторов:
- **Email:** `admin1@college.am` **Password:** `Admin12345!`
- **Email:** `admin2@college.am` **Password:** `Admin12345!`
- **Email:** `admin3@college.am` **Password:** `Admin12345!`

### Шаг 5: Войдите в админ-панель
Откройте ваш сайт на Vercel и войдите используя:
- Email: `admin1@college.am`
- Password: `Admin12345!`

## Альтернатива: Создать одного админа

Если хотите создать только одного администратора:

```bash
npm run db:create-admin
```

Или с кастомными данными:
```bash
ADMIN_EMAIL="admin@college.am" ADMIN_PASSWORD="YourPassword123!" npm run db:create-admin
```

## ⚠️ Важно: Безопасность

После первого входа **обязательно измените пароли** администраторов!

1. Войдите в админ-панель
2. Создайте новых администраторов с безопасными паролями
3. Удалите тестовых администраторов

## Готово! ✅

Теперь логин должен работать.
