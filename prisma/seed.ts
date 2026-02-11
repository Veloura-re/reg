import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await hash("ChangeMeNow!23", 12);

    // Seed Default School
    const school = await prisma.school.upsert({
        where: { slug: "riverside" },
        update: {},
        create: {
            name: "Riverside High School",
            slug: "riverside",
        }
    });

    // Seed Super Admin (The one provided to user)
    const admin = await prisma.admin.upsert({
        where: { email: "admin@riverside.edu" },
        update: {
            role: "super_admin",
            schoolId: school.id
        },
        create: {
            email: "admin@riverside.edu",
            name: "Super Admin",
            password: await hash("admin123", 12),
            role: "super_admin",
            schoolId: school.id
        },
    });

    // Seed Principal
    await prisma.admin.upsert({
        where: { email: "principal@riverside.edu" },
        update: {
            role: "registrar",
            schoolId: school.id
        },
        create: {
            email: "principal@riverside.edu",
            name: "Principal Riverside",
            password: hashedPassword,
            role: "registrar",
            schoolId: school.id,
        },
    });

    console.log("Seeded admins:", { admin_email: admin.email });

    // Seed Demo Applications
    const demoApps = [
        {
            studentName: "Alice Smith",
            studentGrade: "9",
            dateOfBirth: new Date("2008-05-15"),
            gender: "female",
            address: "123 Maple Ave, Riverside",
            parentName: "Robert Smith",
            parentEmail: "robert@example.com",
            parentPhone: "+251911223344",
            trackingCode: "CLEA-2026-A1B2C",
            status: "waiting",
            priorityFlags: ["sibling_enrolled"],
            schoolId: school.id,
        },
        {
            studentName: "Bob Johnson",
            studentGrade: "10",
            dateOfBirth: new Date("2007-08-20"),
            gender: "male",
            address: "456 Oak Le, Riverside",
            parentName: "Mary Johnson",
            parentEmail: "mary@example.com",
            parentPhone: "+251911556677",
            trackingCode: "CLEA-2026-D4E5F",
            status: "under_review",
            priorityFlags: ["staff_child"],
            schoolId: school.id,
        },
        {
            studentName: "Charlie Brown",
            studentGrade: "11",
            dateOfBirth: new Date("2006-11-30"),
            gender: "male",
            address: "789 Pine Rd, Riverside",
            parentName: "Lucy Brown",
            parentEmail: "lucy@example.com",
            parentPhone: "+251911889900",
            trackingCode: "CLEA-2026-G7H8I",
            status: "approved",
            priorityFlags: [],
            schoolId: school.id,
        },
    ];

    for (const app of demoApps) {
        await prisma.application.upsert({
            where: { trackingCode: app.trackingCode },
            update: { schoolId: school.id },
            create: {
                ...app,
                status: app.status as any,
            },
        });
    }

    console.log("Seed data created successfully");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
