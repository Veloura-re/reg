import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email },
            select: { schoolId: true }
        });

        if (!admin || !admin.schoolId) {
            return NextResponse.json({ error: "No school associated" }, { status: 403 });
        }

        const classToDelete = await prisma.class.findUnique({
            where: { id }
        });

        if (!classToDelete || classToDelete.schoolId !== admin.schoolId) {
            return NextResponse.json({ error: "Class not found or unauthorized" }, { status: 404 });
        }

        await prisma.class.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (e) {
        console.error("Failed to delete class:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

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
        const { name, grade, description, capacity } = body;

        // Removed legacy grade level check to support dynamic grades

        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email },
            select: { schoolId: true }
        });

        if (!admin || !admin.schoolId) {
            return NextResponse.json({ error: "No school associated" }, { status: 403 });
        }

        const classToUpdate = await prisma.class.findUnique({
            where: { id }
        });

        if (!classToUpdate || classToUpdate.schoolId !== admin.schoolId) {
            return NextResponse.json({ error: "Class not found or unauthorized" }, { status: 404 });
        }

        const updatedClass = await prisma.class.update({
            where: { id },
            data: {
                name,
                gradeLevel: grade,
                description,
                capacity: capacity ? parseInt(capacity) : null
            }
        });

        return NextResponse.json(updatedClass);

    } catch (e) {
        console.error("Failed to update class:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
