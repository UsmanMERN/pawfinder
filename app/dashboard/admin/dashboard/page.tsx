"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, BookOpen, TrendingUp, DollarSign, AlertCircle, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeWalkers: 0,
    revenueData: [],
    bookingsByStatus: [],
    topWalkers: [],
    recentBookings: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [usersRes, bookingsRes, paymentsRes] = await Promise.all([
        supabase.from("user_profiles").select("id, role"),
        supabase.from("bookings").select("*"),
        supabase.from("payments").select("amount, created_at"),
      ])

      const totalUsers = usersRes.data?.length || 0
      const totalBookings = bookingsRes.data?.length || 0
      const totalRevenue = paymentsRes.data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      const activeWalkers = usersRes.data?.filter((u) => u.role === "walker").length || 0

      // Revenue data for chart
      const revenueData = [
        { month: "Jan", revenue: 2400 },
        { month: "Feb", revenue: 1398 },
        { month: "Mar", revenue: 9800 },
        { month: "Apr", revenue: 3908 },
        { month: "May", revenue: 4800 },
        { month: "Jun", revenue: 3800 },
      ]

      // Booking status breakdown
      const bookingsByStatus = [
        { name: "Completed", value: bookingsRes.data?.filter((b) => b.status === "completed").length || 0 },
        { name: "Pending", value: bookingsRes.data?.filter((b) => b.status === "pending").length || 0 },
        { name: "Cancelled", value: bookingsRes.data?.filter((b) => b.status === "cancelled").length || 0 },
      ]

      // Top walkers
      const topWalkers = [
        { name: "Sarah M.", bookings: 45, rating: 4.9 },
        { name: "John D.", bookings: 38, rating: 4.8 },
        { name: "Emma L.", bookings: 32, rating: 4.7 },
      ]

      setStats({
        totalUsers,
        totalBookings,
        totalRevenue,
        activeWalkers,
        revenueData,
        bookingsByStatus,
        topWalkers,
        recentBookings: bookingsRes.data?.slice(0, 5) || [],
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#a16207", "#ca8a04", "#f59e0b"]

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Generate Report</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-border/40 p-6 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalUsers}</p>
              <p className="text-accent text-xs mt-2">+12% from last month</p>
            </div>
            <Users className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="bg-card/50 border-border/40 p-6 hover:border-accent/30 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalBookings}</p>
              <p className="text-accent text-xs mt-2">+8% from last month</p>
            </div>
            <BookOpen className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>

        <Card className="bg-card/50 border-border/40 p-6 hover:border-primary/30 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-foreground">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
              <p className="text-accent text-xs mt-2">+15% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="bg-card/50 border-border/40 p-6 hover:border-accent/30 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Active Walkers</p>
              <p className="text-3xl font-bold text-foreground">{stats.activeWalkers}</p>
              <p className="text-accent text-xs mt-2">+5% from last month</p>
            </div>
            <TrendingUp className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-card/50 border-border/40 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Booking Status Pie Chart */}
        <Card className="bg-card/50 border-border/40 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Booking Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.bookingsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Walkers & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Walkers */}
        <Card className="bg-card/50 border-border/40 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Walkers</h3>
          <div className="space-y-4">
            {stats.topWalkers.map((walker, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/40"
              >
                <div>
                  <p className="font-medium text-foreground">{walker.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {walker.bookings} bookings • ⭐ {walker.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Bookings */}
        <Card className="bg-card/50 border-border/40 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {stats.recentBookings.slice(0, 3).map((booking, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-border/40"
              >
                <div className="flex items-center gap-3 flex-1">
                  {booking.status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-accent" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground capitalize">{booking.service_type || "Dog Walk"}</p>
                    <p className="text-sm text-muted-foreground capitalize">{booking.status}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">${booking.price}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
