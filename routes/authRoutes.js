import express from 'express';
import { loginUser, getMe } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/me', getMe); // For verifying token on frontend

export default router;
