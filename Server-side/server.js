// server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

// Routes
import categoryRouter from './routes/categoryRouter.js';
import sellerRouter from './routes/sellerRoutes.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import addressRouter from './routes/addressRouter.js';
import orderRouter from './routes/orderRouter.js';
import newsletterRouter from './routes/newsletterRouter.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// ✅ Middlewares
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use('/api/category', categoryRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/newsletter', newsletterRouter);

// ✅ Health Check
app.get('/', (req, res) => res.send('✅ Fresh Basket API is running...'));

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});




  


