// pages/about.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Users, Shield } from "lucide-react";
import Footer from "@/components/Footer";

export default function AboutPage() {
    const values = [
        { icon: <Heart className="w-8 h-8" />, title: "Passion for Pets", description: "Our love for animals is at the core of everything we do. We treat every pet like our own." },
        { icon: <Shield className="w-8 h-8" />, title: "Safety First", description: "We are committed to the highest safety standards, with verified walkers and GPS tracking." },
        { icon: <Users className="w-8 h-8" />, title: "Community Trust", description: "We're building a reliable community of pet lovers who support each other." },
    ];

    const team = [
        { name: "Alex Johnson", role: "Founder & CEO", image: "https://via.placeholder.com/150" },
        { name: "Samantha Blue", role: "Head of Operations", image: "https://via.placeholder.com/150" },
        { name: "Mike Chen", role: "Lead Developer", image: "https://via.placeholder.com/150" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* --- Navigation --- */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                            🐾
                        </div>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">Paw Walks</span>
                    </Link>
                    <nav className="hidden md:flex gap-8 items-center">
                        <Link href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
                        <Link href="/about" className="text-sm font-medium text-slate-900 dark:text-white transition-colors">About</Link>
                        <Link href="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
                    </nav>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Login</Button>
                        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-md transition-all">Get Started</Button>
                    </div>
                </div>
            </header>

            <main>
                {/* --- About Hero --- */}
                <section className="px-6 py-20 md:py-32 text-center bg-slate-100 dark:bg-slate-900">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white">We're on a mission to make pet care simple and safe.</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-6">Paw Walks was founded by pet lovers, for pet lovers. We believe that every pet deserves the best care, and every owner deserves peace of mind.</p>
                    </div>
                </section>

                {/* --- Our Values --- */}
                <section className="py-20 md:py-32 px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">Our Core Values</h2>
                        <div className="grid md:grid-cols-3 gap-10">
                            {values.map(value => (
                                <div key={value.title} className="text-center">
                                    <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center mb-6 shadow-lg">
                                        {value.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mt-2">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- Meet the Team --- */}
                <section className="py-20 md:py-32 px-6 bg-slate-100 dark:bg-slate-900">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">Meet the Team</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {team.map(member => (
                                <div key={member.name} className="text-center">
                                    <img src={member.image} alt={member.name} className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-white dark:border-slate-800 shadow-lg" />
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}