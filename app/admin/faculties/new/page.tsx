import FacultyForm from "../components/FacultyForm";
import AdminHeader from "../../components/AdminHeader";
import Link from "next/link";

export default function NewFacultyPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <AdminHeader />
            <div className="mb-4">
                <Link
                    href="/admin/faculties"
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Back to faculties list
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Add Faculty</h1>
            <FacultyForm />
        </main>
    );
}

