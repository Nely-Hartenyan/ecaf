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

        if (blobReadWriteToken) {
            // Production: Use Vercel Blob Storage
            const blob = await put(filename, file, {
                access: "public",
                token: blobReadWriteToken,
            });

            return NextResponse.json({ url: blob.url });
        } else {
            // Development: Use local filesystem
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
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Ошибка при загрузке файла" },
            { status: 500 }
        );
    }
}

