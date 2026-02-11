import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ school: string }> }
) {
    try {
        const { school: schoolSlug } = await params;
        const { searchParams } = new URL(req.url);
        const gradeFilter = searchParams.get('grade');

        const school = await prisma.school.findUnique({
            where: { slug: schoolSlug },
            select: { id: true }
        });

        if (!school) {
            return NextResponse.json({ error: "School not found" }, { status: 404 });
        }

        const classes = await prisma.class.findMany({
            where: {
                schoolId: school.id,
                ...(gradeFilter && { gradeLevel: gradeFilter })
            },
            select: {
                id: true,
                name: true,
                gradeLevel: true,
                description: true,
                capacity: true,
                _count: {
                    select: { applications: true }
                }
            },
            orderBy: [
                { gradeLevel: 'asc' },
                { name: 'asc' }
            ]
        });

        return NextResponse.json(classes);

    } catch (e) {
        console.error("Failed to fetch classes:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
