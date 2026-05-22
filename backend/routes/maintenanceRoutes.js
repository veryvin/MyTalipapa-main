import express from 'express';
import {
  getMaintenance,
  submitMaintenance,
  resolveMaintenance,
} from '../controllers/maintenanceController.js';
import { protect, operatorOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getMaintenance)
  .post(protect, submitMaintenance);

router.route('/:id/resolve')
  .put(protect, operatorOnly, resolveMaintenance);

export default router;
