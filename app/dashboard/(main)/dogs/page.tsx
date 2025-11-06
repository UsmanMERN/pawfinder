"use client"

import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Dog {
  id: string
  name: string
  breed: string
  age: number
  weight: string
  special_needs: string
}

export default function DogsPage() {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchDogs = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data, error } = await supabase.from("dogs").select("*").eq("client_id", user.id)

      if (!error && data) {
        setDogs(data)
      }
      setLoading(false)
    }

    fetchDogs()
  }, [supabase, router])

  return (
    <div className="min-h-svh bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dogs</h1>
            <p className="text-muted-foreground">Manage your dogs' profiles</p>
          </div>
          <Link href="/dashboard/dogs/add">
            <Button>Add a Dog</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : dogs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">No dogs yet. Add your first dog!</p>
              <Link href="/dashboard/dogs/add">
                <Button>Add a Dog</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dogs.map((dog) => (
              <Card key={dog.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{dog.name}</CardTitle>
                  <CardDescription>{dog.breed}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold">Age:</span> {dog.age} years
                    </p>
                    <p>
                      <span className="font-semibold">Weight:</span> {dog.weight}
                    </p>
                    {dog.special_needs && (
                      <p>
                        <span className="font-semibold">Special needs:</span> {dog.special_needs}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/dashboard/dogs/${dog.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
