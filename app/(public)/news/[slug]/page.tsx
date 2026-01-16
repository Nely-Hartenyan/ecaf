import { prisma } from "../../../../lib/db";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

interface NewsItemPageProps {
    params: Promise<{ slug: string }>;
}

export default async function NewsItemPage({ params }: NewsItemPageProps) {
    const { slug } = await params;
    const n = await prisma.news.findUnique({ where: { slug } });
    if (!n || !n.published) return notFound();

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <article>
                <h1 className="text-4xl font-bold mb-4">{n.title}</h1>
                
                {n.publishedAt && (
                    <p className="text-gray-500 mb-6">
                        {new Date(n.publishedAt).toLocaleDateString("ru-RU", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                )}

                {n.coverUrl && (
                    <div className="mb-6 rounded-lg overflow-hidden">
                        <img
                            src={n.coverUrl}
                            alt={n.title}
                            className="w-full max-w-4xl h-auto max-h-96 object-cover"
                        />
                    </div>
                )}

                {n.excerpt && (
                    <p className="text-xl text-gray-600 mb-6 italic">{n.excerpt}</p>
                )}

                <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap">{n.content}</div>
                </div>
            </article>
        </main>
    );
}
