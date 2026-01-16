import { prisma } from "../../../lib/db";

// Force dynamic rendering to avoid build-time database access
export const dynamic = 'force-dynamic';

export default async function FacultiesPage() {
    const faculties = await prisma.faculty.findMany({
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: { teachers: true },
            },
            teachers: {
                take: 5,
                orderBy: { fullName: "asc" },
            },
        },
    });

    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Our Faculties</h1>

            {faculties.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No faculties available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {faculties.map((faculty) => (
                        <div
                            key={faculty.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold mb-2">{faculty.name}</h2>
                                    {faculty.description && (
                                        <p className="text-gray-600 mb-4">{faculty.description}</p>
                                    )}
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {faculty._count.teachers} {faculty._count.teachers === 1 ? "teacher" : "teachers"}
                                </span>
                            </div>

                            {faculty.teachers.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Teachers:</h3>
                                    <ul className="space-y-1">
                                        {faculty.teachers.map((teacher) => (
                                            <li key={teacher.id} className="text-sm text-gray-600">
                                                {teacher.fullName}
                                                {teacher.position && (
                                                    <span className="text-gray-400"> - {teacher.position}</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    {faculty._count.teachers > 5 && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            and {faculty._count.teachers - 5} more...
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
