"use client"

import { useSearchParams } from "next/navigation"
import CheckoutForm from "@/components/checkout-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const packageId = searchParams.get("packageId")
  const bookingId = searchParams.get("bookingId")

  if (!packageId || !bookingId) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Invalid checkout request</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Complete Payment</h1>
          <p className="text-muted-foreground">Secure payment powered by Stripe</p>
        </div>

        <CheckoutForm
          packageId={packageId}
          bookingId={bookingId}
          onSuccess={() => {
            window.location.href = "/dashboard/bookings"
          }}
        />
      </div>
    </div>
  )
}
