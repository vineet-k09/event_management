import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/registrations
export async function GET() {
    try {
        const regs = await prisma.registration.findMany({
            include: {
                event: true,
                user: true,
            },
        });
        return NextResponse.json(regs);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/registrations
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const reg = await prisma.registration.create({
            data: {
                eventId: body.eventId,
                userId: body.userId,
            },
        });

        return NextResponse.json(reg, { status: 201 });
    } catch (err: any) {
        // handle duplicate (unique constraint) gracefully
        if (err.code === "P2002") {
            return NextResponse.json(
                { error: "User already registered for this event" },
                { status: 400 }
            );
        }
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
