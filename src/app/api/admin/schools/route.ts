import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, slug } = await req.json();

        const existing = await prisma.school.findUnique({
            where: { slug }
        });

        if (existing) {
            return NextResponse.json({ error: "School slug already exists" }, { status: 400 });
        }

        const school = await prisma.school.create({
            data: { name, slug }
        });

        return NextResponse.json(school);
    } catch (e) {
        return NextResponse.json({ error: "Failed to create school" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schools = await prisma.school.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(schools);
}
