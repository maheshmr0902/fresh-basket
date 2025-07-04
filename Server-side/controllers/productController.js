import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

// --- Add Product - POST /api/product/add ---
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = Array.isArray(req.files) ? req.files : [];

    // Improved validation
    const { name, price, offerPrice, category, description } = productData;
    if (!name || !price || !offerPrice || !category || !description) {
      return res.status(400).json({ success: false, message: 'All product fields are required' });
    }

    const imageUrls = images.length > 0
      ? await Promise.all(
          images.map(image => cloudinary.uploader.upload(image.path, { folder: 'products' }).then(r => r.secure_url))
        )
      : [];

    const newProduct = await Product.create({ ...productData, image: imageUrls });

    res.status(201).json({ success: true, message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// --- Product List (with Pagination) - GET /api/product/list ---
export const productList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.find({ inStock: true }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments({ inStock: true });

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
      },
    });
  } catch (error) {
    console.error('Error fetching product list:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// --- Other controllers remain largely the same, but with consistent success flags ---
// Product By ID - GET /api/product/:id
// GET /api/product/:id
export const productById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/product/stock/:id
export const changeStock = async (req, res) => {
  try {
    const productId = req.params.id;
    const { inStock } = req.body;
    const updated = await Product.findByIdAndUpdate(productId, { inStock }, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product: updated });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


