"use client";

import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}`
type Unis = {
    id: number;
    name: string;
};

type RegistrationData = {
    name: string;
    email: string;
    universityId: number;
    role: string;
};

export default function RegistrationForm() {
    const [unis, setUnis] = useState<Unis[]>([]);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState<RegistrationData>({
        name: "",
        email: "",
        universityId: 0,
        role: "ADMIN"
    });
    const [status, setStatus] = useState("");

    const { user, setUser } = useUser()

    useEffect(() => {
        async function fetchUnis() {
            const res = await axios.get<Unis[]>(`${baseUrl}/university/`);
            setUnis(res.data);
        }
        fetchUnis();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${baseUrl}/users/`, form);
            setStatus("User registered successfully!");
            setUser(res.data)
            setForm({ name: "", email: "", universityId: 0, role: "STUDENT" });
        } catch (err: any) {
            setStatus("Error: " + err.message);
        }
    };

    const filteredUnis = unis.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex justify-center text-center h-full mt-[50vh] translate-y-[-50%]">
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4 max-w-md [&>label]:flex [&>label]:gap-2 [&>label]:justify-between">
                <label htmlFor="name">Name:
                    <input
                        className="border-[0.5] rounded-md p-2"
                        type="text"
                        id="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                    />
                </label>
                <label htmlFor="email">Email:
                    <input
                        className="border-[0.5] rounded-md p-2"
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                    />
                </label>
                <label htmlFor="university">University:
                    <select
                        value={form.universityId}
                        id="university"
                        onChange={e => setForm({ ...form, universityId: Number(e.target.value) })}
                        required
                        className="bg-black border-[0.5] rounded-md p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        <option value={0}>Select University</option>
                        {filteredUnis.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Register
                </button>
                {status && <p>{status}</p>}
            </form>
        </div>
    );
}
// {
//     "id": 3,
//         "name": "vivek",
//             "email": "vivek@gmail.com",
//                 "createdAt": "2025-09-06T12:23:45.784Z",
//                     "universityId": 13,
//                         "role": "ADMIN"
// }