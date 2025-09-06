"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/events/`

export default function CreateEventPage() {
    const { user } = useUser();
    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        universityId: user?.universityId ?? 0,
    });
    const [status, setStatus] = useState("");

    if (!user || user.role !== "ADMIN") {
        return <p className="p-8 text-red-500">❌ You’re not allowed here</p>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(baseUrl, {
                ...form,
                date: new Date(form.date), // ensure proper Date object
                createdById: user.id,
            });
            setStatus(`✅ Event created: ${res.data.title}`);
            setForm({ title: "", description: "", date: "", universityId: user.universityId });
        } catch (err: any) {
            setStatus("❌ Error: " + err.message);
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create Event</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Event Title"
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Event Description"
                    className="w-full p-2 border rounded"
                />
                <input
                    type="datetime-local"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Create Event
                </button>
            </form>
            {status && <p className="mt-4">{status}</p>}
        </div>
    );
}
