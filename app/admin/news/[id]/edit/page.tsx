import { prisma } from "../../../../../lib/db";
import { notFound } from "next/navigation";
import NewsForm from "../../components/NewsForm";
import Link from "next/link";
import AdminHeader from "../../../components/AdminHeader";

interface EditNewsPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
    const { id } = await params;
    const news = await prisma.news.findUnique({
        where: { id },
    });

    if (!news) {
        notFound();
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <AdminHeader />
            <div className="mb-4">
                <Link
                    href="/admin/news"
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Back to news list
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Edit News</h1>
            <NewsForm
                initialData={{
                    id: news.id,
                    title: news.title,
                    slug: news.slug,
                    excerpt: news.excerpt,
                    content: news.content,
                    coverUrl: news.coverUrl,
                    published: news.published,
                }}
            />
        </main>
    );
}

