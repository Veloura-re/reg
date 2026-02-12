import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Missing required key/credentials." }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: { resetToken: token },
        });

        if (!admin || !admin.resetTokenExpiry || admin.resetTokenExpiry < new Date()) {
            return NextResponse.json({ error: "Recovery Key Expired or Invalid." }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await hash(password, 12);

        // Update admin and clear token
        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ message: "Access pass recalibrated successfully." });
    } catch (error) {
        console.error("Reset password API error:", error);
        return NextResponse.json({ error: "Internal System Error" }, { status: 500 });
    }
}
