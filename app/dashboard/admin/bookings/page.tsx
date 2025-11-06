"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AdminBooking {
  id: string
  scheduled_start: string
  scheduled_end: string
  status: string
  client_profile: {
    full_name: string
  }
  walker_profile: {
    full_name: string
  }
}

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
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

      const { data } = await supabase
        .from("bookings")
        .select(`
          id,
          scheduled_start,
          scheduled_end,
          status,
          profiles!bookings_client_id_fkey(full_name),
          walkers(profiles(full_name))
        `)
        .order("scheduled_start", { ascending: false })

      if (data) {
        setBookings(data as unknown as AdminBooking[])
      }
      setLoading(false)
    }

    fetchBookings()
  }, [supabase, router])

  console.log('bookings :>> ', bookings);

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Bookings</h1>
          <Link href="/dashboard/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">
                      {booking.client_profile?.full_name} → {booking.walker_profile?.full_name}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold
                      ${booking.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${booking.status === "confirmed" ? "bg-blue-100 text-blue-800" : ""}
                      ${booking.status === "completed" ? "bg-green-100 text-green-800" : ""}
                    `}
                    >
                      {booking.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{new Date(booking.scheduled_start).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
