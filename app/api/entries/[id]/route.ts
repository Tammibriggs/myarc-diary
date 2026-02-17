import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import Entry from '@/models/Entry';
import User from '@/models/User';
import Short from '@/models/Short';
import { decrypt } from '@/lib/encryption';
import { extractS3KeysFromHtml, deleteMultipleFromS3 } from '@/lib/s3';
import { embedText } from '@/lib/gemini';
import PendingUpload from '@/models/PendingUpload';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    try {
        const entry = await Entry.findOne({ _id: id, userId: user._id });
        if (!entry) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        const obj = entry.toObject();
        obj.content = decrypt(obj.content);

        return NextResponse.json(obj);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
    }
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, content, tags } = body;

    if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    try {
        const entry = await Entry.findOne({ _id: id, userId: user._id });
        if (!entry) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        // Clean up S3 images that were removed from the content
        try {
            const oldContent = decrypt(entry.content);
            const oldKeys = extractS3KeysFromHtml(oldContent);
            const newKeys = extractS3KeysFromHtml(content);
            const removedKeys = oldKeys.filter(k => !newKeys.includes(k));
            if (removedKeys.length > 0) {
                await deleteMultipleFromS3(removedKeys);
            }
        } catch (s3Error) {
            console.error('Failed to clean up S3 images:', s3Error);
        }

        const { encrypt } = await import('@/lib/encryption');

        entry.title = title;
        entry.content = encrypt(content);
        entry.preview = stripHtml(content).slice(0, 200);
        entry.tags = tags || [];

        // Regenerate embedding for semantic search
        try {
            const plainText = `${title}. ${stripHtml(content)}`;
            const embedding = await embedText(plainText);
            if (embedding) {
                entry.embedding = embedding;
            }
        } catch (embError) {
            console.error('Failed to regenerate embedding:', embError);
        }

        await entry.save();

        const responseEntry = entry.toObject();
        responseEntry.content = content;

        return NextResponse.json(responseEntry);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
    } finally {
        // Clean up orphaned images: delete S3 objects for uploads not in the saved content
        try {
            const pendingUploads = await PendingUpload.find({ userId: user._id });
            if (pendingUploads.length > 0) {
                const savedKeys = extractS3KeysFromHtml(content);
                const orphanedKeys = pendingUploads
                    .map((p: any) => p.key)
                    .filter((key: string) => !savedKeys.includes(key));

                if (orphanedKeys.length > 0) {
                    await deleteMultipleFromS3(orphanedKeys);
                }

                await PendingUpload.deleteMany({ userId: user._id });
            }
        } catch (e) {
            // Non-critical
        }
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    try {
        const entry = await Entry.findOneAndDelete({
            _id: id,
            userId: user._id,
        });

        if (!entry) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        // Clean up S3 images from the entry content
        try {
            const decryptedContent = decrypt(entry.content);
            const s3Keys = extractS3KeysFromHtml(decryptedContent);
            if (s3Keys.length > 0) {
                await deleteMultipleFromS3(s3Keys);
            }
        } catch (s3Error) {
            console.error('Failed to delete S3 images:', s3Error);
            // Don't fail the request if S3 cleanup fails
        }

        return NextResponse.json({ message: 'Entry deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}
