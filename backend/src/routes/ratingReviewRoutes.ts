//src/routes/ratingReviewRoutes.ts
import { Router } from 'express';
import { createRatingReview, getRatingReviews } from '../controllers/RatingReviewController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/', authenticate, createRatingReview);
router.get('/:productId', getRatingReviews);

export default router;