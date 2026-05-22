import express from 'express';
import {
  getStalls,
  addStall,
  deleteStall,
} from '../controllers/stallController.js';
import { protect, operatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getStalls)
  .post(protect, operatorOnly, addStall);

router.route('/:id')
  .delete(protect, operatorOnly, deleteStall);

export default router;
