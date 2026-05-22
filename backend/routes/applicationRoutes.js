import express from 'express';
import {
  getApplications,
  submitApplication,
  reviewApplication,
} from '../controllers/applicationController.js';
import { protect, operatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getApplications)
  .post(protect, submitApplication);

router.route('/:id/review')
  .put(protect, operatorOnly, reviewApplication);

export default router;
