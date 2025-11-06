"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface WalkerProfile {
  id: string
  full_name: string
  email: string
  phone: string
  rating: number
  bio: string
  hourly_rate: number
  max_dogs: number
  experience_years: number
  certifications: string[]
  is_available: boolean
}

export default function WalkerProfilePage() {
  const [profile, setProfile] = useState<WalkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<WalkerProfile>>({})
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get user profile
      const { data: userProfile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

      // Get walker details
      // FIX: Use .maybeSingle() to prevent error if walker profile doesn't exist yet
      const { data: walkerData } = await supabase.from("walkers").select("*").eq("id", user.id).maybeSingle()

      if (userProfile && walkerData) {
        const combined = {
          ...userProfile,
          ...walkerData,
        }
        setProfile(combined as unknown as WalkerProfile)
        setFormData(combined)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      is_available: !prev.is_available,
    }))
  }

  const handleSave = async () => {
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Update profile
      await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          bio: formData.bio,
        })
        .eq("id", user.id)

      // Update walker info
      await supabase
        .from("walkers")
        .update({
          hourly_rate: formData.hourly_rate,
          max_dogs: formData.max_dogs,
          experience_years: formData.experience_years,
          is_available: formData.is_available,
        })
        .eq("id", user.id)

      setProfile(formData as WalkerProfile)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  if (loading) {
    return <div className="min-h-svh bg-background flex items-center justify-center">Loading...</div>
  }

  // Gracefully handle case where profile doesn't exist
  if (!profile) {
    return (
      <div className="min-h-svh bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Walker profile not found.</p>
          <Link href="/dashboard">
            <Button variant="link">Go Back</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>Walker Information</CardTitle>
              <Button
                variant={editing ? "destructive" : "default"}
                onClick={() => {
                  if (editing) {
                    setFormData(profile || {})
                  }
                  setEditing(!editing)
                }}
              >
                {editing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating */}
            <div>
              <Label className="text-muted-foreground">Rating</Label>
              <p className="text-2xl font-bold">{profile.rating?.toFixed(2) || "N/A"} / 5.00</p>
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              {editing ? (
                <Input id="full_name" name="full_name" value={formData.full_name || ""} onChange={handleChange} />
              ) : (
                <p>{profile.full_name || "Not set"}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              {editing ? (
                <Input id="email" name="email" value={profile.email || ""} disabled />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              {editing ? (
                <Input id="phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
              ) : (
                <p>{profile.phone || "Not set"}</p>
              )}
            </div>

            {/* Bio */}
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              {editing ? (
                <Input
                  id="bio"
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  placeholder="Tell clients about yourself"
                />
              ) : (
                <p className="text-muted-foreground">{profile.bio || "Not set"}</p>
              )}
            </div>

            {/* Hourly Rate */}
            <div className="grid gap-2">
              <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
              {editing ? (
                <Input
                  id="hourly_rate"
                  name="hourly_rate"
                  type="number"
                  step="0.01"
                  value={formData.hourly_rate || 0}
                  onChange={handleChange}
                />
              ) : (
                <p>${profile.hourly_rate?.toFixed(2) || "0.00"}</p>
              )}
            </div>

            {/* Max Dogs */}
            <div className="grid gap-2">
              <Label htmlFor="max_dogs">Max Dogs per Walk</Label>
              {editing ? (
                <Input
                  id="max_dogs"
                  name="max_dogs"
                  type="number"
                  value={formData.max_dogs || 1}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.max_dogs}</p>
              )}
            </div>

            {/* Experience */}
            <div className="grid gap-2">
              <Label htmlFor="experience_years">Years of Experience</Label>
              {editing ? (
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  value={formData.experience_years || 0}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.experience_years} years</p>
              )}
            </div>

            {/* Availability */}
            <div className="grid gap-2">
              <Label>Currently Available</Label>
              {editing ? (
                <Button
                  variant={formData.is_available ? "default" : "outline"}
                  onClick={handleToggle}
                  className="w-fit"
                >
                  {formData.is_available ? "Available" : "Unavailable"}
                </Button>
              ) : (
                <p className={profile.is_available ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                  {profile.is_available ? "Available" : "Unavailable"}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {editing && (
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}