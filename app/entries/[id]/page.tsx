'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { TiptapEditor } from '@/components/editor/TiptapEditor';

export default function EntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [entryDate, setEntryDate] = useState('');
    const router = useRouter();

    // Fetch entry on mount
    useEffect(() => {
        const fetchEntry = async () => {
            try {
                const { data } = await axios.get(`/api/entries/${id}`);
                setTitle(data.title);
                setContent(data.content);
                setTags(data.tags || []);
                setEntryDate(
                    new Date(data.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })
                );
            } catch (err) {
                setError('Failed to load entry');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEntry();
    }, [id]);

    const addTag = (value: string) => {
        const tag = value.trim();
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput);
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError('Please add a title');
            return;
        }
        if (!content.trim() || content === '<p></p>') {
            setError('Please write some content');
            return;
        }

        setError('');
        setIsSaving(true);
        try {
            await axios.put(`/api/entries/${id}`, {
                title: title.trim(),
                content,
                tags,
            });
            router.push('/?view=entries');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to save entry');
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Background Ambience */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 w-full z-40 bg-white/50 dark:bg-black/50 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-muted"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">{entryDate}</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Entry'}</span>
                        <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
                    </Button>
                </div>
            </header>

            {/* Editor Content */}
            <main className="pt-16 pb-0 px-0 md:pt-28 md:px-6 max-w-3xl mx-auto overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl md:rounded-[40px] md:shadow-2xl md:shadow-black/5 md:border md:border-white/50 dark:md:border-white/5 p-6 md:p-12 min-h-[calc(100vh-4rem)] md:min-h-[80vh] flex flex-col"
                >
                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-4xl md:text-5xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/40 mb-4 h-fit overflow-hidden text-foreground"
                        placeholder="Title your reflection..."
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />

                    {/* Tags chip input */}
                    <div className="flex flex-wrap items-center gap-2 mb-6 px-1">
                        {tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20 group"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            onBlur={() => {
                                if (tagInput.trim()) addTag(tagInput);
                            }}
                            placeholder={tags.length === 0 ? "Add tags (press Enter)" : "Add more..."}
                            className="text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/60 min-w-[120px] flex-1 py-1.5 text-foreground"
                        />
                    </div>

                    <TiptapEditor
                        content={content}
                        onChange={setContent}
                        placeholder="What's moving you today? Start typing..."
                    />
                </motion.div>
            </main>
        </div>
    );
}
