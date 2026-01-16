import { z } from "zod";

export const teacherUpsertSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    position: z.string().optional(),
    bio: z.string().optional(),
    photoUrl: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val || val === "") return true;
                try {
                    new URL(val);
                    return true;
                } catch {
                    return val.startsWith("/");
                }
            },
            {
                message: "photoUrl must be a valid URL or a relative path starting with /",
            }
        )
        .transform((val) => {
            if (!val || val === "") return undefined;
            return val;
        }),
    facultyId: z.string().optional(),
});

