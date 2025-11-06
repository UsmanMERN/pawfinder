import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, MapPin, Shield, Zap } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              🐾
            </div>
            <div className="text-2xl font-bold text-foreground">Paw Walks</div>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-foreground hover:bg-secondary/20">
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full space-y-12">
          <div className="space-y-8 text-center">
            <div className="inline-block px-4 py-2 bg-secondary/30 rounded-full border border-secondary/50">
              <span className="text-sm font-semibold text-primary">🚀 Trusted by 1000+ Pet Owners</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              <span className="text-pretty">Your Dog's</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Perfect Walk Awaits
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Connect with professional, verified dog walkers in your neighborhood. Get real-time updates, ensure your
              furry friend gets the best care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/auth/sign-up?type=client">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Book a Walker
                </Button>
              </Link>
              <Link href="/auth/sign-up?type=walker">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 text-foreground hover:bg-secondary/30 w-full sm:w-auto bg-transparent"
                >
                  Become a Walker
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <Card className="bg-card/50 border-border/40 backdrop-blur-sm p-6 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Verified Walkers</h3>
              <p className="text-muted-foreground">
                All walkers are background checked and certified for professional pet care.
              </p>
            </Card>

            <Card className="bg-card/50 border-border/40 backdrop-blur-sm p-6 hover:border-accent/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Real-Time Tracking</h3>
              <p className="text-muted-foreground">
                See your dog's location in real-time and receive photo updates during the walk.
              </p>
            </Card>

            <Card className="bg-card/50 border-border/40 backdrop-blur-sm p-6 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Book instantly with just a few taps. Choose your preferred walker and time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-secondary/20 border-t border-border/40 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Why Choose Paw Walks?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Professional Care", desc: "Experienced walkers who love dogs as much as you do" },
              { title: "Safe & Secure", desc: "All transactions secured and insured for peace of mind" },
              { title: "Flexible Scheduling", desc: "Book one-time walks or set up recurring schedules" },
              { title: "24/7 Support", desc: "Our team is always here to help with any concerns" },
            ].map((benefit, i) => (
              <div key={i} className="flex gap-4">
                <Check className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl p-12 border border-border/30">
          <h2 className="text-3xl font-bold text-foreground">Ready to Give Your Dog the Best Care?</h2>
          <p className="text-muted-foreground">Join thousands of happy pet owners who trust Paw Walks</p>
          <Link href="/auth/sign-up?type=client">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/10 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2025 Paw Walks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
