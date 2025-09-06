"use client";

import { useUser } from "@/context/UserContext";
import { useState } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
    const [form, setForm] = useState({ name: "", email: "" });
    const [error, setError] = useState<string | null>(null);
    const {user, setUser} = useUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setUser(null);

        try {
            const res = await fetch(`${baseUrl}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                setUser(data);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong");
        }
    };

    return (
        <div className="flex justify-center text-center h-full mt-[50vh] translate-y-[-50%]">
            <form
                onSubmit={handleSubmit}
                className="p-4 flex flex-col gap-4 max-w-md [&>label]:flex [&>label]:gap-2 [&>label]:justify-between"
            >
                <label htmlFor="name">
                    Name:
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="border-[0.5px] rounded-md p-2"
                    />
                </label>

                <label htmlFor="email">
                    Email:
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="border-[0.5px] rounded-md p-2"
                    />
                </label>

                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
                >
                    Login
                </button>

                {error && <p className="text-red-500">{error}</p>}
                {user && (
                    <pre className="p-2 rounded-md text-left text-sm">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                )}
            <div className="text-start flex flex-col">
                Working credentials -
                <p>Name: <code>Rahul Singh</code></p>
                <p>Email: <code>rahul@gmail.com</code></p>
            </div>
            </form>
        </div>
    );
}
