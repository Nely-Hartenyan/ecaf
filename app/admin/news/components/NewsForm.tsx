"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { upsertNews } from "../../../../server/actions/news";
import { generateSlug } from "../../../../lib/validators/news";

interface NewsFormProps {
    initialData?: {
        id?: string;
        title: string;
        slug: string;
        excerpt?: string | null;
        content: string;
        coverUrl?: string | null;
        published: boolean;
    };
}

export default function NewsForm({ initialData }: NewsFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [autoGenerateSlug, setAutoGenerateSlug] = useState(!initialData);
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        coverUrl: initialData?.coverUrl || "",
        published: initialData?.published || false,
    });

    // Auto-generate slug from title when title changes and auto-generate is enabled
    useEffect(() => {
        if (autoGenerateSlug && formData.title) {
            setFormData((prev) => ({
                ...prev,
                slug: generateSlug(formData.title),
            }));
        }
    }, [formData.title, autoGenerateSlug]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create FormData manually to avoid prefix issues
        const formDataToSubmit = new FormData();
        
        if (initialData?.id) {
            formDataToSubmit.append("id", initialData.id);
        }
        
        formDataToSubmit.append("title", formData.title);
        formDataToSubmit.append("slug", formData.slug);
        
        if (formData.excerpt) {
            formDataToSubmit.append("excerpt", formData.excerpt);
        }
        
        if (formData.coverUrl) {
            formDataToSubmit.append("coverUrl", formData.coverUrl);
        }
        
        formDataToSubmit.append("content", formData.content);
        
        if (formData.published) {
            formDataToSubmit.append("published", "on");
        }

        try {
            setError(null);
            await upsertNews(formDataToSubmit);
            // If successful, redirect will happen in server action
        } catch (error: any) {
            console.error("Error saving news:", error);
            // Don't show error for redirects (Next.js uses exceptions for redirects)
            if (error?.digest?.startsWith("NEXT_REDIRECT")) {
                // Redirect is happening, don't show error
                return;
            }
            setError(error?.message || "Error saving news. Check all fields.");
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}
            <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    minLength={3}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div>
                <div className="flex items-center gap-2 mb-2">
                    <label htmlFor="slug" className="block text-sm font-medium">
                        URL (slug) *
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={autoGenerateSlug}
                            onChange={(e) => setAutoGenerateSlug(e.target.checked)}
                            className="rounded"
                        />
                        Auto-generation from title
                    </label>
                </div>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    minLength={3}
                    value={formData.slug}
                    onChange={(e) => {
                        setFormData({ ...formData, slug: e.target.value });
                        setAutoGenerateSlug(false);
                    }}
                    disabled={autoGenerateSlug}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
            </div>

            <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                    Brief description
                </label>
                <br/>
                <textarea
                    id="excerpt"
                    name="excerpt"
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div>
                <label htmlFor="coverUrl" className="block text-sm font-medium mb-2">
                    Cover
                </label>
                
                {/* File upload */}
                <div className="mb-4">
                    <label
                        htmlFor="file-upload"
                        className="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 text-sm font-medium"
                    >
                        {isUploading ? "Loading..." : "Upload image"}
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsUploading(true);
                            setError(null);

                            try {
                                const uploadFormData = new FormData();
                                uploadFormData.append("file", file);

                                const response = await fetch("/api/upload", {
                                    method: "POST",
                                    body: uploadFormData,
                                });

                                if (!response.ok) {
                                    const error = await response.json();
                                    throw new Error(error.error || "Ошибка при загрузке");
                                }

                                const data = await response.json();
                                setFormData({ ...formData, coverUrl: data.url });
                            } catch (error: any) {
                                setError(error?.message || "Ошибка при загрузке изображения");
                            } finally {
                                setIsUploading(false);
                            }
                        }}
                        disabled={isUploading}
                    />
                </div>

                {/* Hidden input for coverUrl */}
                <input
                    type="hidden"
                    name="coverUrl"
                    value={formData.coverUrl}
                />

                {/* Preview */}
                {formData.coverUrl && (
                    <div className="mt-4">
                        <img
                            src={formData.coverUrl}
                            alt="Preview"
                            className="max-w-md rounded-md border border-gray-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, coverUrl: "" })}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Delete image
                        </button>
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Content *
                </label>
                <textarea
                    id="content"
                    name="content"
                    required
                    rows={15}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded"
                />
                <label htmlFor="published" className="text-sm font-medium">
                    Published
                </label>
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Saving..." : "Save"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

