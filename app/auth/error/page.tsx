"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const description = searchParams.get("description")

  const errorMessages: Record<string, string> = {
    otp_expired: "Your verification link has expired. Please request a new one.",
    access_denied: "Access was denied. Please try signing up again.",
    invalid_code: "The verification code is invalid. Please request a new one.",
    exchange_failed: "Failed to verify your email. Please try again.",
    user_already_exists: "An account with this email already exists.",
  }

  const displayMessage = errorMessages[error as string] || description || "An authentication error occurred."

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-bold">Paw Walks</h1>
            <p className="text-sm text-muted-foreground">Professional dog walking service</p>
          </div>
          <Card className="border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-destructive" />
                <div>
                  <CardTitle>Authentication Error</CardTitle>
                  <CardDescription>Something went wrong during sign up</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground">{displayMessage}</p>
              <div className="flex flex-col gap-2">
                <Link href="/auth/sign-up" className="w-full">
                  <Button className="w-full">Try Signing Up Again</Button>
                </Link>
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
