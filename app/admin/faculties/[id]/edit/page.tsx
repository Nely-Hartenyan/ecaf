import { prisma } from "../../../../../lib/db";
import { notFound } from "next/navigation";
import FacultyForm from "../../components/FacultyForm";
import AdminHeader from "../../../components/AdminHeader";
import Link from "next/link";

interface EditFacultyPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditFacultyPage({ params }: EditFacultyPageProps) {
    const { id } = await params;
    const faculty = await prisma.faculty.findUnique({
        where: { id },
    });

    if (!faculty) {
        notFound();
    }

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
            <h1 className="text-3xl font-bold mb-6">Edit Faculty</h1>
            <FacultyForm
                initialData={{
                    id: faculty.id,
                    name: faculty.name,
                    slug: faculty.slug,
                    description: faculty.description,
                }}
            />
        </main>
    );
}

