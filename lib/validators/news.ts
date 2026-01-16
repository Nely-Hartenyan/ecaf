import { z } from "zod";

// Helper function to generate slug from title
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export const newsUpsertSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(3),
    slug: z.string().min(3).optional(),
    excerpt: z.string().optional(),
    content: z.string().min(1),
    coverUrl: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val || val === "") return true; // Empty is OK
                // Check if it's a valid URL or a relative path starting with /
                try {
                    new URL(val); // If this works, it's a full URL
                    return true;
                } catch {
                    // If not a full URL, check if it's a relative path
                    return val.startsWith("/");
                }
            },
            {
                message: "coverUrl must be a valid URL or a relative path starting with /",
            }
        )
        .transform((val) => {
            if (!val || val === "") return undefined;
            return val;
        }),
    published: z.boolean().default(false),
});
