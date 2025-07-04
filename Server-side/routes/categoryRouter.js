import express from 'express';
import { listCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/list', listCategories);

export default router;
