import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
    const email = process.env.ADMIN_EMAIL || "admin@college.am";
    const password = process.env.ADMIN_PASSWORD || "Admin12345!";
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.upsert({
        where: { email },
        update: { passwordHash },
        create: { email, passwordHash, role: "ADMIN" },
    });
    
    console.log(`✅ Администратор создан/обновлен:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   ID: ${user.id}`);
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error("❌ Ошибка:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
