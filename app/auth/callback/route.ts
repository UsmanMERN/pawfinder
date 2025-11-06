import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  // If there's an error, redirect to error page
  if (error) {
    return NextResponse.redirect(
      `${new URL(request.url).origin}/auth/error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(error_description || "")}`,
    )
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      return NextResponse.redirect(
        `${new URL(request.url).origin}/auth/error?error=exchange_failed&description=${encodeURIComponent(exchangeError.message)}`,
      )
    }

    return NextResponse.redirect(`${new URL(request.url).origin}/dashboard`)
  }

  // No code or error, redirect to login
  return NextResponse.redirect(`${new URL(request.url).origin}/auth/login`)
}
