"use server"

import { stripe } from "@/lib/stripe"
import { SERVICE_PACKAGES } from "@/lib/products"

export async function startCheckoutSession(packageId: string, bookingId: string) {
  const servicePackage = SERVICE_PACKAGES.find((p) => p.id === packageId)

  if (!servicePackage) {
    throw new Error(`Service package with id "${packageId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: servicePackage.name,
            description: servicePackage.description,
          },
          unit_amount: servicePackage.priceInCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId,
    },
    mode: "payment",
  })

  return session.client_secret
}
