import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

export async function uploadToS3(
    file: Buffer,
    key: string,
    contentType: string
): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
    });

    await s3Client.send(command);

    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function deleteMultipleFromS3(keys: string[]): Promise<void> {
    if (keys.length === 0) return;

    const command = new DeleteObjectsCommand({
        Bucket: BUCKET_NAME,
        Delete: {
            Objects: keys.map(Key => ({ Key })),
        },
    });
    await s3Client.send(command);
}

/**
 * Extract S3 keys from HTML content by matching image src URLs that point to our bucket.
 */
export function extractS3KeysFromHtml(html: string): string[] {
    const bucketUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
    const escaped = bucketUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escaped}([^"'\\s]+)`, 'g');
    const keys: string[] = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        keys.push(decodeURIComponent(match[1]));
    }
    return keys;
}
