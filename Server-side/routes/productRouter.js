import express from 'express';
import { addProduct, productList, productById, changeStock } from '../controllers/productController.js';
import { upload } from "../configs/multer.js";
import authSeller from '../middlewares/authSeller.js';

const router = express.Router();

// POST /api/product/add (seller only)
router.post('/add', authSeller, upload.array('images'), addProduct);

// GET /api/product/list
router.get('/list', productList);

// GET /api/product/:id
router.get('/:id', productById);

// PATCH /api/product/stock/:id (seller only)
router.patch('/stock/:id', authSeller, changeStock);

export default router;





