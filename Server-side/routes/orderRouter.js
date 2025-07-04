import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  placeOrderCod,
  getUserOrders,
  getAllOrders,
  createOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// POST /api/order/cod - Place order with COD
router.post("/cod", authUser, placeOrderCod);

// GET /api/order/user - Get orders for logged-in user
router.get("/user", authUser, getUserOrders);

// GET /api/order/all - Get all orders (admin/seller)
router.get("/all", getAllOrders);

// POST /api/order/create - Optional placeholder route
router.post("/create", authUser, createOrder);

export default router;



