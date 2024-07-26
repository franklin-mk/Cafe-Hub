//src/routes/productsRoutes.ts
import { Router } from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../controllers/ProductController';
import { authenticate, isAdmin } from '../middlewares/auth';
import upload from '../middlewares/upload';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticate, isAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticate, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticate, isAdmin, deleteProduct);

export default router;