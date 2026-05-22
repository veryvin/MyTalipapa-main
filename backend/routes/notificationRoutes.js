import express from 'express';
import {
  getNotifications,
  markAllRead,
  markSingleRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications);

router.route('/read')
  .put(protect, markAllRead);

router.route('/:id/read')
  .put(protect, markSingleRead);

export default router;
