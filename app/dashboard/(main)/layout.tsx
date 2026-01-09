// app/dashboard/layout.tsx - UPDATED CODE

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type React from "react"
import DashboardClient from "./DashboardClient" // The client component that handles UI

// This is a SERVER COMPONENT
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // The user's metadata is stored in the user object itself.
  // This replaces the need to query the 'profiles' table.
  const profile = user.user_metadata as any

  // Forcibly sign out the user if they are authenticated but have no metadata.
  // This can happen for users created before this logic was in place.
  if (!profile || !profile.user_type) {
    console.warn("User authenticated but has no user_type in metadata. Signing out.", { userId: user.id });
    redirect("/auth/signout")
  }

  // This function now uses the metadata directly
  const getNavItems = () => {
    // The logic inside here remains the same, as it already expected
    // an object with a `user_type` property.
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
    // Pass the metadata object to the client component as 'profile'
    <DashboardClient profile={profile} navItems={getNavItems()}>
      {children}
    </DashboardClient>
  )
}