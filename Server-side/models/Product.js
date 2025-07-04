import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Added trim for consistency
    },
    description: {
      type: String, // Changed to a single string for general description
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price cannot be negative
    },
    offerPrice: {
      type: Number,
      // No default here, application logic should handle if offerPrice isn't set
      min: 0, // Offer price cannot be negative
    },
    image: {
      type: [String], // Array of image URLs or paths
      required: true,
    },
    category: {
      type: [String], // Array of category names/paths, allowing multiple categories
      required: true,
      lowercase: true, // Convert categories to lowercase for consistent querying
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true, // Enables createdAt & updatedAt
    versionKey: false, // Disables __v field
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
