import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Файл должен быть изображением" }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Размер файла не должен превышать 5MB" }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filename = `${timestamp}-${originalName}`;

        // Use Vercel Blob Storage in production, local filesystem in development
        const blobReadWriteToken = process.env.BLOB_READ_WRITE_TOKEN;
        const isVercel = process.env.VERCEL === "1";

        if (blobReadWriteToken) {
            // Production: Use Vercel Blob Storage
            try {
                const blob = await put(filename, file, {
                    access: "public",
                    token: blobReadWriteToken,
                });

                return NextResponse.json({ url: blob.url });
            } catch (blobError: any) {
                console.error("Vercel Blob Storage error:", blobError);
                console.error("Blob error details:", {
                    message: blobError?.message,
                    status: blobError?.status,
                    code: blobError?.code,
                });
                
                // On Vercel, we can't use filesystem, so return error
                if (isVercel) {
                    return NextResponse.json(
                        { 
                            error: "Ошибка при загрузке в Blob Storage. Проверьте настройки Vercel Blob Storage.",
                            details: process.env.NODE_ENV === "development" ? blobError?.message : undefined
                        },
                        { status: 500 }
                    );
                }
                // Fallback to local filesystem only in development
                console.log("Falling back to local filesystem storage");
            }
        } else if (isVercel) {
            // On Vercel without Blob Storage token, return error
            return NextResponse.json(
                { 
                    error: "BLOB_READ_WRITE_TOKEN не установлен. Создайте Vercel Blob Storage в настройках проекта."
                },
                { status: 500 }
            );
        }

        // Development only: Use local filesystem
        // Note: This only works in local development, not on Vercel
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Ensure uploads directory exists
            const uploadsDir = join(process.cwd(), "public", "uploads");
            if (!existsSync(uploadsDir)) {
                mkdirSync(uploadsDir, { recursive: true });
            }

            // Save file locally
            const filepath = join(uploadsDir, filename);
            await writeFile(filepath, buffer);

            // Return URL
            const url = `/uploads/${filename}`;
            return NextResponse.json({ url });
        } catch (fsError: any) {
            console.error("Local filesystem error:", fsError);
            throw new Error(`Failed to save file: ${fsError.message}`);
        }
    } catch (error: any) {
        console.error("Error uploading file:", error);
        console.error("Error details:", {
            message: error?.message,
            stack: error?.stack,
            name: error?.name,
        });
        return NextResponse.json(
            { 
                error: "Ошибка при загрузке файла",
                details: process.env.NODE_ENV === "development" ? error?.message : undefined
            },
            { status: 500 }
        );
    }
}

