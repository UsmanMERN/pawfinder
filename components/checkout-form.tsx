"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  packageId: string
  bookingId: string
  onSuccess?: () => void
}

export default function CheckoutForm({ packageId, bookingId, onSuccess }: CheckoutFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const handleFetchClientSecret = useCallback(async () => {
    try {
      setError(null)
      const secret = await startCheckoutSession(packageId, bookingId)
      setClientSecret(secret)
      setLoading(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start checkout"
      setError(message)
      setLoading(false)
    }
  }, [packageId, bookingId])

  if (error) {
    return (
      <div className="p-4 text-red-600">
        <p>Error: {error}</p>
        <button onClick={handleFetchClientSecret} className="mt-2 text-blue-600 underline">
          Try again
        </button>
      </div>
    )
  }

  if (loading) {
    return <div className="p-4">Loading checkout...</div>
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          clientSecret: clientSecret || "",
          onComplete: () => {
            if (onSuccess) {
              onSuccess()
            }
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
