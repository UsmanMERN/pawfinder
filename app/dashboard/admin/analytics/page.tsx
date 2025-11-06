"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

export default function AnalyticsPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    userRetention: [],
    walkerPerformance: [],
    bookingConversion: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const userRetention = [
        { month: "Jan", retention: 78, newUsers: 120 },
        { month: "Feb", retention: 82, newUsers: 145 },
        { month: "Mar", retention: 85, newUsers: 200 },
        { month: "Apr", retention: 88, newUsers: 250 },
        { month: "May", retention: 90, newUsers: 320 },
        { month: "Jun", retention: 92, newUsers: 380 },
      ]

      const walkerPerformance = [
        { walker: "Sarah M.", completionRate: 98, avgRating: 4.9, avgTime: 45 },
        { walker: "John D.", completionRate: 96, avgRating: 4.8, avgTime: 42 },
        { walker: "Emma L.", completionRate: 95, avgRating: 4.7, avgTime: 48 },
        { walker: "Alex K.", completionRate: 94, avgRating: 4.6, avgTime: 50 },
      ]

      const bookingConversion = [
        { week: "Week 1", views: 1200, bookings: 240, conversion: 20 },
        { week: "Week 2", views: 1400, bookings: 308, conversion: 22 },
        { week: "Week 3", views: 1600, bookings: 384, conversion: 24 },
        { week: "Week 4", views: 1800, bookings: 486, conversion: 27 },
        { week: "Week 5", views: 2000, bookings: 580, conversion: 29 },
      ]

      setStats({
        userRetention,
        walkerPerformance,
        bookingConversion,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8 overflow-auto">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Comprehensive platform metrics and performance data</p>
      </div>

      {/* User Retention */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle>User Retention & Growth</CardTitle>
          <CardDescription>Monthly retention rate and new user acquisition</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.userRetention}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" dataKey="month" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Area
                type="monotone"
                dataKey="retention"
                fill="var(--color-primary)"
                stroke="var(--color-primary)"
                name="Retention %"
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                fill="var(--color-accent)"
                stroke="var(--color-accent)"
                name="New Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Booking Conversion */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle>Booking Conversion Funnel</CardTitle>
          <CardDescription>Page views to booking conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.bookingConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Line type="monotone" dataKey="views" stroke="var(--color-primary)" strokeWidth={2} name="Page Views" />
              <Line type="monotone" dataKey="bookings" stroke="var(--color-accent)" strokeWidth={2} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Walker Performance */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle>Walker Performance Metrics</CardTitle>
          <CardDescription>Individual walker statistics and KPIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Walker</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Completion Rate</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Avg Rating</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Avg Walk Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {stats.walkerPerformance.map((walker, i) => (
                  <tr key={i} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{walker.walker}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-secondary/20 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${walker.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold">{walker.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{walker.avgRating} ⭐</td>
                    <td className="px-6 py-4 text-muted-foreground">{walker.avgTime} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
