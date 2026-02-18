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
            <div className="relative overflow-hidden rounded-[40px] bg-white/80 dark:bg-zinc-900/50 border border-white/50 dark:border-white/5 shadow-2xl shadow-black/5 p-8 md:p-12 backdrop-blur-sm">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Zap className="w-64 h-64 text-primary" />
                </div>

                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Today&apos;s Focus</h2>
                    <p className="text-xl text-muted-foreground mb-8 max-w-md leading-relaxed">
                        Your path to <span className="text-primary font-semibold underline decoration-primary/30 underline-offset-4">{currentFocus}</span> starts with a single reflection.
                    </p>



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
