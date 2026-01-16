# Как добавить переменную окружения на Vercel

## Быстрая инструкция

### 1. Сгенерируйте ключ
```bash
openssl rand -base64 32
```
Скопируйте полученную строку.

### 2. Добавьте на Vercel

1. Откройте https://vercel.com
2. Выберите ваш проект
3. **Settings** (вверху) → **Environment Variables** (слева)
4. Нажмите **Add New**
5. Заполните:
   - **Key:** `NEXTAUTH_SECRET`
   - **Value:** вставьте скопированный ключ
   - **Environment:** отметьте все три (Production, Preview, Development)
6. Нажмите **Save**

### 3. Перезапустите деплой

**Вариант A:** В интерфейсе Vercel
- **Deployments** → последний деплой → три точки (⋮) → **Redeploy**

**Вариант B:** Через Git
```bash
git commit --allow-empty -m "Redeploy"
git push
```

## Готово! ✅

После этого деплой должен пройти успешно.
