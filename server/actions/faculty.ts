"use server";

import { prisma } from "../../lib/db";
import { facultyUpsertSchema } from "../../lib/validators/faculty";
import { generateSlug } from "../../lib/validators/news";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";

export async function upsertFaculty(formData: FormData) {
    // Check authentication
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        const rawData = {
            id: formData.get("id")?.toString() || undefined,
            name: formData.get("name")?.toString(),
            slug: formData.get("slug")?.toString() || undefined,
            description: formData.get("description")?.toString() || undefined,
        };

        // Generate slug from name if not provided
        if (!rawData.slug && rawData.name) {
            rawData.slug = generateSlug(rawData.name);
        }

        let parsed;
        try {
            parsed = facultyUpsertSchema.parse(rawData);
        } catch (error: any) {
            console.error("Validation error:", error);
            throw new Error(
                `Validation error: ${error.errors?.map((e: any) => e.message).join(", ") || error.message}`
            );
        }

        // Ensure slug is unique
        let finalSlug = parsed.slug || generateSlug(parsed.name);
        if (parsed.id) {
            const existing = await prisma.faculty.findFirst({
                where: { slug: finalSlug, NOT: { id: parsed.id } },
            });
            if (existing) {
                finalSlug = `${finalSlug}-${Date.now()}`;
            }
        } else {
            const existing = await prisma.faculty.findUnique({ where: { slug: finalSlug } });
            if (existing) {
                finalSlug = `${finalSlug}-${Date.now()}`;
            }
        }

        let faculty;
        if (parsed.id) {
            faculty = await prisma.faculty.update({
                where: { id: parsed.id },
                data: {
                    name: parsed.name,
                    slug: finalSlug,
                    description: parsed.description || null,
                },
            });
        } else {
            faculty = await prisma.faculty.create({
                data: {
                    name: parsed.name,
                    slug: finalSlug,
                    description: parsed.description || null,
                },
            });
        }

        revalidatePath("/admin/faculties");
        revalidatePath("/faculties");

        redirect("/admin/faculties");
    } catch (error: any) {
        console.error("Error in upsertFaculty:", error);
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        throw new Error(error?.message || "An error occurred while saving the faculty");
    }
}

export async function deleteFaculty(id: string) {
    await prisma.faculty.delete({ where: { id } });
    revalidatePath("/admin/faculties");
    revalidatePath("/faculties");
}

