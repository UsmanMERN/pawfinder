import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type React from "react"
import DashboardClient from "./DashboardClient" // The client component that handles UI

// This is a SERVER COMPONENT
// It handles data fetching and authentication before rendering the client UI.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Forcibly sign out the user if they are authenticated but have no profile
  if (!profile) {
    redirect("/auth/signout")
  }

  // This function runs on the server to determine which nav items to pass to the client
  const getNavItems = () => {
    if (profile.user_type === "admin") {
      return [
        { label: "Dashboard", href: "/dashboard/admin/dashboard" },
        { label: "Users", href: "/dashboard/admin/users" },
        { label: "Bookings", href: "/dashboard/admin/bookings" },
        { label: "Payments", href: "/dashboard/admin/payments" },
        { label: "Analytics", href: "/dashboard/admin/analytics" },
        { label: "Settings", href: "/dashboard/admin/settings" },
      ]
    }
    if (profile.user_type === "walker") {
      return [
        { label: "My Profile", href: "/dashboard/walker-profile" },
        { label: "My Bookings", href: "/dashboard/walker-bookings" },
        { label: "Earnings", href: "/dashboard/wallet" },
      ]
    }
    // Default nav items for 'client' user type
    return [
      { label: "My Dogs", href: "/dashboard/dogs" },
      { label: "Book a Walk", href: "/dashboard/book-walk" },
      { label: "My Bookings", href: "/dashboard/bookings" },
    ]
  }

  return (
    <DashboardClient profile={profile} navItems={getNavItems()}>
      {children}
    </DashboardClient>
  )
}