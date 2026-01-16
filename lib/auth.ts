import "server-only";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

// Generate a secret for development if not provided
const getAuthSecret = () => {
    if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
    if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET;
    if (process.env.NODE_ENV === "development") {
        // Development fallback - in production, AUTH_SECRET must be set
        return "development-secret-change-in-production";
    }
    throw new Error(
        "AUTH_SECRET or NEXTAUTH_SECRET environment variable is required in production. " +
        "Please set one of these variables in your Vercel project settings: " +
        "Settings → Environment Variables → Add AUTH_SECRET or NEXTAUTH_SECRET"
    );
};

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    secret: getAuthSecret(),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                const { email, password } = loginSchema.parse(credentials);

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user) return null;

                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;

                return { id: user.id, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as any).role;
            return token;
        },
        async session({ session, token }) {
            (session as any).role = token.role;
            return session;
        },
    },
});
