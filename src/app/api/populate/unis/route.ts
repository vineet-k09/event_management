//src/app/api/populate/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // detect array or single object
        const dataArray = Array.isArray(body) ? body : [body];

        const createdUnis = [];
        for (const uniData of dataArray) {
            const uni = await prisma.university.create({
                data: {
                    name: uniData.name,
                    location: uniData.location ?? null,
                },
            });
            createdUnis.push(uni);
        }

        return NextResponse.json(createdUnis, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}