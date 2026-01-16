"use server";

import { prisma } from "../../lib/db";
import { teacherUpsertSchema } from "../../lib/validators/teacher";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";

export async function upsertTeacher(formData: FormData) {
    // Check authentication
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        const photoUrlValue = formData.get("photoUrl")?.toString();

        const rawData = {
            id: formData.get("id")?.toString() || undefined,
            fullName: formData.get("fullName")?.toString(),
            position: formData.get("position")?.toString() || undefined,
            bio: formData.get("bio")?.toString() || undefined,
            photoUrl: photoUrlValue && photoUrlValue.trim() !== "" ? photoUrlValue : undefined,
            facultyId: formData.get("facultyId")?.toString() || undefined,
        };

        let parsed;
        try {
            parsed = teacherUpsertSchema.parse(rawData);
        } catch (error: any) {
            console.error("Validation error:", error);
            throw new Error(
                `Validation error: ${error.errors?.map((e: any) => e.message).join(", ") || error.message}`
            );
        }

        let teacher;
        if (parsed.id) {
            // Update existing teacher
            teacher = await prisma.teacher.update({
                where: { id: parsed.id },
                data: {
                    fullName: parsed.fullName,
                    position: parsed.position || null,
                    bio: parsed.bio || null,
                    photoUrl: parsed.photoUrl || null,
                    facultyId: parsed.facultyId || null,
                },
            });
        } else {
            // Create new teacher
            teacher = await prisma.teacher.create({
                data: {
                    fullName: parsed.fullName,
                    position: parsed.position || null,
                    bio: parsed.bio || null,
                    photoUrl: parsed.photoUrl || null,
                    facultyId: parsed.facultyId || null,
                },
            });
        }

        revalidatePath("/admin/teachers");
        revalidatePath("/teachers");

        redirect("/admin/teachers");
    } catch (error: any) {
        console.error("Error in upsertTeacher:", error);
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        throw new Error(error?.message || "An error occurred while saving the teacher");
    }
}

export async function deleteTeacher(id: string) {
    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/admin/teachers");
    revalidatePath("/teachers");
}

