import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Nano World School' },
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  logoUrl: { type: String },
  faviconUrl: { type: String },
  seoDescription: { type: String },
  mapEmbedUrl: { type: String },
  announcementText: { type: String },
  announcementActive: { type: Boolean, default: false },
  facebookUrl: { type: String },
  instagramUrl: { type: String },
  twitterUrl: { type: String },
  youtubeUrl: { type: String },
  linkedinUrl: { type: String },
  updatedAt: { type: Date, default: Date.now }
});


const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
