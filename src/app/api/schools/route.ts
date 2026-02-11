import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const schools = await prisma.school.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                slug: true,
                _count: {
                    select: { applications: true }
                }
            }
        });

        return NextResponse.json(schools);
    } catch (error) {
        return NextResponse.json({ error: "Failed to load schools" }, { status: 500 });
    }
}
