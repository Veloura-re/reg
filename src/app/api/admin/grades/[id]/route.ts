import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { level } = body;

        const grade = await prisma.grade.update({
            where: { id },
            data: { level }
        });

        return NextResponse.json(grade);
    } catch (e: any) {
        console.error("CRITICAL: Failed to update grade:", e);
        return NextResponse.json({
            error: "Internal Server Error",
            details: e.message,
            code: e.code
        }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Check if grade has classes
        const classCount = await prisma.class.count({
            where: { gradeId: id }
        });

        if (classCount > 0) {
            return NextResponse.json({ error: "Cannot delete grade with existing classes" }, { status: 400 });
        }

        await prisma.grade.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("CRITICAL: Failed to delete grade:", e);
        return NextResponse.json({
            error: "Internal Server Error",
            details: e.message,
            code: e.code
        }, { status: 500 });
    }
}
