import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, X, Book, Zap, ArrowUpRight, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ActivitySummaryProps {
    selectedDayIndex: number | null;
    setSelectedDayIndex: (index: number | null) => void;
    recentEntries: any[];
    setActiveView: (view: any) => void;
    setEntryToDelete: (entry: any) => void;
    isConcealed: boolean;
}

export function ActivitySummary({
    selectedDayIndex,
    setSelectedDayIndex,
    recentEntries,
    setActiveView,
    setEntryToDelete,
    isConcealed
}: ActivitySummaryProps) {
    const weeklyActivity = [40, 70, 30, 85, 50, 90, 60];

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* ... Weekly Streaks Code ... */}
            <motion.div
                layout
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className={cn(
                    "md:col-span-2 h-fit rounded-[32px] bg-white/60 border border-white/50 p-8 backdrop-blur-md transition-all hover:shadow-xl relative overflow-hidden",
                    selectedDayIndex !== null && "md:col-span-5 ring-2 ring-primary/20"
                )}
            >
                {/* ... (Existing Weekly Streaks content - no changes needed inside here) ... */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <span>Momentum</span>
                        {selectedDayIndex !== null && (
                            <span className="text-sm font-normal text-muted-foreground">/ {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][selectedDayIndex]}</span>
                        )}
                    </h3>
                    <div className="flex items-center gap-2">
                        {selectedDayIndex !== null && (
                            <Button variant="ghost" size="sm" onClick={() => setSelectedDayIndex(null)} className="h-8 w-8 rounded-full p-0">
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                </div>

                <div className="flex items-end justify-between h-32 px-2 mb-8">
                    {weeklyActivity.map((h, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedDayIndex(i)}
                            className="flex flex-col items-center gap-3 group h-full justify-end cursor-pointer"
                        >
                            <div className="relative w-4 bg-black/5 rounded-full h-full overflow-hidden">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className={cn(
                                        "absolute bottom-0 w-full rounded-full transition-all",
                                        selectedDayIndex === i ? "bg-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]" : "bg-primary/20 group-hover:bg-primary/40"
                                    )}
                                />
                            </div>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-tighter transition-colors",
                                selectedDayIndex === i ? "text-primary" : "text-muted-foreground/50"
                            )}>
                                {['m', 't', 'w', 't', 'f', 's', 's'][i]}
                            </span>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {selectedDayIndex !== null && (
                        <motion.div
                            key={selectedDayIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="pt-8 border-t border-black/5 space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { label: "Reflect", value: "85%", icon: Book, color: "text-primary", desc: "Consistency Habit" },
                                    { label: "Discover", value: "2", icon: Zap, color: "text-secondary", desc: "Insights Extracted" },
                                    { label: "Act", value: "100%", icon: ArrowUpRight, color: "text-purple-500", desc: "Arc Prompts Met" },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("p-2 rounded-lg bg-black/5", item.color)}>
                                                <item.icon className="w-4 h-4" />
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#171717]/40">{item.label}</p>
                                        </div>
                                        <p className="text-3xl font-black">{item.value}</p>
                                        <p className="text-[10px] font-medium text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                                <p className="text-sm text-[#171717]/80 leading-relaxed italic">
                                    &quot;On this day, your momentum peaked because you converted a reflection about &apos;Client Feedback&apos; into a long-term goal. High insight depth detected.&quot;
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Recent Entries */}
            {selectedDayIndex === null && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="md:col-span-3 space-y-6"
                >
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold">Recent Entries</h3>
                        <Button variant="link" onClick={() => setActiveView('entries')} className="text-primary font-bold">View all</Button>
                    </div>

                    <div className="space-y-4">
                        {recentEntries.slice(0, 2).map((entry) => (
                            <div
                                key={entry.id}
                                className={cn(
                                    "group relative rounded-[32px] bg-white border border-white/50 p-6 flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 overflow-hidden"
                                )}
                            >
                                <div className={cn("absolute inset-0 bg-linear-to-br opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none", entry.gradient)} />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-muted-foreground/60 tracking-widest uppercase">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-3 h-3" />
                                            <span>{entry.date} • {entry.time}</span>
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-black/20 group-hover:text-primary transition-all" />
                                    </div>

                                    <h4 className={cn("text-2xl font-bold mb-2 group-hover:text-primary transition-all", isConcealed && "blur-md select-none")}>{entry.title}</h4>
                                    <p className={cn("text-[#171717]/60 line-clamp-2 mb-4 text-sm leading-relaxed transition-all duration-500", isConcealed && "blur-lg select-none grayscale opacity-50")}>
                                        {entry.preview}
                                    </p>

                                    <div className="flex gap-2">
                                        {entry.tags.map((tag: any) => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 border border-black/5 text-[#171717] font-bold shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
