"use server";

import { prisma } from "../../lib/db";
import { newsUpsertSchema, generateSlug } from "../../lib/validators/news";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";

export async function upsertNews(formData: FormData) {
    // Check authentication
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    try {
        // Debug: log all form data keys
        console.log("FormData keys:", Array.from(formData.keys()));
        
        const coverUrlValue = formData.get("coverUrl")?.toString();
        
        const idValue = formData.get("id")?.toString();
        const rawData = {
            id: idValue && idValue.trim() !== "" ? idValue : undefined,
            title: formData.get("title")?.toString(),
            slug: formData.get("slug")?.toString() || undefined,
            excerpt: formData.get("excerpt")?.toString() || undefined,
            content: formData.get("content")?.toString(),
            coverUrl: coverUrlValue && coverUrlValue.trim() !== "" ? coverUrlValue : undefined,
            published: formData.get("published") === "on" || formData.get("published") === "true",
        };
        
        console.log("Raw data:", { ...rawData, content: rawData.content?.substring(0, 100) });


        // Generate slug from title if not provided
        if (!rawData.slug && rawData.title) {
            rawData.slug = generateSlug(rawData.title);
        }

        let parsed;
        try {
            parsed = newsUpsertSchema.parse(rawData);
            console.log("Parsed data:", { ...parsed, content: parsed.content?.substring(0, 100) });
        } catch (error: any) {
            console.error("Validation error:", error);
            console.error("Validation error details:", JSON.stringify(error.errors || error, null, 2));
            throw new Error(`Ошибка валидации: ${error.errors?.map((e: any) => e.message).join(", ") || error.message}`);
        }

        // Ensure slug is unique
        if (!parsed.slug && !parsed.title) {
            throw new Error("Заголовок обязателен для генерации URL");
        }
        let finalSlug = parsed.slug || generateSlug(parsed.title);
        
        if (!finalSlug || finalSlug.length < 3) {
            throw new Error("URL (slug) должен содержать минимум 3 символа");
        }
        
        console.log("Final slug:", finalSlug, "ID:", parsed.id);
        if (parsed.id) {
            // Check if slug is already taken by another news item (not the current one)
            const existing = await prisma.news.findFirst({
                where: { 
                    slug: finalSlug, 
                    NOT: { id: parsed.id } 
                },
            });
            if (existing) {
                finalSlug = `${finalSlug}-${Date.now()}`;
            }
        } else {
            // For new items, check if slug exists
            const existing = await prisma.news.findUnique({ where: { slug: finalSlug } });
            if (existing) {
                finalSlug = `${finalSlug}-${Date.now()}`;
            }
        }

        // Get existing news if editing
        const existingNews = parsed.id ? await prisma.news.findUnique({ where: { id: parsed.id } }) : null;
        console.log("Existing news:", existingNews ? "Found" : "Not found");

        // Determine publishedAt logic
        let publishedAt: Date | null | undefined;
        if (parsed.published) {
            // If publishing and wasn't published before, set publishedAt to now
            if (!existingNews || !existingNews.publishedAt) {
                publishedAt = new Date();
                console.log("Setting publishedAt to now");
            } else {
                // Keep existing publishedAt
                publishedAt = undefined;
                console.log("Keeping existing publishedAt");
            }
        } else {
            // If unpublishing, clear publishedAt
            publishedAt = null;
            console.log("Clearing publishedAt");
        }

        let news;
        try {
            if (parsed.id) {
                // Update existing news
                console.log("Updating existing news with ID:", parsed.id);
                news = await prisma.news.update({
                    where: { id: parsed.id },
                    data: {
                        title: parsed.title,
                        slug: finalSlug,
                        excerpt: parsed.excerpt || null,
                        content: parsed.content,
                        coverUrl: parsed.coverUrl || null,
                        published: parsed.published,
                        publishedAt: publishedAt,
                    },
                });
            } else {
                // Create new news
                console.log("Creating new news");
                news = await prisma.news.create({
                    data: {
                        title: parsed.title,
                        slug: finalSlug,
                        excerpt: parsed.excerpt || null,
                        content: parsed.content,
                        coverUrl: parsed.coverUrl || null,
                        published: parsed.published,
                        publishedAt: publishedAt as Date | null,
                    },
                });
            }
            console.log("News saved successfully:", news.id);
        } catch (error: any) {
            console.error("Database error:", error);
            console.error("Database error stack:", error.stack);
            throw new Error(`Ошибка при сохранении в базу данных: ${error.message || "Неизвестная ошибка"}`);
        }

        console.log("Revalidating paths...");
        // Revalidate all news-related paths
        revalidatePath("/news", "page");
        revalidatePath("/news", "layout");
        revalidatePath("/admin/news", "page");
        revalidatePath(`/news/${news.slug}`, "page");
        // Also revalidate the root to ensure navigation updates
        revalidatePath("/", "layout");
        
        console.log("Redirecting to /admin/news");
        redirect("/admin/news");
    } catch (error: any) {
        console.error("Error in upsertNews:", error);
        // If it's a redirect error, re-throw it (Next.js handles redirects via exceptions)
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        throw new Error(error?.message || "Произошла ошибка при сохранении новости");
    }
}

export async function deleteNews(id: string) {
    // Check authentication
    const session = await auth();
    if (!session) {
        throw new Error("Unauthorized");
    }

    await prisma.news.delete({ where: { id } });
    revalidatePath("/news");
    revalidatePath("/admin/news");
}
