"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function SignOutPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleSignOut = async () => {
      await supabase.auth.signOut()
      router.push("/auth/login")
    }
    handleSignOut()
  }, [supabase, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Signing out...</p>
      </div>
    </div>
  )
}
