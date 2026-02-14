'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronLeft, Save, Tag, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { TiptapEditor } from '@/components/editor/TiptapEditor';

export default function NewEntryPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F3F4F6] text-[#171717] font-sans selection:bg-primary/20">
            {/* Background Ambience */}
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="fixed top-0 w-full z-40 bg-white/50 backdrop-blur-md px-6 h-16 flex items-center justify-between border-b border-black/5">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full hover:bg-black/5"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground">October 26, 2024</span>
                        <span className="text-[10px] text-muted-foreground/50">Autosaved at 08:24 AM</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="ghost" className="rounded-full space-x-2">
                        <Tag className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Tags</span>
                    </Button>
                    <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                        <Save className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Save Entry</span>
                        <span className="sm:hidden">Save</span>
                    </Button>
                </div>
            </header>

            {/* Editor Content */}
            <main className="pt-16 pb-0 px-0 md:pt-28 md:px-6 max-w-3xl mx-auto overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-xl md:rounded-[40px] md:shadow-2xl md:shadow-black/5 md:border md:border-white/50 p-6 md:p-12 min-h-[calc(100vh-4rem)] md:min-h-[80vh] flex flex-col"
                >


                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-4xl md:text-5xl font-bold bg-transparent border-none outline-none resize-none placeholder:text-black/10 mb-6 h-fit overflow-hidden"
                        placeholder="Title your reflection..."
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />

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
