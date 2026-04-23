import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), uploadImage);

export default router;
