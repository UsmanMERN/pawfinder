"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface WalkerStats {
  totalEarnings: number
  completedWalks: number
  averageRating: number
  pendingPayouts: number
}

export default function WalletPage() {
  const [stats, setStats] = useState<WalkerStats>({
    totalEarnings: 0,
    completedWalks: 0,
    averageRating: 0,
    pendingPayouts: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Verify user is a walker
      const { data: profile } = await supabase.from("profiles").select("user_type, rating").eq("id", user.id).single()

      if (profile?.user_type !== "walker") {
        router.push("/dashboard")
        return
      }

      // Get completed bookings and calculate earnings
      const { data: bookings } = await supabase.from("bookings").select("total_price, status").eq("walker_id", user.id)

      if (bookings) {
        const completed = bookings.filter((b) => b.status === "completed")
        const totalEarnings = completed.reduce((sum, b) => sum + (b.total_price || 0), 0)
        const pendingPayouts = Math.floor(totalEarnings * 0.8) // 80% available after 20% commission

        setStats({
          totalEarnings: totalEarnings,
          completedWalks: completed.length,
          averageRating: profile?.rating || 0,
          pendingPayouts: pendingPayouts,
        })
      }
      setLoading(false)
    }

    fetchStats()
  }, [supabase, router])

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Wallet & Earnings</h1>
            <p className="text-muted-foreground">Track your income and payments</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">${stats.pendingPayouts.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed Walks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.completedWalks}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {stats.averageRating.toFixed(2)}
                  <span className="text-sm text-muted-foreground"> / 5</span>
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Commission</p>
              <p className="font-semibold">20%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payout Schedule</p>
              <p className="font-semibold">Weekly (every Monday)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Minimum Payout</p>
              <p className="font-semibold">$10.00</p>
            </div>
            <Button className="w-full mt-4">Request Payout</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
