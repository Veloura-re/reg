import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const actionSchema = z.object({
    status: z.enum(["waiting", "under_review", "approved", "rejected", "on_hold"]).optional(),
    notes: z.string().optional(),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const validatedData = actionSchema.parse(body);

        // Fetch current application to handle optional status
        const currentApp = await prisma.application.findUnique({
            where: { id },
            select: { status: true }
        });

        if (!currentApp) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const newStatus = validatedData.status || currentApp.status;

        // Update application and create audit log in a transaction
        const [application, log] = await prisma.$transaction([
            prisma.application.update({
                where: { id },
                data: {
                    status: newStatus,
                    internalNotes: validatedData.notes,
                },
            }),
            prisma.auditLog.create({
                data: {
                    action: validatedData.status ? `STATUS_UPDATE_${validatedData.status.toUpperCase()}` : "INTERNAL_NOTE_UPDATE",
                    details: validatedData.notes || `Changed status to ${newStatus}`,
                    adminId: (session.user as any).id,
                    applicationId: id,
                },
            }),
        ]);

        // AUTOMATED NOTIFICATION LOGIC
        if (validatedData.status && validatedData.status !== currentApp.status) {
            const { TEMPLATES } = await import("@/lib/constants");
            const template = TEMPLATES.find(t => t.trigger === validatedData.status);

            if (template) {
                // Fetch full app details for placeholders
                const appDetails = await prisma.application.findUnique({ where: { id } });

                if (appDetails) {
                    let content = template.content
                        .replace(/\[Student Name\]/g, appDetails.studentName)
                        .replace(/\[Parent Name\]/g, appDetails.parentName)
                        .replace(/\[Grade\]/g, appDetails.studentGrade)
                        .replace(/\[Tracking Code\]/g, appDetails.trackingCode);

                    // Mock Send
                    console.log(`[MOCK EMAIL] To: ${appDetails.parentEmail} | Subject: ${template.subject} | Body: ${content}`);

                    // Log Communication
                    await prisma.auditLog.create({
                        data: {
                            action: "COMMUNICATION_SENT",
                            details: `Sent '${template.name}' via ${template.type}.`,
                            adminId: (session.user as any).id,
                            applicationId: id,
                        }
                    });
                }
            }
        }

        return NextResponse.json({ success: true, application });
    } catch (error) {
        console.error("Action error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten() }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
