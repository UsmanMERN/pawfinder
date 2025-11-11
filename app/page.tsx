// app/page.tsx

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import HomePageClient from "@/components/HomePageClient" // Assuming you create the file here

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  // Render the client component that contains all the UI
  return <HomePageClient />
}