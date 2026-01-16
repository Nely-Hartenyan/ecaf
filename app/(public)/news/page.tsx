import { prisma } from "../../../lib/db";
import Link from "next/link";

// Force dynamic rendering to avoid build-time database access
export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable caching completely

export default async function NewsPage() {
  const items = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverUrl: true,
      publishedAt: true,
    },
  });

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">News</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">Новостей пока нет.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((n) => (
            <Link
              key={n.id}
              href={`/news/${n.slug}`}
              className="block border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {n.coverUrl && (
                <div className="w-full h-48 overflow-hidden bg-gray-100">
                  <img
                    src={n.coverUrl}
                    alt={n.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 hover:text-blue-600">
                  {n.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
