"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AddDogPage() {
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    special_needs: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error: insertError } = await supabase.from("dogs").insert({
        client_id: user.id,
        name: formData.name,
        breed: formData.breed,
        age: Number.parseInt(formData.age),
        weight: formData.weight,
        special_needs: formData.special_needs || null,
      })

      if (insertError) throw insertError
      router.push("/dashboard/dogs")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Link href="/dashboard/dogs" className="text-sm text-muted-foreground mb-4 inline-block">
          ← Back to My Dogs
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Add a New Dog</CardTitle>
            <CardDescription>Tell us about your furry friend</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Dog Name *</Label>
                <Input id="name" name="name" placeholder="Max" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="breed">Breed *</Label>
                <Input
                  id="breed"
                  name="breed"
                  placeholder="Golden Retriever"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="5"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="weight">Weight *</Label>
                <Input
                  id="weight"
                  name="weight"
                  placeholder="25 lbs"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="special_needs">Special Needs (Optional)</Label>
                <Input
                  id="special_needs"
                  name="special_needs"
                  placeholder="Anxiety with other dogs, requires breaks, etc."
                  value={formData.special_needs}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Dog"}
                </Button>
                <Link href="/dashboard/dogs">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
