import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
    const admins = [
        { email: "admin1@college.am", password: "Admin12345!" },
        { email: "admin2@college.am", password: "Admin12345!" },
        { email: "admin3@college.am", password: "Admin12345!" },
    ];

    for (const a of admins) {
        const passwordHash = await bcrypt.hash(a.password, 10);
        await prisma.user.upsert({
            where: { email: a.email },
            update: { passwordHash },
            create: { email: a.email, passwordHash, role: "ADMIN" },
        });
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
