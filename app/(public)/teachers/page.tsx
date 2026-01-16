import { prisma } from "../../../lib/db";

export default async function TeachersPage() {
    const teachers = await prisma.teacher.findMany({
        orderBy: { fullName: "asc" },
        include: {
            faculty: true,
        },
    });

    return (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">Our Teachers</h1>

            {teachers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No teachers available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher) => (
                        <div
                            key={teacher.id}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {teacher.photoUrl && (
                                <div className="w-full h-64 overflow-hidden bg-gray-100">
                                    <img
                                        src={teacher.photoUrl}
                                        alt={teacher.fullName}
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-2">{teacher.fullName}</h2>
                                {teacher.position && (
                                    <p className="text-blue-600 font-medium mb-2">{teacher.position}</p>
                                )}
                                {teacher.faculty && (
                                    <p className="text-sm text-gray-600 mb-3">
                                        <span className="font-medium">Faculty:</span> {teacher.faculty.name}
                                    </p>
                                )}
                                {teacher.bio && (
                                    <p className="text-gray-700 text-sm line-clamp-3">{teacher.bio}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
