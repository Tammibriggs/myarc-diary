import mongoose from 'mongoose';

const PendingUploadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    key: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// TTL index: auto-delete records older than 24 hours as a safety net
// PendingUploadSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.models.PendingUpload || mongoose.model('PendingUpload', PendingUploadSchema);
