import { z } from "zod";
import { generateSlug } from "./news";

export const facultyUpsertSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
});

