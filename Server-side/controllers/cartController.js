// controllers/cartController.js

import User from "../models/User.js";
import mongoose from "mongoose";

// Utility to check valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems } = req.body;

    if (!userId || !Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, message: "Invalid user or cart items." });
    }

    // Filter valid product IDs only
    const validItems = cartItems.filter(
      (item) =>
        isValidObjectId(item.product) &&
        typeof item.quantity === "number" &&
        item.quantity > 0
    );

    if (validItems.length === 0) {
      return res.status(400).json({ success: false, message: "No valid cart items found." });
    }

    // Update user cart
    const user = await User.findByIdAndUpdate(
      userId,
      { cartItems: validItems },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, message: "Cart updated successfully." });
  } catch (err) {
    console.error("❌ Error updating cart:", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


