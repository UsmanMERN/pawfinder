"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

// FIX: Update the Booking interface to match the correct data structure from the query.
// The walker's profile information will be nested under a 'walkers' object.
interface Booking {
  id: string
  scheduled_start: string
  scheduled_end: string
  status: string
  duration_minutes: number
  total_price: number // Using total_price is more accurate
  walkers: {
    profiles: {
      full_name: string
      email: string
    } | null
  } | null
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchBookings = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // FIX: The query needs to be specific about joining through the 'walkers' table
      // to get the walker's profile, not the client's.
      const { data, error } = await supabase
        .from("bookings")
        .select("*, walkers(profiles(full_name, email))")
        .eq("client_id", user.id)
        .order("scheduled_start", { ascending: true })

      if (error) {
        console.error("Error fetching bookings:", error)
      } else if (data) {
        setBookings(data)
      }
      setLoading(false)
    }

    fetchBookings()
  }, [supabase, router])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your dog walks</p>
          </div>
          <Link href="/dashboard/book-walk">
            <Button>Book a Walk</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">No bookings yet</p>
              <Link href="/dashboard/book-walk">
                <Button>Book Your First Walk</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      {/* FIX: Access the walker's name through the nested 'walkers' and 'profiles' objects. */}
                      {/* Using optional chaining (?.) prevents errors if data is missing. */}
                      <CardTitle>Walk with {booking.walkers?.profiles?.full_name || "Unknown Walker"}</CardTitle>
                      <CardDescription>{new Date(booking.scheduled_start).toLocaleString()}</CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{booking.duration_minutes} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Price</p>
                      {/* FIX: Displaying total_price is more accurate than price_per_dog */}
                      <p className="font-semibold">${booking.total_price || "TBD"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}