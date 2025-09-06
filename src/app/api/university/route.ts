//src/app/api/university/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/university
export async function GET() {
    const unis = await prisma.university.findMany({
        // include: { users: true }, // optional: include users per uni
    });
    return NextResponse.json(unis);
}

// POST /api/university
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const uni = await prisma.university.create({
            data: {
                name: body.name,
                location: body.location ?? null,
            },
        });
        return NextResponse.json(uni, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
