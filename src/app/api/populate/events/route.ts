import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fake data helpers
const titles = [
    "Tech Talk: AI Innovations",
    "Hackathon 2025",
    "Cultural Fest",
    "Sports Meet",
    "Guest Lecture: Space Tech",
    "Workshop: Data Science",
    "Seminar: Cloud Computing",
    "Coding Contest",
    "Entrepreneurship Panel",
    "Networking Night",
];

const descriptions = [
    "Join us for an exciting event!",
    "Hands-on experience and learning.",
    "Meet industry experts.",
    "Fun, games, and learning combined.",
    "Expand your horizons.",
];

export async function POST() {
    try {
        // Fetch all users to assign as createdBy
        const users = await prisma.user.findMany();
        const universities = await prisma.university.findMany();

        if (!users.length || !universities.length) {
            return NextResponse.json(
                { error: "No users or universities found to assign events" },
                { status: 400 }
            );
        }

        const eventsData = Array.from({ length: 15 }).map((_, i) => {
            const title = titles[i % titles.length];
            const description = descriptions[i % descriptions.length];
            const university = universities[i % universities.length];
            const createdBy = users.find(u => u.role === "ADMIN") || users[0]; // pick any admin, fallback first user

            return {
                title,
                description,
                date: new Date(Date.now() + i * 86400000), // spread over upcoming days
                universityId: university.id,
                createdById: createdBy.id,
            };
        });

        const createdEvents = await prisma.event.createMany({
            data: eventsData
        });

        return NextResponse.json({ message: "Events populated!", count: createdEvents.count });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
