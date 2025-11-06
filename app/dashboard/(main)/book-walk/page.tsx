"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Dog, User, Calendar, MapPin, Hourglass, Info, Loader2 } from "lucide-react"

// Interface for a user's dog
interface Dog {
  id: string
  name: string
}

// Interface for an available walker
interface Walker {
  id: string
  profiles: {
    full_name: string
  } | null
  hourly_rate: number
}

export default function BookWalkPage() {
  // Data and loading states
  const [dogs, setDogs] = useState<Dog[]>([])
  const [walkers, setWalkers] = useState<Walker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form input states
  const [selectedDogId, setSelectedDogId] = useState("")
  const [selectedWalkerId, setSelectedWalkerId] = useState("")
  const [startTime, setStartTime] = useState("")
  const [duration, setDuration] = useState("30")
  const [location, setLocation] = useState("")

  const router = useRouter()
  const supabase = createClient()

  // Effect to fetch initial data for the form
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const [dogsRes, walkersRes] = await Promise.all([
        supabase.from("dogs").select("id, name").eq("client_id", user.id),
        supabase.from("walkers").select("id, hourly_rate, profiles!inner(full_name)").eq("is_available", true),
      ])

      if (dogsRes.data) setDogs(dogsRes.data)
      if (walkersRes.data) setWalkers(walkersRes.data as unknown as Walker[])
      if (walkersRes.error) setError("Could not fetch available walkers. Please try again later.")

      setIsLoading(false)
    }
    fetchData()
  }, [supabase, router])

  // Memoized derived state for the summary panel and validation
  const { selectedDog, selectedWalker, totalPrice, isFormValid, minDateTime } = useMemo(() => {
    const dog = dogs.find(d => d.id === selectedDogId)
    const walker = walkers.find(w => w.id === selectedWalkerId)
    const price = walker ? (Number(walker.hourly_rate) / 60) * parseInt(duration) : 0
    const valid = !!(selectedDogId && selectedWalkerId && startTime && location)

    // Prevent selecting dates in the past
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()) // Adjust for local timezone
    const dt = now.toISOString().slice(0, 16)

    return {
      selectedDog: dog,
      selectedWalker: walker,
      totalPrice: price,
      isFormValid: valid,
      minDateTime: dt
    }
  }, [selectedDogId, selectedWalkerId, duration, startTime, location, dogs, walkers])

  // Handler for the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setError("Please fill out all required fields to complete the booking.")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !selectedWalker) throw new Error("Authentication error or walker not found.")

      const scheduledStart = new Date(startTime)
      const scheduledEnd = new Date(scheduledStart.getTime() + parseInt(duration) * 60000)

      const { error: bookingError } = await supabase.from("bookings").insert({
        client_id: user.id,
        walker_id: selectedWalkerId,
        dogs: [selectedDogId],
        scheduled_start: scheduledStart.toISOString(),
        scheduled_end: scheduledEnd.toISOString(),
        duration_minutes: parseInt(duration),
        status: "pending",
        location,
        price_per_dog: totalPrice,
        total_price: totalPrice,
      })

      if (bookingError) throw bookingError

      router.push("/dashboard/bookings?status=success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin w-8 h-8" /></div>
  }

  if (dogs.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto text-center">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Add a Dog to Get Started!</AlertTitle>
          <AlertDescription>You need to add a dog to your profile before you can book a walk.</AlertDescription>
        </Alert>
        <Link href="/dashboard/dogs/add"><Button className="mt-6">Add Your First Dog</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold tracking-tight">Book a Dog Walk</h1>
        <p className="text-lg text-muted-foreground mt-2">Schedule a walk with one of our trusted professionals in just a few steps.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Walk Details</CardTitle>
              <CardDescription>Select the dog you want to book for and choose an available walker.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="dog">Which dog?</Label>
                <Select required value={selectedDogId} onValueChange={setSelectedDogId}>
                  <SelectTrigger id="dog"><SelectValue placeholder="Select a dog" /></SelectTrigger>
                  <SelectContent>
                    {dogs.map((dog) => <SelectItem key={dog.id} value={dog.id}>{dog.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="walker">Who will be walking?</Label>
                <Select required value={selectedWalkerId} onValueChange={setSelectedWalkerId} disabled={walkers.length === 0}>
                  <SelectTrigger id="walker">
                    <SelectValue placeholder={walkers.length > 0 ? "Select a walker" : "No walkers available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {walkers.map((walker) => (
                      <SelectItem key={walker.id} value={walker.id}>
                        {walker.profiles?.full_name} (${Number(walker.hourly_rate).toFixed(2)}/hr)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            {walkers.length === 0 && (
              <CardFooter>
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Walkers Available</AlertTitle>
                  <AlertDescription>We're sorry, but there are no walkers available at this time. Please check back later.</AlertDescription>
                </Alert>
              </CardFooter>
            )}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Scheduling & Location</CardTitle>
              <CardDescription>Tell us where and when the walk should take place.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="location">Pickup Location</Label>
                <Input id="location" type="text" placeholder="e.g., 123 Main St, Anytown" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="datetime-local" value={startTime} min={minDateTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Summary and Submit */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-md">
            <CardHeader><CardTitle>Booking Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center justify-between"><span className="flex items-center"><Dog className="w-4 h-4 mr-2" /> Dog</span><span className="font-medium text-foreground">{selectedDog?.name || "—"}</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center"><User className="w-4 h-4 mr-2" /> Walker</span><span className="font-medium text-foreground">{selectedWalker?.profiles?.full_name || "—"}</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location</span><span className="font-medium text-foreground truncate max-w-[150px]">{location || "—"}</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Starts</span><span className="font-medium text-foreground text-right">{startTime ? new Date(startTime).toLocaleString() : "—"}</span></li>
                <li className="flex items-center justify-between"><span className="flex items-center"><Hourglass className="w-4 h-4 mr-2" /> Duration</span><span className="font-medium text-foreground">{duration} minutes</span></li>
              </ul>
              <Separator />
              <div className="flex items-center justify-between text-lg font-bold"><span className="text-base">Total Price</span><span>${totalPrice.toFixed(2)}</span></div>
            </CardContent>
            <CardFooter className="flex-col items-stretch">
              {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}
              <Button type="submit" size="lg" disabled={!isFormValid || isSubmitting || walkers.length === 0} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Booking..." : "Confirm & Book Walk"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}