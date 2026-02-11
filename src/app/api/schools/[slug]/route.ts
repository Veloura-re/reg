import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    const slug = params.slug.toLowerCase();

    try {
        const school = await prisma.school.findUnique({
            where: { slug: slug },
            select: {
                id: true,
                name: true,
                slug: true,
                grades: {
                    select: {
                        id: true,
                        level: true,
                    },
                    orderBy: {
                        level: 'asc'
                    }
                }
            }
        });

        if (!school) {
            return NextResponse.json({ error: "School node not found" }, { status: 404 });
        }

        return NextResponse.json(school);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
