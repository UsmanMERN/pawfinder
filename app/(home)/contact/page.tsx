// pages/contact.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { Footer } from "react-day-picker";

export default function ContactPage() {
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
                        <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
                        <Link href="/contact" className="text-sm font-medium text-slate-900 dark:text-white transition-colors">Contact</Link>
                    </nav>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Login</Button>
                        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-md transition-all">Get Started</Button>
                    </div>
                </div>
            </header>

            <main>
                {/* --- Contact Hero --- */}
                <section className="px-6 py-20 md:py-32 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white">Get in Touch</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-5">We're here to help. Whether you have a question about our services or need support, we're ready to answer.</p>
                    </div>
                </section>

                {/* --- Contact Form & Info --- */}
                <section className="px-6 pb-20 md:pb-32">
                    <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
                        {/* Info */}
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center"><Mail className="w-6 h-6 text-slate-700 dark:text-slate-300" /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Email Us</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Send us an email and we'll get back to you within 24 hours.</p>
                                    <a href="mailto:support@pawwalks.com" className="font-semibold text-slate-800 dark:text-white mt-2 inline-block">support@pawwalks.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center"><Phone className="w-6 h-6 text-slate-700 dark:text-slate-300" /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Call Us</h3>
                                    <p className="text-slate-600 dark:text-slate-400">Talk to our friendly team for immediate assistance.</p>
                                    <a href="tel:1234567890" className="font-semibold text-slate-800 dark:text-white mt-2 inline-block">(123) 456-7890</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center"><MapPin className="w-6 h-6 text-slate-700 dark:text-slate-300" /></div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Visit Us</h3>
                                    <p className="text-slate-600 dark:text-slate-400">123 Pawsome Ave, Petville, ST 54321</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="font-medium text-slate-800 dark:text-slate-200">Full Name</label>
                                    <Input id="name" type="text" placeholder="John Doe" className="mt-2" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="font-medium text-slate-800 dark:text-slate-200">Email Address</label>
                                    <Input id="email" type="email" placeholder="you@example.com" className="mt-2" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="font-medium text-slate-800 dark:text-slate-200">Message</label>
                                    <Textarea id="message" placeholder="How can we help you today?" className="mt-2" rows={5} />
                                </div>
                                <Button size="lg" className="w-full bg-slate-900 hover:bg-slate-700 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 text-lg py-6">Send Message</Button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
