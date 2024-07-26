//src/routes/orderRoutes.ts
import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus, getAdminOrders } from '../controllers/OrderController';
import { authenticate, isAdmin } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/', authenticate, getOrders);
router.get('/admin', authenticate, isAdmin, getAdminOrders);
router.put('/:id/status', authenticate, isAdmin, updateOrderStatus);

export default router;