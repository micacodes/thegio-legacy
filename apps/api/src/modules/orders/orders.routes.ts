// path: apps/api/src/modules/orders/orders.routes.ts
import { Router } from 'express';
import { 
    createOrderCheckoutSession,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    approveOrderForPrint,
    createDraftOrder,
} from './orders.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { adminMiddleware } from '../../middleware/adminMiddleware';

const router = Router();

// --- Customer Routes ---
router.post('/draft', authMiddleware, createDraftOrder);
router.post('/create-checkout-session', authMiddleware, createOrderCheckoutSession);
router.get('/', authMiddleware, getUserOrders); // Get all my orders
router.get('/:id', authMiddleware, getOrderById); // Get a specific order
router.post('/:id/approve', authMiddleware, approveOrderForPrint); // Approve a design for printing

// --- Admin/Designer Route ---
// Note: 'adminMiddleware' runs after 'authMiddleware'
router.patch('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;