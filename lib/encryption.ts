import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_key_must_be_32_bytes_long_!'; // Fallback for dev only
const IV_LENGTH = 16; // AES block size

export function encrypt(text: string): string {
    if (!text) return text;

    // Create a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher
    // Key must be Buffer or string. 
    // If string, we can use a hash to ensure it is 32 bytes if needed, 
    // but better to just use a 32 char key in .env
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Return IV:EncryptedText
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
    if (!text) return text;

    // Check if text is in correct format (IV:Encrypted)
    const textParts = text.split(':');
    if (textParts.length < 2) return text; // Not encrypted or legacy format

    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');

    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}
