import express from 'express';
import {
  getAnnouncements,
  postAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { protect, operatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getAnnouncements)
  .post(protect, operatorOnly, postAnnouncement);

router.route('/:id')
  .delete(protect, operatorOnly, deleteAnnouncement);

export default router;
