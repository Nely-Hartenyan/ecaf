import Link from "next/link";
import { logout } from "../../../server/actions/auth";

export default function AdminHeader() {
    return (
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <Link
                href="/admin"
                className="text-xl font-semibold text-gray-900 hover:text-blue-600"
            >
                Admin Panel
            </Link>
            <form action={logout}>
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                    Log Out
                </button>
            </form>
        </div>
    );
}

