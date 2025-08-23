import { Router } from 'express';
import { getAllOrders, getOrderDetails } from './admin.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { adminMiddleware } from '../../middleware/adminMiddleware';

const router = Router();

// Protect all routes in this file with auth and admin middleware
router.use(authMiddleware, adminMiddleware);

router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderDetails);
// We will use the existing PATCH /api/orders/:id/status for updating

export default router;