'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function LandingPage() {
    const { colors } = useTheme();
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="MyArc Logo"
                            className="w-9 h-9 p-1.5 rounded-xl object-contain shadow-lg"
                            style={{ backgroundColor: colors.logoBg, boxShadow: `0 10px 15px -3px ${colors.primary}33` }}
                        />
                        <span className="font-bold text-xl tracking-tight">MyArc</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
                        <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
                        <Link href="/auth" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
                        <Link href="/auth">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

                <div className="container mx-auto text-center max-w-4xl">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-6">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Your AI Reflection Companion
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Turn your thoughts into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">momentum</span>.
                    </h1>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        MyArc doesn&apos;t just store your memories—it understands them. Transform unstructured journaling into clear goals, actionable insights, and personal growth.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                                Start Reflecting Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                            See How It Works
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-muted/30">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-background border-border hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Brain className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Memory Engine</CardTitle>
                                <CardDescription>
                                    MyArc remembers every entry. It connects the dots between your past and present to reveal hidden patterns.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="bg-background border-border hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-secondary" />
                                </div>
                                <CardTitle>Smart Shorts</CardTitle>
                                <CardDescription>
                                    Automatically extracts high-impact goals and obstacles from your writing, linking them back to the source.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card className="bg-background border-border hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                                    <Sparkles className="w-6 h-6 text-purple-500" />
                                </div>
                                <CardTitle>AI Companion</CardTitle>
                                <CardDescription>
                                    Chat with an AI that knows your context. Receive personalized prompts that push you forward, not just generic advice.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-6">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-muted-foreground">Invest in your personal growth engine.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Free Tier */}
                        <Card className="relative overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-xl">Free</CardTitle>
                                <div className="text-3xl font-bold mt-2">$0 <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                                <CardDescription>Essential reflection tools.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {['Daily Journaling', 'Basic Shorts Extraction', '1 Active Goal', '7-Day Memory History'].map((feat) => (
                                    <div key={feat} className="flex items-center text-sm">
                                        <Check className="w-4 h-4 mr-2 text-muted-foreground" /> {feat}
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Get Started</Button>
                            </CardFooter>
                        </Card>

                        {/* Pro Tier (Highlighted) */}
                        <Card className="relative overflow-hidden border-primary shadow-2xl scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                                MOST POPULAR
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl text-primary">Pro</CardTitle>
                                <div className="text-3xl font-bold mt-2">$12 <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                                <CardDescription>For serious growth seekers.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {['Unlimited Memory History', 'Advanced Shorts & Insights', 'Unlimited Goals & Milestones', 'Weekly Momentum Reports', 'AI Companion Mode'].map((feat) => (
                                    <div key={feat} className="flex items-center text-sm font-medium">
                                        <Check className="w-4 h-4 mr-2 text-secondary" /> {feat}
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">Start Free Trial</Button>
                            </CardFooter>
                        </Card>

                        {/* Team Tier */}
                        <Card className="relative overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-xl">Team</CardTitle>
                                <div className="text-3xl font-bold mt-2">$49 <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                                <CardDescription>For coaching and accountability groups.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {['Everything in Pro', 'Collaborative Goals', 'Group Insights', 'Admin Dashboard', 'Priority Support'].map((feat) => (
                                    <div key={feat} className="flex items-center text-sm">
                                        <Check className="w-4 h-4 mr-2 text-muted-foreground" /> {feat}
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Contact Sales</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 border-t border-border mt-20">
                <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
                    <p>&copy; 2024 MyArc. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
