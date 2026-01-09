// pages/pricing.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

export default function PricingPage() {
    const tiers = [
        {
            name: "Basic",
            price: "$15",
            per: "/ walk",
            description: "For the occasional walk when you're in a pinch.",
            features: [
                "30-Minute Walk",
                "GPS Tracking",
                "Photo Updates",
                "Verified Walker"
            ],
            popular: false
        },
        {
            name: "Plus",
            price: "$250",
            per: "/ month",
            description: "Perfect for regular walks to keep your pup happy and healthy.",
            features: [
                "Everything in Basic",
                "12 Walks per Month",
                "Flexible Scheduling",
                "Direct Walker Messaging",
                "Priority Support"
            ],
            popular: true
        },
        {
            name: "Premium",
            price: "$450",
            per: "/ month",
            description: "The ultimate package for the busy pet parent.",
            features: [
                "Everything in Plus",
                "25 Walks per Month",
                "Recurring Appointments",
                "Dedicated Account Manager",
                "Free Pet Sitting Credits"
            ],
            popular: false
        }
    ];

    const faqs = [
        { q: "Can I try Paw Walks before committing?", a: "Absolutely! Your first walk is 50% off. It's a great way to meet a walker and see how our platform works." },
        { q: "What if I need to cancel a walk?", a: "You can cancel any walk up to 2 hours before the scheduled time for a full refund. We offer flexibility because we know plans change." },
        { q: "Are the walkers insured and background-checked?", a: "Yes. Every walker on our platform undergoes a rigorous background check and is fully insured for your peace of mind." },
        { q: "Can I request the same walker every time?", a: "Of course! If you and your pet love a specific walker, you can set up recurring walks directly with them through the app." }
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
                        <Link href="/pricing" className="text-sm font-medium text-slate-900 dark:text-white transition-colors">Pricing</Link>
                        <Link href="/about" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
                        <Link href="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
                    </nav>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Login</Button>
                        <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-md transition-all">Get Started</Button>
                    </div>
                </div>
            </header>

            <main>
                {/* --- Pricing Hero --- */}
                <section className="px-6 py-20 md:py-32 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white">Simple, Transparent Pricing</h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mt-5">Choose the perfect plan for you and your furry friend. No hidden fees, ever.</p>
                    </div>
                </section>

                {/* --- Pricing Tiers --- */}
                <section className="px-6 pb-20">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
                        {tiers.map((tier) => (
                            <div key={tier.name} className={`p-8 rounded-3xl border ${tier.popular ? 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 scale-105 shadow-2xl' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg'}`}>
                                {tier.popular && <div className="text-center mb-6"><span className="px-4 py-1 text-sm font-semibold text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-full">Most Popular</span></div>}
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{tier.name}</h2>
                                <p className="text-4xl font-bold text-slate-900 dark:text-white mt-4">{tier.price}<span className="text-lg font-medium text-slate-500 dark:text-slate-400">{tier.per}</span></p>
                                <p className="text-slate-600 dark:text-slate-400 mt-2">{tier.description}</p>
                                <Button className={`w-full mt-8 text-lg py-6 ${tier.popular ? 'bg-slate-900 hover:bg-slate-700 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900' : 'bg-slate-800 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 text-white dark:text-slate-900'}`}>Choose Plan</Button>
                                <ul className="space-y-4 mt-8">
                                    {tier.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <Check className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- FAQ Section --- */}
                <section className="py-20 md:py-32 px-6 bg-slate-100 dark:bg-slate-900">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {faqs.map(faq => (
                                <div key={faq.q} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{faq.q}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mt-2">{faq.a}</p>
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
