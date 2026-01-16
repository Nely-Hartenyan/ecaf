import NextAuth from "next-auth";

// Generate a secret for development if not provided
const getAuthSecret = () => {
    if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
    if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET;
    if (process.env.NODE_ENV === "development") {
        // Development fallback - in production, AUTH_SECRET must be set
        return "development-secret-change-in-production";
    }
    throw new Error("AUTH_SECRET environment variable is required in production");
};

// Edge-compatible auth configuration for middleware
// This doesn't include providers or callbacks that use Node.js modules
// Minimal configuration for edge runtime
export const { auth } = NextAuth({
    trustHost: true,
    secret: getAuthSecret(),
    session: { strategy: "jwt" },
});

