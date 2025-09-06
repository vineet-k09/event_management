import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/events/:id/attendance?userId=<currentUserId>
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const eventId = parseInt(params.id);
        const url = new URL(req.url);
        const userId = parseInt(url.searchParams.get("userId") || "0");

        // Check if the user is the creator of the event
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        if (event.createdById !== userId)
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });

        // Fetch registrations for this event
        const registrations = await prisma.registration.findMany({
            where: { eventId },
            include: { user: true },
        });

        return NextResponse.json({ event, registrations });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/events/:id/attendance
// body: { userIds: number[] } -> mark attendance for these users
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const eventId = parseInt(params.id);
        const body = await req.json();
        const { userIds, currentUserId } = body;

        // Check if current user is the creator
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        if (event.createdById !== currentUserId)
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });

        // Bulk update registrations
        const updatedRegs = await prisma.registration.updateMany({
            where: { eventId, userId: { in: userIds } },
            data: { attendance: true },
        });

        return NextResponse.json({ updatedCount: updatedRegs.count });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
