"use client" // This directive marks the component as a Client Component

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation" // To highlight the active link
import { Button } from "@/components/ui/button"

// Define the types for the props this component will receive
interface NavItem {
    label: string
    href: string
}

interface Profile {
    full_name: string
    user_type: "admin" | "walker" | "client"
}

interface DashboardClientProps {
    profile: Profile
    navItems: NavItem[]
    children: React.ReactNode
}

// This is a CLIENT COMPONENT
// It receives data as props and handles all state and user interactions.
export default function DashboardClient({ profile, navItems, children }: DashboardClientProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const pathname = usePathname()

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="border-b bg-white sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            {/* Simple text or an SVG could be used here if needed, but for true icon-less UI, it's removed */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                        </button>
                        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                            <span className="text-xl font-bold text-gray-800 tracking-tight">Paw Walks</span>
                        </Link>
                    </div>
                    <div className="flex gap-4 items-center">
                        <span className="text-sm font-medium text-gray-700 hidden md:inline">
                            {profile?.full_name || "User"}
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`flex flex-col justify-between border-r bg-white transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64 p-4" : "w-0 p-0"
                        } overflow-hidden`}
                >
                    {/* Main navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.href} href={item.href} passHref>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className="w-full justify-start text-base px-3"
                                    >
                                        <span className={isActive ? "font-semibold" : "font-normal"}>{item.label}</span>
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Sidebar Footer with Sign Out */}
                    <div className="pt-4 mt-4 border-t">
                        <form action="/auth/signout" method="post">
                            <Button
                                type="submit"
                                variant="ghost"
                                className="w-full justify-start text-base text-red-600 hover:text-red-600 hover:bg-red-50 px-3"
                            >
                                <span>Sign Out</span>
                            </Button>
                        </form>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
            </div>
        </div>
    )
}