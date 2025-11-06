"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: "booking" | "message" | "payment" | "review"
  title: string
  description: string
  timestamp: string
  read: boolean
}

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Simulated notifications based on user activity
      // In production, these would be stored in database
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "booking",
          title: "New Booking Request",
          description: "Sarah requested a 1-hour walk for Max",
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          read: false,
        },
        {
          id: "2",
          type: "payment",
          title: "Payment Received",
          description: "You received $25.00 from booking #12345",
          timestamp: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
          read: true,
        },
        {
          id: "3",
          type: "review",
          title: "New Review",
          description: "John left a 5-star review for your last walk",
          timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
          read: true,
        },
      ]

      setNotifications(mockNotifications)
    }

    fetchNotifications()
  }, [supabase])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return "📅"
      case "message":
        return "💬"
      case "payment":
        return "💰"
      case "review":
        return "⭐"
      default:
        return "🔔"
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="relative">
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
          <Card className="border-0">
            <CardHeader className="pb-3">
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border ${
                      notif.read ? "bg-background border-border" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getNotificationIcon(notif.type)}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{notif.title}</p>
                        <p className="text-sm text-muted-foreground">{notif.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notif.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
