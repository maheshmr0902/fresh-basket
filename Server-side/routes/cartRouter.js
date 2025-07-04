import express from "express";
import { updateCart } from "../controllers/cartController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

// Sync/update cart
router.post("/update", authUser, updateCart);

// Get cart


// Clear cart


export default router;



