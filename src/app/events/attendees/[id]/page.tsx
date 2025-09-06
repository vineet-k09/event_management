"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useParams } from "next/navigation";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`;

type Registration = {
    id: number;
    attendance: boolean;
    user: { id: number; name: string; email: string };
};

export default function AttendancePage() {
    const { user } = useUser();
    const params = useParams();
    const eventId = params.id;
    const [regs, setRegs] = useState<Registration[]>([]);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (!user) return;

        axios
            .get(`${baseUrl}/events/${eventId}/attendance?userId=${user.id}`)
            .then((res) => setRegs(res.data.registrations))
            .catch((err) => setStatus(err.response?.data?.error || err.message));
    }, [user, eventId]);

    // mark individual user attendance
    const markAttendance = async (userId: number) => {
        try {
            const res = await axios.post(`${baseUrl}/events/${eventId}/attendance`, {
                userIds: [userId],          // array of user IDs
                currentUserId: user?.id,    // event creator
            });

            // Update local state
            setRegs((prev) =>
                prev.map((r) =>
                    r.user.id === userId ? { ...r, attendance: true } : r
                )
            );

            setStatus(`✅ Marked attendance for userId ${userId}`);
        } catch (err: any) {
            setStatus(err.response?.data?.error || err.message);
        }
    };

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Attendance</h1>
            {status && <p className="text-red-500">{status}</p>}

            <table className="min-w-full border">
                <thead>
                    <tr>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Attendance</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {regs.map((r) => (
                        <tr key={r.id}>
                            <td className="border p-2">{r.user.name}</td>
                            <td className="border p-2">{r.user.email}</td>
                            <td className="border p-2">{r.attendance ? "✅ Present" : "❌ Absent"}</td>
                            <td className="border p-2">
                                {!r.attendance && (
                                    <button
                                        onClick={() => markAttendance(r.id)}
                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                    >
                                        Mark Present
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
