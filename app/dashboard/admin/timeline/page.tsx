"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface TimelineBooking {
  id: string
  scheduled_start: string
  scheduled_end: string
  status: string
  duration_minutes: number
  location: string
  dogs: string[]
  client_profile: {
    full_name: string
  }
  walker_profile: {
    full_name: string
  }
}

export default function TimelineBoard() {
  const [bookings, setBookings] = useState<TimelineBooking[]>([])
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

      // Get all bookings with walker and client info
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          scheduled_start,
          scheduled_end,
          status,
          duration_minutes,
          location,
          dogs,
          client_id,
          walker_id,
          profiles!bookings_client_id_fkey(full_name),
          walkers(
            profiles(full_name)
          )
        `)
        .in("status", ["pending", "confirmed", "in_progress"])
        .order("scheduled_start", { ascending: true })

      if (!error && data) {
        setBookings(data as unknown as TimelineBooking[])
      }
      setLoading(false)
    }

    fetchBookings()
  }, [supabase, router])

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      in_progress: "bg-purple-100 text-purple-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Timeline Board</h1>
            <p className="text-muted-foreground">Real-time view of active walks</p>
          </div>
          <Link href="/dashboard/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No active bookings</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => {
              const startTime = new Date(booking.scheduled_start)
              const endTime = new Date(booking.scheduled_end)
              const now = new Date()
              const progress = Math.min(
                ((now.getTime() - startTime.getTime()) / (endTime.getTime() - startTime.getTime())) * 100,
                100,
              )

              return (
                <Card key={booking.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {booking.client_profile?.full_name || "Client"} with{" "}
                          {booking.walker_profile?.full_name || "Walker"}
                        </CardTitle>
                        <CardDescription>
                          {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Location: {booking.location}</p>
                      <p className="text-sm text-muted-foreground">Dogs: {booking.dogs.join(", ")}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
