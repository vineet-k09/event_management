import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/events
export async function GET() {
    try {
        const events = await prisma.event.findMany({
            include: {
                university: true,
                createdBy: true,
                registrations: true,
            },
            orderBy: {date: 'asc'},
        });
        return NextResponse.json(events, {status: 200});
    } catch (err: any){
        return NextResponse.json({error: err.message}, {status: 500})
    }
}

// POST /api/events
export async function POST(req: Request) {
    try {
        const body = await req.json()

        const event = await prisma.event.create({
            data: {
                title: body.title,
                description: body.description,
                date: new Date(body.date),
                universityId: body.universityId,
                createdById: body.createdById,
            },
        });
        return NextResponse.json(event, {status: 201});
    } catch (err: any) {
        return NextResponse.json({error: err.message}, {status: 500})
    }
}