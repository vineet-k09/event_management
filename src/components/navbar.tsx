'use client'
import { useUser } from "@/context/UserContext"
import Link from "next/link"

export default function Navbar() {
    const { user, logout } = useUser()
    return (
        <nav className="flex flex-row justify-between px-3 border-b-1">
            <div className="p-4">Event Organizer</div>
            <div className="mx-auto my-auto hover:scale-[1.2] duration-100">
                {user?.role === "ADMIN" ? <Link href="/events/create" className="rounded-md p-1 border-2 px-2 hover:bg-blue-950">Create Event</Link> : <p className="rounded-md p-1 border-2 px-2 ">Login to see featuers</p>}
            </div>
            <ul className="flex flex-row gap-2 p-3 [&>li]:duration-100 [&>li]:border-[0.5] [&>li]:p-1 [&>li]:rounded-md [&>li]:hover:bg-blue-950 [&>li]:hover:scale-[1.1]">
                <li><Link href='/'>Home</Link></li>
                <li><Link href='/events'>Events</Link></li>
                {user !== null &&
                    <li><button onClick={logout}>Logout</button></li>
                }
                {user === null &&
                    <li><Link href='/auth/register'>Register</Link></li>
                }
                {user === null &&
                    <li><Link href='/auth/login'>Login</Link></li>
                }
            </ul>
        </nav>
    )
}