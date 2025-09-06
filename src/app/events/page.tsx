"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/events`;
const regUrl = `${process.env.NEXT_PUBLIC_API_URL}/registrations`;

type Event = {
    id: number;
    title: string;
    description: string;
    date: string;
    status: string;
    university: {
        name: string;
    };
};

// "university": {
//     "id": 15,
//         "name": "IIT Varanasi",
//             "location": "Varanasi"
// }

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [regs, setRegs] = useState(null)
    const [status, setStatus] = useState("");
    const { user } = useUser();

    useEffect(() => {
        axios.get<Event[]>(baseUrl).then((res) => setEvents(res.data));
    }, []);

    useEffect(() => {
        if (user) {
            axios.get(regUrl).then((res) => {
                // Only keep this user’s registrations
                const myRegs = res.data.filter((r: any) => r.userId === user.id);
                setRegs(myRegs);
            });
        }
    }, [user]);

    async function handleReg(eventId: number) {
        if (!user) {
            setStatus("❌ Please log in first");
            return;
        }
        try {
            await axios.post(regUrl, { eventId, userId: user.id });
            setStatus(`✅ Registered for event ${eventId}`);
        } catch (err: any) {
            setStatus("❌ " + err.response?.data?.error || err.message);
        }
    }

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Events</h1>
            <div className="md:columns-3 columns-2">
                {events.map((e) => {
                    const eventStatus = user && regs ? getEventStatus(e, regs, user.id) : "";

                    let statusText = "";
                    let statusClass = "";
                    let showRegisterButton = false;

                    switch (eventStatus) {
                        case "present":
                            statusText = "Present ✅";
                            statusClass = "text-green-600";
                            break;
                        case "absent":
                            statusText = "Absent ❌";
                            statusClass = "text-red-600";
                            break;
                        case "register":
                            statusText = "Not Registered";
                            statusClass = "text-blue-600";
                            showRegisterButton = true;
                            break;
                        case "registration over":
                            statusText = "Registration Over ⏳";
                            statusClass = "text-gray-500";
                            break;
                    }

                    return (
                        <div key={e.id} className="border p-4 rounded flex flex-col gap-1 break-inside-avoid">
                            <h2 className="font-semibold">{e.title} [ {e.university.name} ]</h2>
                            <p>{e.description}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(e.date).toLocaleString()}
                            </p>

                            {statusText !== "Not Registered" && (
                                <p className="mt-2 font-medium">
                                    Status: <span className={statusClass}>{statusText}</span>
                                </p>
                            )}

                            {showRegisterButton && (
                                <button
                                    onClick={() => handleReg(e.id)}
                                    className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
                                >
                                    Register
                                </button>
                            )}
                            {user?.role === "ADMIN" && <div className="mt-2">
                                <Link href={`events/attendees/${e.id}/`} className="border-2 p-2 rounded-md hover:bg-blue-950 duration-100">Attendees</Link>
                            </div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
function getEventStatus(event: Event, regs: any[], userId: number) {
    const reg = regs.find((r) => r.eventId === event.id && r.userId === userId);

    if (reg) {
        // User registered
        return reg.attendance ? "present" : "absent";
    }

    // User not registered
    return event.status === "ACTIVE" ? "register" : "registration over";
}