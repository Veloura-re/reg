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

        const grades = await prisma.grade.findMany({
            where: { schoolId: admin.schoolId },
            orderBy: { level: 'asc' }
        });

        return NextResponse.json(grades);

    } catch (e: any) {
        console.error("Failed to fetch grades:", e);
        return NextResponse.json({ error: "Internal Server Error", details: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log("Creating grade with body:", body);
        const { level } = body;

        if (!level) {
            return NextResponse.json({ error: "Level is required" }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email },
            select: { schoolId: true }
        });

        if (!admin || !admin.schoolId) {
            return NextResponse.json({ error: "No school associated" }, { status: 403 });
        }

        const newGrade = await prisma.grade.create({
            data: {
                level,
                schoolId: admin.schoolId
            }
        });

        return NextResponse.json(newGrade);

    } catch (e: any) {
        console.error("CRITICAL: Failed to create grade:", e);
        if (e.code === 'P2002') {
            return NextResponse.json({ error: "Grade level already exists" }, { status: 400 });
        }
        return NextResponse.json({
            error: "Internal Server Error",
            details: e.message,
            code: e.code
        }, { status: 500 });
    }
}
