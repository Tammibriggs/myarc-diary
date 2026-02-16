import { motion } from 'framer-motion';
import { Zap, Plus, Search, Home, Book, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { ActivitySummary } from './ActivitySummary';

interface HomeViewProps {
    currentFocus: string;
    recentEntries: any[];
    setActiveView: (view: any) => void;
    setEntryToDelete: (entry: any) => void;
    isConcealed: boolean;
}

export function HomeView({
    currentFocus,
    recentEntries,
    setActiveView,
    setEntryToDelete,
    isConcealed
}: HomeViewProps) {
    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

    return (
        <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
        >
            {/* Hero Card: Today's Focus */}
            <div className="relative overflow-hidden rounded-[40px] bg-white border border-white/50 shadow-2xl shadow-black/5 p-8 md:p-12">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Zap className="w-64 h-64 text-primary" />
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Today&apos;s Focus</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-md leading-relaxed">
                        Your path to <span className="text-primary font-semibold underline decoration-primary/30 underline-offset-4">{currentFocus}</span> starts with a single reflection.
                    </p>

                    {/* Daily Arc Actions */}
                    <div className="space-y-3 mb-10">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#171717]/40 mb-2">The Daily Arc</p>
                        {[
                            "Send follow-up email to Sarah",
                            "Draft the MVP roadmap",
                        ].map((action, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className="group flex items-center w-full max-w-sm p-4 rounded-2xl bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all text-left"
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-primary/20 mr-4 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className={cn("font-semibold text-[#171717]/80 transition-all duration-300", isConcealed && "blur-sm select-none")}>{action}</span>
                            </motion.button>
                        ))}
                    </div>

                    <Link href="/entries/new">
                        <Button
                            size="lg"
                            className="h-16 px-10 rounded-full text-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-2xl shadow-secondary/20 transition-all hover:scale-105 active:scale-95 group font-bold"
                        >
                            <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" /> New Entry
                        </Button>
                    </Link>
                </div>
            </div>

            <ActivitySummary
                selectedDayIndex={selectedDayIndex}
                setSelectedDayIndex={setSelectedDayIndex}
                recentEntries={recentEntries}
                setActiveView={setActiveView}
                setEntryToDelete={setEntryToDelete}
                isConcealed={isConcealed}
            />
        </motion.div>
    );
}
