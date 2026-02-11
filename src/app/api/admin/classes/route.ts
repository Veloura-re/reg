import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email },
            select: { schoolId: true }
        });

        if (!admin || !admin.schoolId) {
            return NextResponse.json({ error: "No school associated" }, { status: 403 });
        }

        const classes = await prisma.class.findMany({
            where: { schoolId: admin.schoolId },
            include: {
                _count: {
                    select: { applications: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(classes);

    } catch (e) {
        console.error("Failed to fetch classes:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, gradeId, description, capacity } = body;

        if (!gradeId) {
            return NextResponse.json({ error: "Grade is required" }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email },
            select: { schoolId: true, role: true }
        });

        if (!admin || !admin.schoolId) {
            return NextResponse.json({ error: "No school associated" }, { status: 403 });
        }

        // Resolve grade level from Grade model for legacy 'grade' field
        const gradeObj = await prisma.grade.findUnique({
            where: { id: gradeId }
        });

        if (!gradeObj) {
            return NextResponse.json({ error: "Grade level not found" }, { status: 400 });
        }

        const newClass = await prisma.class.create({
            data: {
                name,
                gradeLevel: gradeObj.level,
                gradeId,
                description,
                capacity: capacity ? parseInt(capacity) : null,
                schoolId: admin.schoolId
            }
        });

        return NextResponse.json(newClass);

    } catch (e) {
        console.error("Failed to create class:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
