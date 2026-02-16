import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, ArrowUpRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

interface EntriesViewProps {
    currentFocus?: string;
    allTags: string[];
    selectedTag: string;
    setSelectedTag: (tag: string) => void;
    filteredEntries: any[];
    setEntryToDelete: (entry: any) => void;
    isConcealed: boolean;
    onToggleConcealed: () => void;
}

export function EntriesView({
    allTags,
    selectedTag,
    setSelectedTag,
    filteredEntries,
    setEntryToDelete,
    isConcealed,
    onToggleConcealed
}: EntriesViewProps) {
    // Local state removed in favor of lifted state

    return (
        <motion.div
            key="entries"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                    <h2 className="text-4xl font-extrabold tracking-tight">Your Arc</h2>
                    <p className="text-muted-foreground text-sm font-medium">124 Total Reflections</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onToggleConcealed}
                        className="rounded-full w-12 h-12 border-2 hover:bg-slate-100"
                        title={isConcealed ? "Reveal Content" : "Conceal Content"}
                    >
                        {isConcealed ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </Button>

                    <Link href="/entries/new">
                        <Button size="lg" className="rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 group font-bold">
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            New Reflection
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input className="pl-14 h-16 rounded-[24px] bg-white border-white/50 shadow-xl shadow-black/5 text-xl placeholder:text-black/10 transition-all focus:ring-primary/20" placeholder="Search your history..." />
            </div>

            <div className="flex flex-wrap gap-2 px-2">
                {allTags.map(tag => (
                    <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={cn(
                            "px-5 py-2 rounded-full text-xs font-bold transition-all border",
                            selectedTag === tag
                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                : "bg-white/50 border-black/5 text-muted-foreground hover:bg-white hover:border-black/10"
                        )}
                    >
                        {tag}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredEntries.map((entry, i) => (
                        <motion.div
                            key={`${entry.id}-${i}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="group p-8 rounded-[40px] bg-white border border-white/50 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className={cn("absolute inset-0 bg-linear-to-br opacity-5 group-hover:opacity-20 transition-opacity", entry.gradient)} />
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h3 className={cn("text-2xl font-bold transition-all duration-300", isConcealed && "blur-md select-none")}>
                                        {entry.title}
                                    </h3>
                                    <span className="text-xs font-bold text-muted-foreground/50 tracking-widest">{entry.date}</span>
                                </div>
                                <div className="relative z-10">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="w-10 h-10 rounded-full text-muted-foreground/40 md:text-muted-foreground/30 hover:bg-red-50 hover:text-red-600 transition-all md:opacity-0 md:group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEntryToDelete(entry);
                                        }}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                    {entry.isEncrypted && (
                                        <div className="absolute top-10 right-2 text-[10px] text-emerald-500 font-bold flex items-center gap-1 opacity-50">
                                            <ShieldCheck className="w-3 h-3" /> Encrypted
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className={cn(
                                "text-muted-foreground line-clamp-3 leading-relaxed mb-6 font-serif italic text-lg transition-all duration-500",
                                isConcealed && "blur-lg select-none grayscale opacity-50"
                            )}>
                                &quot;{entry.preview}&quot;
                            </p>
                            <div className="flex gap-2">
                                {entry.tags.map((tag: any) => (
                                    <span key={tag} className="text-[10px] font-bold uppercase py-1 px-3 border border-black/5 bg-black/5 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
