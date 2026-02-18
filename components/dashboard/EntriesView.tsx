import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface EntriesViewProps {
    currentFocus?: string;
    allTags: string[];
    selectedTag: string;
    setSelectedTag: (tag: string) => void;
    filteredEntries: any[];
    setEntryToDelete: (entry: any) => void;
    isConcealed: boolean;
    onToggleConcealed: () => void;
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    totalCount: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const GRADIENT_POOL = [
    'from-purple-500/10 to-blue-500/10',
    'from-green-500/10 to-emerald-500/10',
    'from-orange-500/10 to-red-500/10',
    'from-pink-500/10 to-rose-500/10',
    'from-cyan-500/10 to-teal-500/10',
    'from-indigo-500/10 to-violet-500/10',
];

function getGradient(index: number) {
    return GRADIENT_POOL[index % GRADIENT_POOL.length];
}

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function EntriesView({
    allTags,
    selectedTag,
    setSelectedTag,
    filteredEntries,
    setEntryToDelete,
    isConcealed,
    onToggleConcealed,
    isLoading,
    hasMore,
    onLoadMore,
    totalCount,
    searchQuery,
    onSearchChange,
}: EntriesViewProps) {
    const router = useRouter();
    const [localSearch, setLocalSearch] = useState(searchQuery);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localSearch);
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch]); // eslint-disable-line react-hooks/exhaustive-deps

    // Infinite scroll sentinel
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, isLoading, onLoadMore]);

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
                    <p className="text-muted-foreground text-sm font-medium">
                        {totalCount} Total Reflection{totalCount !== 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onToggleConcealed}
                        className="rounded-full w-12 h-12 border-2 hover:bg-muted"
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
                <Input
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="pl-14 h-16 rounded-[24px] bg-white/80 dark:bg-white/5 border-white/50 dark:border-white/10 shadow-xl shadow-black/5 text-xl placeholder:text-muted-foreground transition-all focus:ring-primary/20 backdrop-blur-md"
                    placeholder="Search your history..."
                />
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
                                : "bg-white/50 dark:bg-white/5 border-black/5 dark:border-white/10 text-muted-foreground hover:bg-white dark:hover:bg-white/10 hover:border-black/10"
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
                            key={entry._id || `entry-${i}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => router.push(`/entries/${entry._id}`)}
                            className="group p-8 rounded-[40px] bg-white/80 dark:bg-zinc-900/50 border border-white/50 dark:border-white/5 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden backdrop-blur-sm"
                        >
                            <div className={cn("absolute inset-0 bg-linear-to-br opacity-5 group-hover:opacity-20 transition-opacity", getGradient(i))} />
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <h3 className={cn("text-2xl font-bold transition-all duration-300", isConcealed && "blur-md select-none")}>
                                        {entry.title}
                                    </h3>
                                    <span className="text-xs font-bold text-muted-foreground/50 tracking-widest">
                                        {formatDate(entry.date)}
                                    </span>
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
                                &quot;{entry.preview || 'No preview available'}&quot;
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {entry.tags?.map((tag: string) => (
                                    <span key={tag} className="text-[10px] font-bold uppercase py-1 px-3 border border-black/5 bg-black/5 rounded-full">{tag}</span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Loading spinner */}
            {isLoading && (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                </div>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && !isLoading && (
                <div ref={sentinelRef} className="h-10" />
            )}

            {/* End of list message */}
            {!hasMore && filteredEntries.length > 0 && (
                <p className="text-center text-sm text-muted-foreground/50 py-6 font-medium">
                    You&apos;ve reached the end of your reflections
                </p>
            )}

            {/* Empty state */}
            {!isLoading && filteredEntries.length === 0 && (
                <div className="text-center py-20 space-y-4">
                    <p className="text-2xl font-bold text-muted-foreground/30">No reflections yet</p>
                    <p className="text-muted-foreground/50">Start your journey by creating your first reflection</p>
                    <Link href="/entries/new">
                        <Button size="lg" className="rounded-full shadow-lg mt-4">
                            <Plus className="w-5 h-5 mr-2" />
                            New Reflection
                        </Button>
                    </Link>
                </div>
            )}
        </motion.div>
    );
}
