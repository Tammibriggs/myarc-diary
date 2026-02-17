import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongodb';
import PendingUpload from '@/models/PendingUpload';
import { deleteMultipleFromS3 } from '@/lib/s3';

const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * POST /api/upload/cleanup-stale
 * 
 * Finds PendingUpload records older than 24 hours, deletes their S3 objects,
 * then removes the records. These are images that were uploaded but never
 * attached to a saved entry.
 * 
 * Can be called manually, via a cron job, or from a scheduled function.
 */
export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS);

        const stalePending = await PendingUpload.find({ createdAt: { $lt: cutoff } });

        if (stalePending.length === 0) {
            return NextResponse.json({ deleted: 0, message: 'No stale uploads found' });
        }

        const keys = stalePending.map((p: any) => p.key);

        // Delete from S3
        await deleteMultipleFromS3(keys);

        // Remove the records
        await PendingUpload.deleteMany({ _id: { $in: stalePending.map((p: any) => p._id) } });

        return NextResponse.json({
            deleted: keys.length,
            message: `Cleaned up ${keys.length} orphaned image(s)`,
        });
    } catch (error) {
        console.error('Stale cleanup error:', error);
        return NextResponse.json({ error: 'Failed to clean up stale uploads' }, { status: 500 });
    }
}
