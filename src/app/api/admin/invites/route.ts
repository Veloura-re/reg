import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { schoolId } = await req.json();

        // Generate a simple 6 char code
        const code = crypto.randomBytes(3).toString('hex').toUpperCase();

        const invite = await prisma.invitation.create({
            data: {
                code,
                schoolId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });

        return NextResponse.json(invite);
    } catch (e) {
        return NextResponse.json({ error: "Failed to create invite" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'super_admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get active invites
    const invites = await prisma.invitation.findMany({
        where: {
            used: false,
            expiresAt: { gt: new Date() }
        },
        include: {
            school: true
        },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(invites);
}
