import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify Cloudinary connection
if (process.env.CLOUDINARY_CLOUD_NAME) {
  console.log(`☁️  Cloudinary Configured: ${process.env.CLOUDINARY_CLOUD_NAME}`);
} else {
  console.warn('⚠️  Cloudinary Cloud Name missing in .env');
}


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'nano-world-school',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

export { cloudinary, storage };
