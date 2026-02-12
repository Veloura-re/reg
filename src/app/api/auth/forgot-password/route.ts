import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Identity Relay ID required." }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            // We return success even if admin doesn't exist for security reasons (avoiding email enumeration)
            return NextResponse.json({ message: "Recovery protocol initialized if node exists." });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.admin.update({
            where: { id: admin.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry,
            },
        });

        const emailSent = await sendResetEmail(email, token);

        if (!emailSent.success) {
            return NextResponse.json({ error: "Email dispatch failed. Terminal error." }, { status: 500 });
        }

        return NextResponse.json({ message: "Recovery protocol initialized." });
    } catch (error) {
        console.error("Forgot password API error:", error);
        return NextResponse.json({ error: "Internal System Error" }, { status: 500 });
    }
}
