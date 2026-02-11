import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch Admin with School relation
        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email },
            include: {
                school: {
                    include: {
                        _count: {
                            select: {
                                applications: true,
                                admins: true
                            }
                        }
                    }
                }
            }
        });

        if (!admin) {
            return NextResponse.json({ error: "Admin profile not found" }, { status: 404 });
        }

        if (!admin.school) {
            // Should theoretically not happen for School Admins, but possible for new Super Admins without a linked school
            return NextResponse.json({
                isGlobal: true,
                message: "Global Super Admin (Not linked to specific school node)"
            });
        }

        return NextResponse.json(admin.school);

    } catch (e) {
        console.error("Failed to fetch my-school:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, address, phone, email, website, description, logoUrl } = body;

        // Fetch Admin to find their school
        const admin = await prisma.admin.findUnique({
            where: { email: session.user.email },
            select: { schoolId: true, role: true }
        });

        if (!admin || !admin.schoolId) {
            return NextResponse.json({ error: "No school associated with this account" }, { status: 403 });
        }

        const updatedSchool = await prisma.school.update({
            where: { id: admin.schoolId },
            data: {
                name,
                address,
                phone,
                email,
                website,
                description,
                logoUrl
            }
        });

        return NextResponse.json(updatedSchool);

    } catch (e) {
        console.error("Failed to update school:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
