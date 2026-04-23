import express from 'express';
import { getUsers, deleteUser, inviteUser, acceptInvitation } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.post('/invite', protect, adminOnly, inviteUser);
router.post('/accept-invitation', acceptInvitation);
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;

