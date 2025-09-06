import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/users/login
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Name and email are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findFirst({
            where: { name, email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User does not exist (Hint: The username is type sensitive" },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
