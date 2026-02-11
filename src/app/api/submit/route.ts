import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submissionSchema = z.object({
    studentName: z.string().min(2),
    middleName: z.string().optional(),
    studentGrade: z.string(),
    dateOfBirth: z.coerce.date(),
    gender: z.string(),
    address: z.string().min(5),
    previousSchool: z.string().optional(),
    medicalInfo: z.string().optional(),
    parentName: z.string().min(2),
    parentEmail: z.string().email(),
    parentPhone: z.string().optional(),
    familyPhone: z.string().optional(),
    locationLink: z.string().optional(),
    classId: z.string().optional(),
    priorityFlags: z.array(z.string()).optional(),
    schoolSlug: z.string().optional(),
    notes: z.string().optional(),

    // Enhanced Student Information
    studentPhoto: z.string().optional(),
    preferredName: z.string().optional(),

    // Emergency Contacts
    emergencyContact1Name: z.string().optional(),
    emergencyContact1Phone: z.string().optional(),
    emergencyContact1Relation: z.string().optional(),
    emergencyContact2Name: z.string().optional(),
    emergencyContact2Phone: z.string().optional(),
    emergencyContact2Relation: z.string().optional(),

    // Health & Special Needs
    allergies: z.string().optional(),
    medicalConditions: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
    specialAccommodations: z.string().optional(),

    // Family & Siblings
    siblingsAtSchool: z.string().optional(),

    // Transportation & Preferences
    transportationMethod: z.string().optional(),
    preferredLanguage: z.string().optional(),

    // Documents
    academicRecords: z.string().optional(),
    documents: z.array(z.object({
        name: z.string(),
        url: z.string(),
        type: z.string()
    })).optional()
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedData = submissionSchema.parse(body);

        let schoolId = null;
        if (validatedData.schoolSlug) {
            const school = await prisma.school.findUnique({
                where: { slug: validatedData.schoolSlug.toLowerCase() }
            });
            if (school) schoolId = school.id;
        }

        const year = new Date().getFullYear();
        const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
        const trackingCode = `CLAE-${year}-${randomSuffix}`;

        const { schoolSlug, documents, classId, ...appData } = validatedData;

        const applicationData: any = {
            ...appData,
            schoolId,
            trackingCode,
            classId: classId || null,
            familyPhone: validatedData.familyPhone || null,
            locationLink: validatedData.locationLink || null,
            priorityFlags: validatedData.priorityFlags || [],
            documents: {
                create: documents || []
            }
        };

        const application = await prisma.application.create({
            data: applicationData,
        });

        return NextResponse.json({
            success: true,
            trackingCode: application.trackingCode
        });
    } catch (error) {
        console.error("Submission error:", error);

        // DEBUG: Write error to file for inspection
        try {
            const fs = await import('fs');
            const path = await import('path');
            const logPath = path.join(process.cwd(), 'public', 'debug-errors.txt');
            const timestamp = new Date().toISOString();
            const errorLog = `\n[${timestamp}] ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}\n`;
            fs.appendFileSync(logPath, errorLog);
        } catch (e) {
            console.error("Failed to write log", e);
        }

        if (error instanceof z.ZodError) {
            console.error("Zod Validation Error:", JSON.stringify(error.format(), null, 2));
            return NextResponse.json({ error: "Validation Failed", details: error.flatten() }, { status: 400 });
        }

        console.error("Prisma/Internal Error:", error);
        return NextResponse.json({ error: "Internal Server Error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
