import Link from "next/link";
import { logout } from "../../server/actions/auth";

export default function Admin() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Panel</h1>
                <form action={logout}>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        Log Out
                    </button>
                </form>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* News Section */}
                <Link
                    href="/admin/news"
                    className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
                >
                    <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-900">News</h2>
                    </div>
                </Link>

                {/* Teachers Section */}
                <Link
                    href="/admin/teachers"
                    className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
                >
                    <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-900">Teachers</h2>
                    </div>
                </Link>

                {/* Faculties Section */}
                <Link
                    href="/admin/faculties"
                    className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
                >
                    <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-900">Faculties</h2>
                    </div>
                </Link>
            </div>
        </main>
    );
}
