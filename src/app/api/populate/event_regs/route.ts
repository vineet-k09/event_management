// src/app/api/populate/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { eventId, userIds } = body; // pass eventId and array of userIds

        if (!eventId || !userIds || !Array.isArray(userIds))
            return NextResponse.json(
                { error: "Provide eventId and userIds array" },
                { status: 400 }
            );

        // Create registrations in bulk
        const registrations = await Promise.all(
            userIds.map(async (userId) => {
                try {
                    return await prisma.registration.create({
                        data: { eventId, userId },
                    });
                } catch (err: any) {
                    if (err.code === "P2002") return null; // skip duplicates
                    throw err;
                }
            })
        );

        // Filter out nulls from duplicates
        const createdRegs = registrations.filter(Boolean);

        return NextResponse.json(
            { created: createdRegs.length, registrations: createdRegs },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
