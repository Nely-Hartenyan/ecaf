import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
    pool?: pg.Pool;
};

// Поддержка Vercel Postgres и обычного PostgreSQL
// Vercel создает POSTGRES_PRISMA_URL для Prisma с connection pooling
// Для обычного использования используем DATABASE_URL или POSTGRES_URL_NON_POOLING
const connectionString = 
    process.env.DATABASE_URL || 
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
    throw new Error(
        "DATABASE_URL или POSTGRES_URL_NON_POOLING не установлены. " +
        "Пожалуйста, настройте переменную окружения для подключения к базе данных."
    );
}

const pool =
    globalForPrisma.pool ??
    new Pool({
        connectionString,
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
