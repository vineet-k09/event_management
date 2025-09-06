"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
    id: number;
    name: string;
    email: string;
    universityId: number;
    role: "STUDENT" | "ADMIN";
} | null;

type UserContextType = {
    user: User;
    setUser: (user: User) => void;
    logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User>(null);

    // Load user from localStorage on first render
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            setUserState(JSON.parse(stored));
        }
    }, []);

    // Keep localStorage in sync whenever user changes
    const setUser = (newUser: User) => {
        setUserState(newUser);
        if (newUser) {
            localStorage.setItem("user", JSON.stringify(newUser));
        } else {
            localStorage.removeItem("user");
        }
    };

    const logout = () => setUser(null);

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within UserProvider");
    return ctx;
}
