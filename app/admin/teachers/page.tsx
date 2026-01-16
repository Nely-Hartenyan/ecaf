import { prisma } from "../../../lib/db";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";
import { deleteTeacher } from "../../../server/actions/teacher";

export default async function AdminTeachersPage() {
    const teachers = await prisma.teacher.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            faculty: true,
        },
    });

    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <AdminHeader />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Teachers Management</h1>
                <Link
                    href="/admin/teachers/new"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    + Add Teacher
                </Link>
            </div>

            {teachers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No teachers yet. Add the first teacher!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Full Name</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Position</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Faculty</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Date Created</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2 font-medium">
                                        {teacher.fullName}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {teacher.position || "-"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {teacher.faculty?.name || "-"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                        {new Date(teacher.createdAt).toLocaleDateString("ru-RU", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="flex gap-2 justify-center">
                                            <Link
                                                href={`/admin/teachers/${teacher.id}/edit`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    if (confirm("Are you sure you want to delete this teacher?")) {
                                                        await deleteTeacher(teacher.id);
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

