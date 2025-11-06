"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface AnalyticsData {
  totalBookings: number
  completedBookings: number
  totalSpent: number
  averageRating: number
  bookingsByStatus: Record<string, number>
  monthlyData: Array<{ month: string; bookings: number; spent: number }>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchAnalytics = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get user profile to check type
      const { data: profile } = await supabase.from("profiles").select("user_type, rating").eq("id", user.id).single()

      let bookingsQuery = supabase.from("bookings").select("*")

      if (profile?.user_type === "client") {
        bookingsQuery = bookingsQuery.eq("client_id", user.id)
      } else {
        bookingsQuery = bookingsQuery.eq("walker_id", user.id)
      }

      const { data: bookings } = await bookingsQuery

      if (bookings) {
        const completed = bookings.filter((b) => b.status === "completed")
        const totalSpent = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0)

        const bookingsByStatus: Record<string, number> = {}
        bookings.forEach((b) => {
          bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1
        })

        // Generate mock monthly data
        const monthlyData = []
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          monthlyData.push({
            month: date.toLocaleString("default", { month: "short" }),
            bookings: Math.floor(Math.random() * 10) + 2,
            spent: Math.floor(Math.random() * 150) + 50,
          })
        }

        setAnalytics({
          totalBookings: bookings.length,
          completedBookings: completed.length,
          totalSpent,
          averageRating: profile?.rating || 0,
          bookingsByStatus,
          monthlyData,
        })
      }
      setLoading(false)
    }

    fetchAnalytics()
  }, [supabase, router])

  if (loading) {
    return <div className="min-h-svh bg-background flex items-center justify-center">Loading...</div>
  }

  if (!analytics) {
    return <div className="min-h-svh bg-background flex items-center justify-center">No data available</div>
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Your activity and performance metrics</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.totalBookings}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{analytics.completedBookings}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${analytics.totalSpent.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{analytics.averageRating.toFixed(2)}/5</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings by Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {Object.entries(analytics.bookingsByStatus).map(([status, count]) => (
                <div key={status} className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Last 6 months activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyData.map((data, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{data.month}</span>
                    <span className="text-sm text-muted-foreground">
                      {data.bookings} bookings • ${data.spent}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(data.bookings / 12) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
