'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function AuthPage() {
    const { colors } = useTheme();
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">

                {/* Brand / Emotional Side */}
                <div className="hidden md:flex flex-col space-y-6">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="MyArc Logo"
                            className="w-9 h-9 p-1.5 rounded-xl object-contain shadow-lg"
                            style={{ backgroundColor: colors.logoBg, boxShadow: `0 10px 15px -3px ${colors.primary}33` }}
                        />
                        <h1 className="text-2xl font-bold tracking-tight">MyArc</h1>
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        <span className="text-primary">Reflection</span> turns experience into <span className="text-secondary">momentum</span>.
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-md">
                        The AI-powered diary that helps you understand yourself better, remember what matters, and achieve your goals faster.
                    </p>
                </div>

                {/* Auth Form Card */}
                <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">{isLogin ? 'Welcome Back' : 'Begin Your Journey'}</CardTitle>
                        <CardDescription>
                            {isLogin ? 'Enter your credentials to continue.' : 'Create an account to start reflecting.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Input placeholder="Full Name" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <Input type="email" placeholder="Email" />
                            </div>
                            <div className="space-y-2">
                                <Input type="password" placeholder="Password" />
                            </div>
                            <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold transition-all duration-300">
                                {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

                        <div className="mt-4 flex items-center justify-center space-x-2">
                            <div className="h-[1px] w-full bg-border" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">Or continue with</span>
                            <div className="h-[1px] w-full bg-border" />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full">Google</Button>
                            <Button variant="outline" className="w-full">Github</Button>
                        </div>

                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
                        >
                            {isLogin ? "Don&apos;t have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
