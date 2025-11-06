"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MapDisplay } from "@/components/map-display"

interface WalkerBooking {
  id: string
  scheduled_start: string
  scheduled_end: string
  status: string
  dogs: string[]
  location: string
  client_profile: {
    full_name: string
    email: string
  }
}

export default function WalkerBookingsPage() {
  const [bookings, setBookings] = useState<WalkerBooking[]>([])
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

      // Verify user is a walker
      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

      if (profile?.user_type !== "walker") {
        router.push("/dashboard")
        return
      }

      const { data } = await supabase
        .from("bookings")
        .select(`
          id,
          scheduled_start,
          scheduled_end,
          status,
          dogs,
          location,
          profiles!bookings_client_id_fkey(full_name, email)
        `)
        .eq("walker_id", user.id)
        .order("scheduled_start", { ascending: true })

      if (data) {
        setBookings(data as unknown as WalkerBooking[])
      }
      setLoading(false)
    }

    fetchBookings()
  }, [supabase, router])

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    const { error } = await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId)

    if (!error) {
      setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground">View upcoming walks and client details</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No bookings yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{booking.client_profile?.full_name || "Client"}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(booking.scheduled_start).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Dogs</p>
                      <p className="font-semibold">{booking.dogs.join(", ")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{booking.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Client Contact</p>
                      <p className="font-semibold text-sm">{booking.client_profile?.email}</p>
                    </div>
                  </div>

                  <MapDisplay latitude={40.7128} longitude={-74.006} />

                  <div className="flex gap-2 pt-4">
                    {booking.status === "pending" && (
                      <Button onClick={() => updateBookingStatus(booking.id, "confirmed")}>Accept Booking</Button>
                    )}
                    {booking.status === "confirmed" && (
                      <Button onClick={() => updateBookingStatus(booking.id, "in_progress")}>Start Walk</Button>
                    )}
                    {booking.status === "in_progress" && (
                      <Button onClick={() => updateBookingStatus(booking.id, "completed")}>Complete Walk</Button>
                    )}
                    {booking.status !== "completed" && (
                      <Button variant="destructive" onClick={() => updateBookingStatus(booking.id, "cancelled")}>
                        Cancel
                      </Button>
                    )}
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
