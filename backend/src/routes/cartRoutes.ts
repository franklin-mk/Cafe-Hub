//routes/cartRoutes.ts
import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/CartController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addToCart);
router.delete('/remove/:productId', authenticate, removeFromCart);

export default router;