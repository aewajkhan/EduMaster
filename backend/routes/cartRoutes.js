import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { verifyToken } from './../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', verifyToken, addToCart);
router.get('/', verifyToken, getCart);
router.delete('/:courseId', verifyToken, removeFromCart);

export default router;
