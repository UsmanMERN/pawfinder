"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PawPrint, LayoutGrid, Users, Calendar, CreditCard, BarChart4, Settings, LogOut, Loader2, Menu, X } from "lucide-react"

const menuItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard/admin" },
  { icon: Users, label: "Users", href: "/dashboard/admin/users" },
  { icon: Calendar, label: "Bookings", href: "/dashboard/admin/bookings" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/admin/payments" },
  { icon: BarChart4, label: "Analytics", href: "/dashboard/admin/analytics" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()
      if (profile?.user_type !== "admin") {
        router.replace("/dashboard") // Use replace to avoid back-button issues
        return
      }

      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAdminAccess()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace("/auth/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return null // Render nothing while redirecting
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* --- Sidebar --- */}
      <aside className={`flex flex-col bg-white/70 backdrop-blur-lg border-r border-gray-200/80 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-20"}`}>
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200/80">
          {isSidebarOpen && (
            <Link href="/" className="flex items-center gap-2.5">
              <PawPrint className="w-7 h-7 text-primary" />
              <span className="text-xl font-bold text-gray-800">Admin Panel</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-2">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start h-12 text-base ${!isSidebarOpen && "justify-center"}`}
                      >
                        <item.icon className={`w-5 h-5 transition-all ${isSidebarOpen && "mr-3"}`} />
                        {isSidebarOpen && <span>{item.label}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {!isSidebarOpen && <TooltipContent side="right">{item.label}</TooltipContent>}
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </nav>

        {/* Footer Links & Logout */}
        <div className="p-4 border-t border-gray-200/80">
          <TooltipProvider delayDuration={0}>
            {/* Settings Link */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/admin/settings">
                  <Button variant={pathname === "/dashboard/admin/settings" ? "secondary" : "ghost"} className={`w-full justify-start h-12 text-base ${!isSidebarOpen && "justify-center"}`}>
                    <Settings className={`w-5 h-5 transition-all ${isSidebarOpen && "mr-3"}`} />
                    {isSidebarOpen && <span>Settings</span>}
                  </Button>
                </Link>
              </TooltipTrigger>
              {!isSidebarOpen && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>

            {/* Logout Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleLogout} variant="ghost" className={`w-full justify-start h-12 text-base text-red-500 hover:text-red-500 hover:bg-red-50 ${!isSidebarOpen && "justify-center"}`}>
                  <LogOut className={`w-5 h-5 transition-all ${isSidebarOpen && "mr-3"}`} />
                  {isSidebarOpen && <span>Logout</span>}
                </Button>
              </TooltipTrigger>
              {!isSidebarOpen && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-20 px-8 border-b border-gray-200/80 bg-white/70 backdrop-blur-lg">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          {/* Can add user profile dropdown here later */}
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          {children}
        </div>
      </main>
    </div>
  )
}