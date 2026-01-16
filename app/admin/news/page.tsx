import { prisma } from "../../../lib/db";
import Link from "next/link";
import { deleteNews } from "../../../server/actions/news";
import AdminHeader from "../components/AdminHeader";

export default async function AdminNewsPage() {
    const items = await prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            published: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <AdminHeader />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">News management</h1>
                <Link
                    href="/admin/news/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    + Add News
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>There are no news items yet. Be the first to post!</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                                <th className="border border-gray-300 px-4 py-2 text-left">Date of creation</th>
                                <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((n) => (
                                <tr key={n.id} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Link
                                            href={`/admin/news/${n.id}/edit`}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {n.title}
                                        </Link>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <span
                                            className={`inline-block px-2 py-1 rounded text-sm ${
                                                n.published
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {n.published ? "Опубликовано" : "Черновик"}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                                        {new Date(n.createdAt).toLocaleDateString("ru-RU", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </td>
                                    <td className="border border-gray-300 px-6 py-2">
                                        <div className="flex gap-2 justify-center">
                                            <Link
                                                href={`/admin/news/${n.id}/edit`}
                                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    if (confirm("Вы уверены, что хотите удалить эту новость?")) {
                                                        await deleteNews(n.id);
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
