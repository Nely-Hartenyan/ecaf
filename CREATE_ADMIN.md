# Создание администратора в базе данных

## Проблема: "Invalid email or password"

Если вы получаете эту ошибку при попытке войти, значит в базе данных нет администраторов.

## Решение: Запустить seed скрипт

### Вариант 1: Через Vercel CLI (Рекомендуется)

1. **Установите Vercel CLI** (если еще не установлен):
   ```bash
   npm i -g vercel
   ```

2. **Подключитесь к проекту:**
   ```bash
   vercel link
   ```

3. **Получите переменные окружения:**
   ```bash
   vercel env pull .env.local
   ```

4. **Запустите seed скрипт:**
   ```bash
   npx prisma db seed
   ```

   Это создаст трех администраторов:
   - `admin1@college.am` / `Admin12345!`
   - `admin2@college.am` / `Admin12345!`
   - `admin3@college.am` / `Admin12345!`

### Вариант 2: Через Prisma Studio (Визуально)

1. **Подключитесь к проекту Vercel:**
   ```bash
   vercel link
   vercel env pull .env.local
   ```

2. **Откройте Prisma Studio:**
   ```bash
   npx prisma studio
   ```

3. **Создайте пользователя вручную:**
   - Откройте модель `User`
   - Нажмите "Add record"
   - Заполните:
     - `email`: `admin@college.am`
     - `passwordHash`: сгенерируйте хеш пароля (см. ниже)
     - `role`: `ADMIN`
   - Сохраните

4. **Сгенерировать хеш пароля:**
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword123!', 10).then(hash => console.log(hash));"
   ```

### Вариант 3: Через SQL напрямую

Если у вас есть доступ к базе данных через SQL клиент:

```sql
-- Сначала сгенерируйте хеш пароля:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin12345!', 10).then(hash => console.log(hash));"

-- Затем вставьте в базу данных:
INSERT INTO "User" (id, email, "passwordHash", role, "createdAt", "updatedAt")
VALUES (
  'clx1234567890',  -- сгенерируйте уникальный ID
  'admin@college.am',
  '$2a$10$...',  -- вставьте сгенерированный хеш
  'ADMIN',
  NOW(),
  NOW()
);
```

## Быстрый способ: Создать одного админа через скрипт

Создайте файл `create-admin.ts`:

```typescript
import { prisma } from "./lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@college.am";
  const password = "Admin12345!";
  const passwordHash = await bcrypt.hash(password, 10);
  
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, role: "ADMIN" },
  });
  
  console.log(`✅ Администратор создан: ${email} / ${password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Запустите:
```bash
npx tsx create-admin.ts
```

## Проверка

После создания администратора попробуйте войти:
- Email: `admin1@college.am` (или тот, который вы создали)
- Password: `Admin12345!`

## Важно: Безопасность

⚠️ **После первого входа обязательно измените пароли администраторов!**

1. Войдите в админ-панель
2. Создайте новых администраторов с безопасными паролями
3. Удалите тестовых администраторов с паролем `Admin12345!`
