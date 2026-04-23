import express from 'express';
import { getPageContent, updatePageContent } from '../controllers/contentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:page', getPageContent);
router.put('/:page', protect, updatePageContent);

export default router;

