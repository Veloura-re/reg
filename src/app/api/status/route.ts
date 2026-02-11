import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");

        if (!query) {
            return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
        }

        // Try searching by tracking code first
        let application = await prisma.application.findUnique({
            where: { trackingCode: query },
            select: {
                studentName: true,
                status: true,
                createdAt: true,
                trackingCode: true,
            },
        });

        // If not found, try searching by phone number
        if (!application) {
            application = await prisma.application.findFirst({
                where: { parentPhone: query },
                select: {
                    studentName: true,
                    status: true,
                    createdAt: true,
                    trackingCode: true,
                },
                orderBy: { createdAt: "desc" },
            });
        }

        if (!application) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        // Calculate queue position (rough estimation: all waiting/review apps before this one)
        const position = await prisma.application.count({
            where: {
                createdAt: { lt: application.createdAt },
                status: { in: ["waiting", "under_review"] },
            },
        });

        const total = await prisma.application.count({
            where: {
                status: { in: ["waiting", "under_review"] },
            },
        });

        return NextResponse.json({
            ...application,
            position: position + 1,
            total,
        });
    } catch (error) {
        console.error("Status check error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
