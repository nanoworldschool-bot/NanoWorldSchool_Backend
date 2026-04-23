import express from 'express';
import { getUsers, deleteUser, inviteUser, loginUser, getMe } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.get('/', protect, adminOnly, getUsers);
router.post('/invite', protect, adminOnly, inviteUser);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;

