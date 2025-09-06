// src/app/api/populate-users/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Simple random name/email generator
function randomName() {
    const firstNames = ["Aarav", "Vivaan", "Aditya", "Reyansh", "Arjun", "Vihaan", "Sai", "Rohan", "Krishna", "Aniket"];
    const lastNames = ["Sharma", "Patel", "Kumar", "Reddy", "Gupta", "Mehta", "Singh", "Das", "Chowdhury", "Iyer"];
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${first} ${last}`;
}

function randomEmail(name: string) {
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const cleanName = name.toLowerCase().replace(/\s/g, ".");
    return `${cleanName}${Math.floor(Math.random() * 1000)}@${domain}`;
}

export async function POST(req: Request) {
    try {
        // Fetch existing universities
        const universities = await prisma.university.findMany();
        if (universities.length === 0)
            return NextResponse.json({ error: "No universities found" }, { status: 400 });

        const usersToCreate = 20;

        const createdUsers = [];
        for (let i = 0; i < usersToCreate; i++) {
            const name = randomName();
            const email = randomEmail(name);
            const universityId = universities[Math.floor(Math.random() * universities.length)].id;

            try {
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        universityId,
                    },
                });
                createdUsers.push(user);
            } catch (err: any) {
                if (err.code === "P2002") continue; // skip duplicate emails
                throw err;
            }
        }

        return NextResponse.json({ created: createdUsers.length, users: createdUsers }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
