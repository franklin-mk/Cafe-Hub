//routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
import orderRoutes from './orderRoutes';
import cartRoutes from './cartRoutes';
import ratingReviewRoutes from './ratingReviewRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/ratings-reviews', ratingReviewRoutes);

export default router;