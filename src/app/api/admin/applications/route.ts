import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const whereClause: any = {};
        if (session.user.role !== 'super_admin' && session.user.schoolId) {
            whereClause.schoolId = session.user.schoolId;
        }

        const applications = await prisma.application.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            include: {
                documents: true,
                logs: {
                    include: {
                        admin: {
                            select: { name: true }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                }
            },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Admin applications error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
