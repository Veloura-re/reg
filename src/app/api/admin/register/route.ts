import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    try {
        const { name, email, password, inviteCode } = await req.json();

        if (!inviteCode) {
            return NextResponse.json({ error: "Invitation code required" }, { status: 400 });
        }

        const invitation = await prisma.invitation.findUnique({
            where: { code: inviteCode },
            include: { school: true }
        });

        if (!invitation) {
            return NextResponse.json({ error: "Invalid invitation code" }, { status: 400 });
        }

        if (invitation.used) {
            return NextResponse.json({ error: "This code has already been used" }, { status: 400 });
        }

        if (new Date() > invitation.expiresAt) {
            return NextResponse.json({ error: "This code has expired" }, { status: 400 });
        }

        const existingUser = await prisma.admin.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        // Transaction to create admin and mark invite as used
        const admin = await prisma.$transaction(async (tx) => {
            await tx.invitation.update({
                where: { id: invitation.id },
                data: { used: true }
            });

            return await tx.admin.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: invitation.role,
                    schoolId: invitation.schoolId
                }
            });
        });

        return NextResponse.json({ success: true, adminId: admin.id });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
