// components/HomePageClient.tsx

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Check,
    MapPin,
    Shield,
    Zap,
    Users,
    MessageSquare,
    CalendarDays,
    CreditCard,
    Quote,
    Heart,
    Star,
    Clock,
    Camera,
    PawPrint,
    CheckCircle2,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import Footer from "./Footer";

export default function HomePageClient() {
    const features = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Verified & Trusted Walkers",
            description: "Every walker undergoes rigorous background checks and is rated by our community for your peace of mind.",
        },
        {
            icon: <MapPin className="w-8 h-8" />,
            title: "Live GPS Tracking",
            description: "Monitor your dog's walk in real-time with interactive maps and receive instant notifications.",
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Instant Booking",
            description: "Find and book the perfect walker in seconds with our smart matching algorithm.",
        },
        {
            icon: <Camera className="w-8 h-8" />,
            title: "Photo Updates",
            description: "Receive adorable photos and updates throughout your pet's walk to stay connected.",
        },
        {
            icon: <MessageSquare className="w-8 h-8" />,
            title: "Direct Messaging",
            description: "Communicate securely with your walker through our built-in chat system.",
        },
        {
            icon: <CalendarDays className="w-8 h-8" />,
            title: "Flexible Scheduling",
            description: "Book on-demand walks or set up recurring schedules that fit your lifestyle perfectly.",
        },
    ];

    const ownerSteps = [
        {
            number: "01",
            title: "Create Your Pet's Profile",
            description: "Add your furry friend's details, personality traits, and any special needs or preferences.",
            icon: <PawPrint className="w-6 h-6" />,
        },
        {
            number: "02",
            title: "Browse & Book Walkers",
            description: "Explore verified walkers in your area, read reviews, and choose the perfect match for your pet.",
            icon: <Users className="w-6 h-6" />,
        },
        {
            number: "03",
            title: "Track & Relax",
            description: "Watch your pet's adventure in real-time with GPS tracking and receive photo updates.",
            icon: <MapPin className="w-6 h-6" />,
        },
    ];

    const walkerSteps = [
        {
            number: "01",
            title: "Create Your Profile",
            description: "Showcase your experience, set your schedule, and highlight what makes you a great walker.",
            icon: <Star className="w-6 h-6" />,
        },
        {
            number: "02",
            title: "Receive Bookings",
            description: "Get notified about walk requests nearby and accept jobs that match your availability.",
            icon: <CalendarDays className="w-6 h-6" />,
        },
        {
            number: "03",
            title: "Walk & Earn",
            description: "Enjoy time with amazing pets, provide excellent service, and receive secure payments weekly.",
            icon: <CreditCard className="w-6 h-6" />,
        },
    ];

    const testimonials = [
        {
            quote: "Paw Walks has been a lifesaver! The real-time tracking gives me complete peace of mind while I'm at work. Max loves his walker!",
            author: "Sarah Johnson",
            role: "Dog Owner",
            rating: 5,
        },
        {
            quote: "As a professional walker, this platform has transformed my business. The scheduling system is seamless and clients are wonderful.",
            author: "Michael Chen",
            role: "Professional Walker",
            rating: 5,
        },
        {
            quote: "My rescue dog Luna was shy at first, but her walker has been so patient. The photo updates make my day every time!",
            author: "Emily Rodriguez",
            role: "Dog Owner",
            rating: 5,
        },
    ];

    const stats = [
        { value: "10,000+", label: "Happy Pets" },
        { value: "2,500+", label: "Trusted Walkers" },
        { value: "50,000+", label: "Walks Completed" },
        { value: "4.9/5", label: "Average Rating" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Navigation */}
            <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 animate-in fade-in slide-in-from-top duration-500">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-slate-500/20 group-hover:shadow-slate-500/40 transition-all duration-300 group-hover:scale-110">
                            🐾
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                            Paw Walks
                        </div>
                    </Link>

                    <div className="hidden md:flex gap-8 items-center">
                        <Link href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            How It Works
                        </Link>
                        <Link href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Testimonials
                        </Link>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/auth/login">
                            <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                                Login
                            </Button>
                        </Link>
                        <Link href="/auth/sign-up">
                            <Button className="bg-gradient-to-r from-slate-800 to-slate-600 hover:from-slate-900 hover:to-slate-700 text-white shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40 transition-all duration-300">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-6 py-20 md:py-32 overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-slate-400/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
                    </div>

                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-top duration-500 delay-150">
                                <Sparkles className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Trusted by 10,000+ Pet Parents</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                                The Ultimate Platform for
                                <br />
                                <span className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 bg-clip-text text-transparent animate-gradient">
                                    Dog Walking & Pet Care
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                                Connect with verified, professional dog walkers in your area. Enjoy real-time GPS tracking, instant photo updates, and seamless booking for complete peace of mind.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-in fade-in slide-in-from-bottom duration-700 delay-700">
                                <Link href="/auth/sign-up?type=client">
                                    <Button size="lg" className="bg-gradient-to-r from-slate-800 to-slate-600 hover:from-slate-900 hover:to-slate-700 text-white shadow-xl shadow-slate-500/25 hover:shadow-slate-500/40 transition-all duration-300 w-full sm:w-auto text-lg px-8 py-6 group">
                                        Find Your Walker
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/auth/sign-up?type=walker">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full sm:w-auto text-lg px-8 py-6 group transition-all duration-300"
                                    >
                                        Become a Walker
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-in fade-in slide-in-from-bottom duration-700 delay-1000">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-20 md:py-32 px-6 bg-slate-50 dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                                How Paw Walks Works
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Getting started is simple. Whether you're a pet owner or walker, we've made the process seamless.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-16">
                            {/* Pet Owner Journey */}
                            <div className="space-y-8">
                                <div className="text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700 mb-6">
                                        <Heart className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">For Pet Owners</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                        Find the Perfect Walker for Your Pet
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {ownerSteps.map((step, i) => (
                                        <div
                                            key={i}
                                            className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-500/25 group-hover:shadow-slate-500/40 transition-all duration-300">
                                                        {step.icon}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">STEP {step.number}</div>
                                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h4>
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pet Walker Journey */}
                            <div className="space-y-8">
                                <div className="text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700 mb-6">
                                        <Star className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">For Pet Walkers</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                        Turn Your Passion Into Income
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {walkerSteps.map((step, i) => (
                                        <div
                                            key={i}
                                            className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-500/25 group-hover:shadow-slate-500/40 transition-all duration-300">
                                                        {step.icon}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-1">STEP {step.number}</div>
                                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h4>
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 md:py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                                Everything You Need for Peace of Mind
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Our platform is packed with powerful features designed to make pet care safe, convenient, and enjoyable for everyone.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="group p-8 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center mb-6 shadow-lg shadow-slate-500/25 group-hover:shadow-slate-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Detail Section */}
                <section className="py-20 md:py-32 px-6 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                                Complete Pet Care Management
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                                From booking walks to managing profiles, our platform handles everything seamlessly while ensuring the highest standards of care and safety.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Pet Owners Card */}
                            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-3xl mb-6 shadow-lg">
                                    🏡
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Pet Owners</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Create detailed pet profiles with photos",
                                        "Browse verified walker profiles",
                                        "Real-time GPS walk tracking",
                                        "Secure in-app payments",
                                        "Review and rate walkers",
                                        "Schedule recurring walks",
                                        "Receive photo updates",
                                        "Direct messaging with walkers"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <CheckCircle2 className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Pet Walkers Card */}
                            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center text-3xl mb-6 shadow-lg">
                                    🚶
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Pet Walkers</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Build professional profiles",
                                        "Set your own rates and schedule",
                                        "Accept walk requests instantly",
                                        "Track earnings in real-time",
                                        "Automated weekly payouts",
                                        "GPS tracking for safety",
                                        "Share photo updates easily",
                                        "Build your client base"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <CheckCircle2 className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Platform Management Card */}
                            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 text-white flex items-center justify-center text-3xl mb-6 shadow-lg">
                                    ⚙️
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Platform Features</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Automated booking management",
                                        "Secure payment processing",
                                        "Background verification system",
                                        "Review and rating system",
                                        "Real-time notifications",
                                        "Advanced matching algorithm",
                                        "Comprehensive analytics",
                                        "24/7 customer support"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                                            <CheckCircle2 className="w-5 h-5 text-slate-600 dark:text-slate-400 flex-shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="py-20 md:py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                                Loved by Thousands
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Don't just take our word for it. Here's what our community has to say about their Paw Walks experience.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, i) => (
                                <div
                                    key={i}
                                    className="p-8 rounded-3xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-2xl transition-all duration-500 hover:scale-105"
                                >
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(testimonial.rating)].map((_, j) => (
                                            <Star key={j} className="w-5 h-5 fill-slate-400 text-slate-400" />
                                        ))}
                                    </div>
                                    <Quote className="w-10 h-10 text-slate-200 dark:text-slate-700 mb-4" />
                                    <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed text-lg">
                                        {testimonial.quote}
                                    </p>
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                                        <div className="font-bold text-slate-900 dark:text-white">{testimonial.author}</div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{testimonial.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 md:py-32 px-6 bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200/70 dark:bg-slate-800/50 rounded-full border border-slate-300 dark:border-slate-700 mb-8">
                            <Sparkles className="w-4 h-4 text-slate-700 dark:text-teal-400" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                Join Our Growing Community
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of happy pet owners and dedicated walkers. Your next great adventure is just one click away.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/auth/sign-up?type=client">
                                {/* --- ATTRACTIVE PRIMARY BUTTON --- */}
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-slate-500 to-slate-600 text-white font-semibold 
                               shadow-lg shadow-slate-500/30 
                               hover:shadow-xl hover:shadow-slate-500/40 hover:scale-105
                               transition-all duration-300 group
                               w-full sm:w-auto text-lg px-10 py-7"
                                >
                                    Get Started as Owner
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/auth/sign-up?type=walker">
                                {/* --- ATTRACTIVE SECONDARY BUTTON --- */}
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-slate-400 text-slate-700 font-semibold 
                               hover:bg-slate-900 hover:text-white hover:border-slate-900
                               dark:border-slate-600 dark:text-slate-300
                               dark:hover:bg-slate-200 dark:hover:text-slate-900 dark:hover:border-slate-200
                               hover:scale-105 transition-all duration-300 group
                               w-full sm:w-auto text-lg px-10 py-7"
                                >
                                    Become a Walker
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />

            <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-in-from-top {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slide-in-from-bottom {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .slide-in-from-top {
          animation: slide-in-from-top 0.5s ease-out;
        }

        .slide-in-from-bottom {
          animation: slide-in-from-bottom 0.5s ease-out;
        }

        .duration-300 {
          animation-duration: 300ms;
        }

        .duration-500 {
          animation-duration: 500ms;
        }

        .duration-700 {
          animation-duration: 700ms;
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-700 {
          animation-delay: 700ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }

        .bg-grid-black {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
        </div>
    )
}