import express from 'express';
import { getGallery, addGalleryImage, deleteGalleryImage, getSystemAssets } from '../controllers/galleryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGallery);
router.get('/assets', protect, getSystemAssets);
router.post('/', protect, addGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

export default router;

