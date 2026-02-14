import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, ArrowUpRight, Plus, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ShortsViewProps {
    expandedShort: 'realizations' | 'goals' | null;
    setExpandedShort: (view: 'realizations' | 'goals' | null) => void;
}

export function ShortsView({ expandedShort, setExpandedShort }: ShortsViewProps) {
    return (
        <motion.div
            key="shorts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-30 pt-16 h-full flex flex-col-reverse md:flex-row overflow-hidden bg-background"
        >
            {/* Left Side: Realizations */}
            <div
                className={cn(
                    "overflow-y-auto relative group bg-linear-to-br from-primary/5 to-transparent border-r border-black/5 p-8 md:p-12 transition-all duration-500 ease-in-out",
                    expandedShort === 'realizations' ? "flex-10 h-full" : expandedShort === 'goals' ? "flex-0 h-0 p-0 overflow-hidden" : "flex-1 h-full"
                )}
            >
                <div className="max-w-xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary">Realizations</h2>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setExpandedShort(expandedShort === 'realizations' ? null : 'realizations')}
                                className="rounded-full opacity-50 hover:opacity-100 transition-opacity md:hidden"
                            >
                                {expandedShort === 'realizations' ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full opacity-20 group-hover:opacity-100 transition-opacity hidden md:flex">
                                <ArrowUpRight className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {[
                            "Energy flows where attention goes—my mornings are my power source.",
                            "Distraction isn't a lack of focus, it's a lack of priority.",
                            "Deep work is easier when the outcome is visceral, not intellectual."
                        ].map((realization, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative"
                            >
                                <div className="absolute -left-6 top-1 text-primary/20 text-6xl font-serif italic pointer-events-none">&quot;</div>
                                <p className="text-2xl md:text-3xl font-medium leading-tight text-[#171717]/80 hover:text-primary transition-colors cursor-help">
                                    {realization}
                                </p>
                                <div className="mt-4 flex items-center text-xs font-bold text-primary/40 uppercase tracking-widest">
                                    <span>Detected 2h ago</span>
                                    <span className="mx-2">•</span>
                                    <button className="hover:underline">View Context</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Goals */}
            <div
                className={cn(
                    "overflow-y-auto relative group bg-linear-to-br from-secondary/5 to-transparent p-8 md:p-12 transition-all duration-500 ease-in-out",
                    expandedShort === 'goals' ? "flex-10 h-full" : expandedShort === 'realizations' ? "flex-0 h-0 p-0 overflow-hidden" : "flex-1 h-full"
                )}
            >
                <div className="max-w-xl mx-auto space-y-10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondary">Active Goals</h2>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setExpandedShort(expandedShort === 'goals' ? null : 'goals')}
                                className="rounded-full opacity-50 hover:opacity-100 transition-opacity md:hidden"
                            >
                                {expandedShort === 'goals' ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full opacity-20 group-hover:opacity-100 transition-opacity hidden md:flex">
                                <Plus className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { title: "Launch MyArc MVP", progress: 75, status: "On Track" },
                            { title: "Improve Deep Work Hours", progress: 40, status: "Focusing" },
                            { title: "Learn Next.js 15 Internals", progress: 20, status: "Starting" },
                        ].map((goal, i) => (
                            <motion.div
                                key={i}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-[32px] bg-white border border-secondary/20 shadow-xl shadow-secondary/5 group/goal"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl md:text-2xl font-bold">{goal.title}</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                                        {goal.status}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                                        <span>Progress</span>
                                        <span>{goal.progress}%</span>
                                    </div>
                                    <div className="h-3 bg-secondary/10 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${goal.progress}%` }}
                                            className="h-full bg-secondary shadow-[0_0_15px_rgba(132,204,22,0.3)]"
                                        />
                                    </div>
                                </div>

                                <button className="mt-6 flex items-center text-xs font-bold text-secondary group-hover/goal:translate-x-1 transition-transform">
                                    View Milestones <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
