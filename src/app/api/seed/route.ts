import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function GET() {
    try {
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

        // Seed Super Admin
        const admin = await prisma.admin.upsert({
            where: { email: "principal@riverside.edu" },
            update: {
                role: "super_admin",
                schoolId: school.id
            },
            create: {
                email: "principal@riverside.edu",
                name: "Principal Riverside",
                password: hashedPassword,
                role: "super_admin",
            },
        });

        // Seed Demo Applications
        const demoApps = [
            {
                studentName: "Alice Smith",
                studentGrade: "9",
                parentName: "Robert Smith",
                parentEmail: "robert@example.com",
                parentPhone: "+251911223344",
                trackingCode: "CLEA-2026-A1B2C",
                status: "waiting",
                priorityFlags: ["sibling_enrolled"],
                schoolId: school.id,
                dateOfBirth: new Date("2008-05-15"),
                gender: "female",
                address: "123 River St",
            },
            {
                studentName: "Bob Johnson",
                studentGrade: "10",
                parentName: "Mary Johnson",
                parentEmail: "mary@example.com",
                parentPhone: "+251911556677",
                trackingCode: "CLEA-2026-D4E5F",
                status: "under_review",
                priorityFlags: ["staff_child"],
                schoolId: school.id,
                dateOfBirth: new Date("2007-08-20"),
                gender: "male",
                address: "456 Oak Ave",
            },
            {
                studentName: "Charlie Brown",
                studentGrade: "11",
                parentName: "Lucy Brown",
                parentEmail: "lucy@example.com",
                parentPhone: "+251911889900",
                trackingCode: "CLEA-2026-G7H8I",
                status: "approved",
                priorityFlags: [],
                schoolId: school.id,
                dateOfBirth: new Date("2006-12-01"),
                gender: "male",
                address: "789 Pine Ln",
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

        return NextResponse.json({ success: true, admin, school });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
