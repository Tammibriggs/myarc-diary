import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { uploadToS3 } from '@/lib/s3';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import PendingUpload from '@/models/PendingUpload';
import crypto from 'crypto';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
                { status: 400 }
            );
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 3MB.' },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = file.name.split('.').pop() || 'jpg';
        const key = `entries/images/${crypto.randomUUID()}.${ext}`;

        const url = await uploadToS3(buffer, key, file.type);

        // Track this upload so we can clean it up if the entry is never saved
        await dbConnect();
        const user = await User.findOne({ email: session.user.email });
        if (user) {
            await PendingUpload.create({ userId: user._id, key });
        }

        return NextResponse.json({ url, key });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
