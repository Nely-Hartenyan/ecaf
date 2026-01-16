import Link from "next/link";

export default function Home() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome to Our College</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Discover our news, meet our teachers, and explore our faculties
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/news"
                    className="block p-8 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border-2 border-blue-200 hover:border-blue-400"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-4">📰</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">News</h2>
                        <p className="text-gray-600">Stay updated with the latest college news and events</p>
                    </div>
                </Link>

                <Link
                    href="/teachers"
                    className="block p-8 bg-green-50 rounded-lg hover:bg-green-100 transition-colors border-2 border-green-200 hover:border-green-400"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-4">👨‍🏫</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Teachers</h2>
                        <p className="text-gray-600">Meet our experienced and dedicated teaching staff</p>
                    </div>
                </Link>

                <Link
                    href="/faculties"
                    className="block p-8 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border-2 border-purple-200 hover:border-purple-400"
                >
                    <div className="text-center">
                        <div className="text-4xl mb-4">🏛️</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Faculties</h2>
                        <p className="text-gray-600">Explore our diverse range of academic faculties</p>
                    </div>
                </Link>
            </div>
        </main>
    );
}
