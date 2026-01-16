"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertTeacher } from "../../../../server/actions/teacher";

interface TeacherFormProps {
    initialData?: {
        id?: string;
        fullName: string;
        position?: string | null;
        bio?: string | null;
        photoUrl?: string | null;
        facultyId?: string | null;
    };
    faculties: Array<{ id: string; name: string }>;
}

export default function TeacherForm({ initialData, faculties }: TeacherFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || "",
        position: initialData?.position || "",
        bio: initialData?.bio || "",
        photoUrl: initialData?.photoUrl || "",
        facultyId: initialData?.facultyId || "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formDataToSubmit = new FormData();

        if (initialData?.id) {
            formDataToSubmit.append("id", initialData.id);
        }

        formDataToSubmit.append("fullName", formData.fullName);
        if (formData.position) {
            formDataToSubmit.append("position", formData.position);
        }
        if (formData.bio) {
            formDataToSubmit.append("bio", formData.bio);
        }
        if (formData.photoUrl) {
            formDataToSubmit.append("photoUrl", formData.photoUrl);
        }
        if (formData.facultyId) {
            formDataToSubmit.append("facultyId", formData.facultyId);
        }

        try {
            setError(null);
            await upsertTeacher(formDataToSubmit);
        } catch (error: any) {
            console.error("Error saving teacher:", error);
            if (error?.digest?.startsWith("NEXT_REDIRECT")) {
                return;
            }
            setError(error?.message || "Error saving teacher. Please check all fields.");
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                throw new Error(error.error || "Upload error");
            }

            const data = await response.json();
            setFormData({ ...formData, photoUrl: data.url });
        } catch (error: any) {
            setError(error?.message || "Error uploading image");
        } finally {
            setIsUploading(false);
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
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    minLength={2}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div>
                <label htmlFor="position" className="block text-sm font-medium mb-2">
                    Position
                </label>
                <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g., Professor, Associate Professor"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div>
                <label htmlFor="facultyId" className="block text-sm font-medium mb-2">
                    Faculty
                </label>
                <select
                    id="facultyId"
                    name="facultyId"
                    value={formData.facultyId}
                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Select a faculty</option>
                    {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                            {faculty.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium mb-2">
                    Biography
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={5}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            <div>
                <label htmlFor="photoUrl" className="block text-sm font-medium mb-2">
                    Photo
                </label>

                <div className="mb-4">
                    <label
                        htmlFor="file-upload"
                        className="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 text-sm font-medium"
                    >
                        {isUploading ? "Uploading..." : "Upload Image"}
                    </label>
                    <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                </div>

                <input
                    type="hidden"
                    name="photoUrl"
                    value={formData.photoUrl}
                />

                {formData.photoUrl && (
                    <div className="mt-4">
                        <img
                            src={formData.photoUrl}
                            alt="Preview"
                            className="max-w-md rounded-md border border-gray-300"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, photoUrl: "" })}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Remove image
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

