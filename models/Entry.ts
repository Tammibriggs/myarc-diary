import mongoose, { Schema, model, models } from 'mongoose';

const EntrySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    preview: { type: String },
    isEncrypted: { type: Boolean, default: false },
    tags: [{ type: String }],
    date: { type: Date, default: Date.now },
    sentiment: { type: String },
    aiAnalysis: { type: Schema.Types.Mixed }, // Store arbitrary AI metadata
    embedding: { type: [Number], select: false }, // Vector embedding for semantic search; excluded from default queries
}, { timestamps: true });

// Text index for full-text search (content is encrypted, so we index title, preview, and tags)
EntrySchema.index({ title: 'text', preview: 'text', tags: 'text' });

const Entry = models.Entry || model('Entry', EntrySchema);

export default Entry;
