export interface ServicePackage {
  id: string
  name: string
  description: string
  durationMinutes: number
  priceInCents: number
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: "walk-30min",
    name: "30 Minute Walk",
    description: "Quick 30-minute walk around the neighborhood",
    durationMinutes: 30,
    priceInCents: 1500, // $15.00
  },
  {
    id: "walk-60min",
    name: "1 Hour Walk",
    description: "Full hour walk with exercise and socialization",
    durationMinutes: 60,
    priceInCents: 2500, // $25.00
  },
  {
    id: "walk-90min",
    name: "1.5 Hour Walk",
    description: "Extended walk with playtime and training",
    durationMinutes: 90,
    priceInCents: 3500, // $35.00
  },
  {
    id: "walk-120min",
    name: "2 Hour Walk",
    description: "Full adventure with park time and exploration",
    durationMinutes: 120,
    priceInCents: 4500, // $45.00
  },
]
