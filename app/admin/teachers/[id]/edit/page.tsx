import { prisma } from "../../../../../lib/db";
import { notFound } from "next/navigation";
import TeacherForm from "../../components/TeacherForm";
import AdminHeader from "../../../components/AdminHeader";
import Link from "next/link";

interface EditTeacherPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditTeacherPage({ params }: EditTeacherPageProps) {
    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({
        where: { id },
    });

    if (!teacher) {
        notFound();
    }

    const faculties = await prisma.faculty.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <AdminHeader />
            <div className="mb-4">
                <Link
                    href="/admin/teachers"
                    className="text-blue-600 hover:underline text-sm"
                >
                    ← Back to teachers list
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Edit Teacher</h1>
            <TeacherForm
                initialData={{
                    id: teacher.id,
                    fullName: teacher.fullName,
                    position: teacher.position,
                    bio: teacher.bio,
                    photoUrl: teacher.photoUrl,
                    facultyId: teacher.facultyId,
                }}
                faculties={faculties}
            />
        </main>
    );
}

