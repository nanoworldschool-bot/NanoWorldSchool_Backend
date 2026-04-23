import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
