// app/dashboard/page.tsx - UPDATED CODE

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// This is the main page content for the dashboard
export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get profile data directly from the user's metadata.
  // This completely replaces the query to the "profiles" table.
  const profile = user.user_metadata

  // Redirect if a user exists without a profile or a user_type.
  // This check is redundant if the DashboardLayout is active, but it's good practice.
  if (!profile || !profile.user_type) {
    redirect("/auth/login")
  }

  const welcomeMessage = `Welcome, ${profile.full_name || "User"}`
  const userDescription = {
    admin: "Oversee and manage platform activities.",
    client: "Manage your dogs and book new walks.",
    walker: "View your schedule and manage earnings.",
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{welcomeMessage}</h1>
        <p className="text-lg text-muted-foreground mt-2">
          {userDescription[profile.user_type as keyof typeof userDescription]}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profile.user_type === "client" && (
          <>
            <QuickAccessCard href="/dashboard/dogs" title="My Dogs" description="View and manage your dogs" />
            <QuickAccessCard href="/dashboard/book-walk" title="Book a Walk" description="Schedule a new appointment" />
            <QuickAccessCard href="/dashboard/bookings" title="My Bookings" description="Review your upcoming walks" />
          </>
        )}

        {profile.user_type === "walker" && (
          <>
            <QuickAccessCard href="/dashboard/walker-profile" title="My Profile" description="Update your personal details" />
            <QuickAccessCard href="/dashboard/walker-bookings" title="My Bookings" description="View your scheduled walks" />
            <QuickAccessCard href="/dashboard/wallet" title="Earnings" description="Track your payments and revenue" />
          </>
        )}

        {profile.user_type === "admin" && (
          <>
            <QuickAccessCard href="/dashboard/admin/dashboard" title="Dashboard" description="View platform analytics" />
            <QuickAccessCard href="/dashboard/admin/users" title="Users" description="Manage all user accounts" />
            <QuickAccessCard href="/dashboard/admin/bookings" title="Bookings" description="Oversee all bookings" />
          </>
        )}
      </div>
    </div>
  )
}

// A reusable Card component for the dashboard grid
function QuickAccessCard({
  href,
  title,
  description,
}: {
  href: string
  title: string
  description: string
}) {
  return (
    <Link href={href}>
      <Card className="group h-full transition-all duration-200 hover:border-primary hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}