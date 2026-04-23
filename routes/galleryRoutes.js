import express from 'express';
import { getGallery, addGalleryImage, deleteGalleryImage } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.post('/', protect, addGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

export default router;

