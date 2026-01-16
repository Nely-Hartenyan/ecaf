import { prisma } from "../../../../lib/db";
import TeacherForm from "../components/TeacherForm";
import AdminHeader from "../../components/AdminHeader";
import Link from "next/link";

export default async function NewTeacherPage() {
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
            <h1 className="text-3xl font-bold mb-6">Add Teacher</h1>
            <TeacherForm faculties={faculties} />
        </main>
    );
}

