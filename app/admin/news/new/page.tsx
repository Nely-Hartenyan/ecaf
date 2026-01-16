import NewsForm from "../components/NewsForm";
import Link from "next/link";
import AdminHeader from "../../components/AdminHeader";

export default function NewNewsPage() {
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
            <h1 className="text-3xl font-bold mb-6">Create News</h1>
            <NewsForm />
        </main>
    );
}

