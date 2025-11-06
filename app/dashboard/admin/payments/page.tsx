"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"

export default function PaymentsPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    pendingPayments: 0,
    averageTransactionValue: 0,
    recentPayments: [],
    paymentTrend: [],
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPaymentData()
  }, [])

  const fetchPaymentData = async () => {
    try {
      const { data: payments } = await supabase.from("payments").select("*").order("created_at", { ascending: false })

      const totalPayments = payments?.length || 0
      const successfulPayments = payments?.filter((p) => p.status === "completed").length || 0
      const failedPayments = payments?.filter((p) => p.status === "failed").length || 0
      const pendingPayments = payments?.filter((p) => p.status === "pending").length || 0
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      const averageTransactionValue = totalPayments > 0 ? totalRevenue / totalPayments : 0

      const paymentTrend = [
        { day: "Mon", successful: 12, failed: 2, pending: 1 },
        { day: "Tue", successful: 15, failed: 1, pending: 2 },
        { day: "Wed", successful: 18, failed: 3, pending: 0 },
        { day: "Thu", successful: 14, failed: 2, pending: 1 },
        { day: "Fri", successful: 22, failed: 1, pending: 2 },
        { day: "Sat", successful: 19, failed: 2, pending: 1 },
        { day: "Sun", successful: 16, failed: 1, pending: 3 },
      ]

      setStats({
        totalRevenue,
        totalPayments,
        successfulPayments,
        failedPayments,
        pendingPayments,
        averageTransactionValue,
        recentPayments: payments?.slice(0, 10) || [],
        paymentTrend,
      })
    } catch (error) {
      console.error("Error fetching payment data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8 overflow-auto">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Payment Management</h1>
        <p className="text-muted-foreground">Track and manage all transactions on the platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-card/50 border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary opacity-40" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Total Payments</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalPayments}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent opacity-40" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Successful</p>
                <p className="text-3xl font-bold text-green-600">{stats.successfulPayments}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-40" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Failed</p>
                <p className="text-3xl font-bold text-red-600">{stats.failedPayments}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600 opacity-40" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/40">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Avg Transaction</p>
                <p className="text-3xl font-bold text-foreground">${stats.averageTransactionValue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary opacity-40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Trend Chart */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle>Payment Trend (Last 7 Days)</CardTitle>
          <CardDescription>Daily payment success rate</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.paymentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)" }}
              />
              <Legend />
              <Bar dataKey="successful" fill="#10b981" name="Successful" />
              <Bar dataKey="failed" fill="#ef4444" name="Failed" />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Payments Table */}
      <Card className="bg-card/50 border-border/40">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest transactions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {stats.recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                      {payment.id?.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">${payment.amount}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                        View
                      </Button>
                    </td>
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
