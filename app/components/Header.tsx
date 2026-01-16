import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                        College Site
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/news"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            News
                        </Link>
                        <Link
                            href="/teachers"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Teachers
                        </Link>
                        <Link
                            href="/faculties"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Faculties
                        </Link>
                        <Link
                            href="/gallery"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Gallery
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}

