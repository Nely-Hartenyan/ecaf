import { prisma } from "../../../lib/db";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";
import { deleteFaculty } from "../../../server/actions/faculty";

export default async function AdminFacultiesPage() {
    const faculties = await prisma.faculty.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { teachers: true },
            },
        },
    });

    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <AdminHeader />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Faculties Management</h1>
                <Link
                    href="/admin/faculties/new"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                    + Add Faculty
                </Link>
            </div>

            {faculties.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No faculties yet. Add the first faculty!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Slug</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Teachers</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Date Created</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculties.map((faculty) => (
                                <tr key={faculty.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2 font-medium">
                                        {faculty.name}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                        {faculty.slug}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {faculty.description ? (
                                            <span className="text-sm text-gray-600 line-clamp-2">
                                                {faculty.description}
                                            </span>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                            {faculty._count.teachers}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                        {new Date(faculty.createdAt).toLocaleDateString("ru-RU", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="flex gap-2 justify-center">
                                            <Link
                                                href={`/admin/faculties/${faculty.id}/edit`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    if (
                                                        confirm(
                                                            "Are you sure you want to delete this faculty? This will also remove all associated teachers."
                                                        )
                                                    ) {
                                                        await deleteFaculty(faculty.id);
                                                    }
                                                }}
                                                className="inline"
                                            >
                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}

