import Order from "../models/Order.js";
import Product from "../models/Product.js";

// --- Place Order with COD ---
export const placeOrderCod = async (req, res) => {
  try {
    const { items, address } = req.body;
    const userId = req.userId;

    if (!address || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Address and a non-empty items array are required" });
    }

    // Validate product IDs
    const invalidIds = items.filter(item => !item.product || !/^[a-fA-F0-9]{24}$/.test(item.product));
    if (invalidIds.length > 0) {
      return res.status(400).json({ success: false, message: "Invalid product IDs in order." });
    }

    const productIds = items.map(item => item.product);
    const productsFromDb = await Product.find({ _id: { $in: productIds } });

    const productMap = new Map(productsFromDb.map(p => [p._id.toString(), p]));

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = productMap.get(item.product);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product with ID ${item.product} not found` });
      }
      if (!product.inStock) {
        return res.status(400).json({ success: false, message: `Sorry, ${product.name} is out of stock.` });
      }

      totalAmount += product.offerPrice * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtOrder: product.offerPrice,
      });
    }

    const tax = totalAmount * 0.02;
    const finalAmount = totalAmount + tax;

    await Order.create({
      user: userId,
      items: orderItems,
      amount: finalAmount,
      address,
      isPaid: false,
      status: "pending",
    });

    return res.status(201).json({ success: true, message: "Order placed successfully with COD" });
  } catch (err) {
    console.error("Error placing order with COD:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// --- Get User Orders ---
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "name image")
      .populate("address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      },
    });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// --- Get All Orders (Admin) ---
export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({})
      .populate("user", "username email")
      .populate("address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      },
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Optional placeholder
export const createOrder = async (req, res) => {
  return res.status(200).json({ success: true, message: "createOrder placeholder route." });
};




