'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    ImageIcon,
    Smile,
    Undo,
    Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!editor) {
        return null;
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    editor.chain().focus().setImage({ src: result }).run();
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addImage = () => {
        fileInputRef.current?.click();
    };

    const onEmojiClick = (emojiData: any) => {
        editor.chain().focus().insertContent(emojiData.emoji).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 mb-4 p-2 bg-black/5 rounded-2xl border border-black/5">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn("w-10 h-10 rounded-xl", editor.isActive('bold') && 'bg-primary/20 text-primary')}
            >
                <Bold className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn("w-10 h-10 rounded-xl", editor.isActive('italic') && 'bg-primary/20 text-primary')}
            >
                <Italic className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-black/10 mx-1" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("w-10 h-10 rounded-xl", editor.isActive('bulletList') && 'bg-primary/20 text-primary')}
            >
                <List className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("w-10 h-10 rounded-xl", editor.isActive('orderedList') && 'bg-primary/20 text-primary')}
            >
                <ListOrdered className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-black/10 mx-1" />
            <Button
                variant="ghost"
                size="sm"
                onClick={addImage}
                className="w-10 h-10 rounded-xl"
            >
                <ImageIcon className="w-4 h-4" />
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            <div className="relative">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={cn("w-10 h-10 rounded-xl", showEmojiPicker && 'bg-primary/20 text-primary')}
                >
                    <Smile className="w-4 h-4" />
                </Button>
                {showEmojiPicker && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:mt-2">
                        <div className="fixed inset-0 bg-black/20 sm:bg-transparent" onClick={() => setShowEmojiPicker(false)} />
                        <div className="relative z-50">
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={350}
                                height={400}
                                style={{ maxWidth: '90vw' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="w-px h-6 bg-black/10 mx-1" />
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="w-10 h-10 rounded-xl"
            >
                <Undo className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="w-10 h-10 rounded-xl"
            >
                <Redo className="w-4 h-4" />
            </Button>
        </div>
    );
};

export const TiptapEditor = ({ content, onChange, placeholder }: TiptapEditorProps) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Placeholder.configure({
                placeholder: placeholder || 'Write something...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none h-full flex-1 font-serif leading-relaxed',
            },
        },
    });

    return (
        <div className="w-full h-full flex flex-col flex-1">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="flex-1 overflow-y-auto flex flex-col" />
        </div>
    );
};
