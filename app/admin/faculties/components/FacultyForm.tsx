"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { upsertFaculty } from "../../../../server/actions/faculty";
import { generateSlug } from "../../../../lib/validators/news";

interface FacultyFormProps {
    initialData?: {
        id?: string;
        name: string;
        slug: string;
        description?: string | null;
    };
}

export default function FacultyForm({ initialData }: FacultyFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [autoGenerateSlug, setAutoGenerateSlug] = useState(!initialData);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
    });

    // Auto-generate slug from name when name changes and auto-generate is enabled
    useEffect(() => {
        if (autoGenerateSlug && formData.name) {
            setFormData((prev) => ({
                ...prev,
                slug: generateSlug(formData.name),
            }));
        }
    }, [formData.name, autoGenerateSlug]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formDataToSubmit = new FormData();

        if (initialData?.id) {
            formDataToSubmit.append("id", initialData.id);
        }

        formDataToSubmit.append("name", formData.name);
        formDataToSubmit.append("slug", formData.slug);
        if (formData.description) {
            formDataToSubmit.append("description", formData.description);
        }

        try {
            setError(null);
            await upsertFaculty(formDataToSubmit);
        } catch (error: any) {
            console.error("Error saving faculty:", error);
            if (error?.digest?.startsWith("NEXT_REDIRECT")) {
                return;
            }
            setError(error?.message || "Error saving faculty. Please check all fields.");
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
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Faculty Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                        Auto-generate from name
                    </label>
                </div>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    minLength={2}
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
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

