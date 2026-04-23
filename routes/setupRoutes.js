import express from 'express';
import { createSuperAdmin } from '../controllers/setupController.js';

const router = express.Router();

router.post('/', createSuperAdmin);

export default router;
