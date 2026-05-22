import express from 'express';
import { getPayments, payRent } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPayments);

router.route('/:id/pay')
  .put(protect, payRent);

export default router;
