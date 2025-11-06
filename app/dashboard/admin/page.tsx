"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, Legend, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import { Users, BookOpen, DollarSign, Star, Clock, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react"

// Define interfaces for better type safety
interface RevenuePoint { month: string; revenue: number }
interface BookingStatus { name: string; value: number; color: string;[key: string]: any }
interface UserGrowthPoint { month: string; clients: number; walkers: number }
interface TopWalker { name: string; bookings: number; revenue: number; rating: number }
interface RecentBooking { id: string; status: string; total_price: number; created_at: string; client_name: string; walker_name: string }
interface SystemHealth { uptime: number; avgResponseTime: number; activeUsers: number }
interface Stats {
  totalClients: number
  totalWalkers: number
  totalBookings: number
  totalRevenue: number
  activeBookings: number
  averageRating: number
  revenueData: RevenuePoint[]
  bookingsByStatus: BookingStatus[]
  userGrowth: UserGrowthPoint[]
  topWalkers: TopWalker[]
  recentBookings: RecentBooking[]
  systemHealth: SystemHealth
}

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-700">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} style={{ color: pld.color }}>
            {pld.name}: {pld.dataKey.includes('revenue') ? `$${pld.value.toLocaleString()}` : pld.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const supabase = createClient()
      const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const statusColors: { [key: string]: string } = {
        pending: "#f59e0b",
        confirmed: "#22c55e",
        in_progress: "#3b82f6",
        completed: "#10b981",
        cancelled: "#ef4444"
      }

      // --- QUERIES (REMOVED .groupBy) ---
      const [
        clientsRes,
        walkersRes,
        bookingsRes,
        activeRes,
        avgRatingRes,
        totalRevRes,
        // FIX: Renamed for clarity, as this is now raw data for multiple aggregations
        allBookingsForAggregation,
        profilesRes,
        recentBookingsRes
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'client'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('user_type', 'walker'),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('reviews').select('rating'), // Fetch all ratings to average on client
        supabase.from('bookings').select('total_price').eq('payment_status', 'paid'), // Fetch all prices to sum on client
        // FIX: Fetch all bookings with status, walker_id, and price for client-side grouping
        supabase.from('bookings').select('status, walker_id, total_price, created_at, payment_status'),
        supabase.from('profiles').select('user_type, created_at').in('user_type', ['client', 'walker']),
        supabase.from('bookings').select('id, status, total_price, created_at, client_id, walker_id').order('created_at', { ascending: false }).limit(4)
      ]);

      // --- DATA HANDLING & CLIENT-SIDE AGGREGATION ---
      const totalClients = clientsRes.count || 0
      const totalWalkers = walkersRes.count || 0
      const totalBookings = bookingsRes.count || 0
      const activeBookings = activeRes.count || 0

      // FIX: Calculate average rating on the client
      const ratings = avgRatingRes.data?.map(r => r.rating) || [0];
      const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

      // FIX: Calculate total revenue on the client
      const totalRevenue = totalRevRes.data?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

      // FIX: Manually group bookings by status on the client
      const bookingsByStatusMap = allBookingsForAggregation.data?.reduce((acc, booking) => {
        acc.set(booking.status, (acc.get(booking.status) || 0) + 1);
        return acc;
      }, new Map<string, number>());

      const bookingsByStatus = Array.from(bookingsByStatusMap?.entries() || []).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
        value: count,
        color: statusColors[status] || '#6b7280'
      }));

      // FIX: Manually group by walker to find top walkers
      const walkerStats = allBookingsForAggregation.data
        ?.filter(b => b.payment_status === 'paid' && b.walker_id)
        .reduce((acc, booking) => {
          const walkerId = booking.walker_id!;
          if (!acc[walkerId]) {
            acc[walkerId] = { walker_id: walkerId, bookings: 0, revenue: 0 };
          }
          acc[walkerId].bookings += 1;
          acc[walkerId].revenue += booking.total_price || 0;
          return acc;
        }, {} as { [key: string]: { walker_id: string, bookings: number, revenue: number } });

      const topWalkersData = Object.values(walkerStats || {})
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

      let topWalkers: TopWalker[] = [];
      const topWalkerIds = topWalkersData.map(w => w.walker_id);

      if (topWalkerIds.length > 0) {
        const [profilesRes2, ratingsRes2] = await Promise.all([
          supabase.from('profiles').select('id, full_name').in('id', topWalkerIds),
          supabase.from('reviews').select('walker_id, rating').in('walker_id', topWalkerIds)
        ]);

        // Calculate average ratings for top walkers on the client
        const walkerAvgRatings = ratingsRes2.data?.reduce((acc, review) => {
          const walkerId = review.walker_id!;
          if (!acc[walkerId]) {
            acc[walkerId] = { total: 0, count: 0 };
          }
          acc[walkerId].total += review.rating;
          acc[walkerId].count += 1;
          return acc;
        }, {} as { [key: string]: { total: number, count: number } });

        topWalkers = topWalkersData.map(w => {
          const profile = profilesRes2.data?.find(p => p.id === w.walker_id);
          const ratingData = walkerAvgRatings ? walkerAvgRatings[w.walker_id] : null;
          const rating = ratingData ? ratingData.total / ratingData.count : 0;
          return {
            name: profile?.full_name || 'Unknown',
            bookings: w.bookings,
            revenue: w.revenue,
            rating: rating
          };
        });
      }

      // Revenue data
      const revenueMap = new Map();
      allBookingsForAggregation.data?.filter(b => b.payment_status === 'paid').forEach(b => {
        const date = new Date(b.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        const rev = revenueMap.get(month) || 0;
        revenueMap.set(month, rev + (b.total_price || 0));
      });
      let revenueData = Array.from(revenueMap, ([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month))
        .slice(-6);

      // User growth
      const clientMap = new Map();
      const walkerMap = new Map();
      profilesRes.data?.forEach(p => {
        const date = new Date(p.created_at);
        const month = date.toLocaleString('default', { month: 'short' });
        if (p.user_type === 'client') {
          clientMap.set(month, (clientMap.get(month) || 0) + 1);
        } else if (p.user_type === 'walker') {
          walkerMap.set(month, (walkerMap.get(month) || 0) + 1);
        }
      });
      const allMonths = [...new Set([...clientMap.keys(), ...walkerMap.keys()])];
      const sortedMonths = allMonths.sort((a, b) => monthsOrder.indexOf(a) - monthsOrder.indexOf(b));
      let cumClients = 0;
      let cumWalkers = 0;
      let userGrowth = sortedMonths.map(month => {
        cumClients += clientMap.get(month) || 0;
        cumWalkers += walkerMap.get(month) || 0;
        return { month, clients: cumClients, walkers: cumWalkers };
      }).slice(-6);

      // Recent bookings
      const clientIds = recentBookingsRes.data?.map(b => b.client_id).filter(Boolean) || [];
      const walkerIdsRecent = recentBookingsRes.data?.map(b => b.walker_id).filter(Boolean) || [];
      const allIds = [...new Set([...clientIds, ...walkerIdsRecent])];
      let namesRes = { data: [] as any[] };
      if (allIds.length > 0) {
        const profilesResForNames = await supabase.from('profiles').select('id, full_name').in('id', allIds);
        namesRes = { data: profilesResForNames.data ?? [] };
      }
      const recentBookings = recentBookingsRes.data?.map(b => ({
        id: b.id,
        status: b.status,
        total_price: b.total_price || 0,
        created_at: b.created_at,
        client_name: namesRes.data?.find(p => p.id === b.client_id)?.full_name || 'Unknown',
        walker_name: namesRes.data?.find(p => p.id === b.walker_id)?.full_name || 'Unknown'
      })) || [];

      // System health (mock as no data source)
      const systemHealth = { uptime: 99.98, avgResponseTime: 120, activeUsers: 142 };

      setStats({
        totalClients,
        totalWalkers,
        totalBookings,
        totalRevenue,
        activeBookings,
        averageRating,
        revenueData,
        bookingsByStatus,
        userGrowth,
        topWalkers,
        recentBookings,
        systemHealth
      })
      setLoading(false)
    }
    fetchDashboardData()
  }, [])

  // --- JSX (NO CHANGES BELOW THIS LINE) ---
  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const KpiCard = ({ title, value, icon: Icon, trend }: { title: string, value: string, icon: React.ElementType, trend?: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground flex items-center">{trend}</p>}
      </CardContent>
    </Card>
  )

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed': return <div className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700"><CheckCircle className="w-3 h-3" />Completed</div>
      case 'in_progress': return <div className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700"><Clock className="w-3 h-3" />In Progress</div>
      case 'pending': return <div className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700"><Clock className="w-3 h-3" />Pending</div>
      case 'confirmed': return <div className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" />Confirmed</div>
      case 'cancelled': return <div className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Cancelled</div>
      default: return null
    }
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here's your platform overview.</p>
        </div>
        <Button><FileText className="w-4 h-4 mr-2" /> Generate Report</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(1)}k`} icon={DollarSign} trend="+12.1% from last month" />
        <KpiCard title="Total Bookings" value={stats.totalBookings.toLocaleString()} icon={BookOpen} trend="+8.5% from last month" />
        <KpiCard title="Active Clients" value={stats.totalClients.toLocaleString()} icon={Users} trend="+2 new clients today" />
        <KpiCard title="Average Rating" value={stats.averageRating.toFixed(2)} icon={Star} trend="Maintained from last week" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#888888" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} />
                <Bar dataKey="revenue" fill="#007aff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bookings by Status</CardTitle>
            <CardDescription>Distribution of all current bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.bookingsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {stats.bookingsByStatus.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings & Top Walkers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>A list of the most recent bookings on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="p-3 font-medium">Booking ID</th><th className="p-3 font-medium">Client</th>
                    <th className="p-3 font-medium">Walker</th><th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs text-muted-foreground">{booking.id.slice(0, 8)}</td>
                      <td className="p-3 font-medium text-gray-800">{booking.client_name}</td>
                      <td className="p-3">{booking.walker_name}</td>
                      <td className="p-3">{getStatusChip(booking.status)}</td>
                      <td className="p-3 font-medium text-gray-800 text-right">${booking.total_price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Walkers</CardTitle>
            <CardDescription>By all-time revenue generated.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats.topWalkers.map((walker) => (
                <li key={walker.name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-primary">
                    {walker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{walker.name}</p>
                    <p className="text-sm text-muted-foreground">{walker.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">${walker.revenue.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{walker.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}