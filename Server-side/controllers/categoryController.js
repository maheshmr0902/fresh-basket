import Category from '../models/Category.js'; // 👈 IS THIS FILE PRESENT?


export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // assuming mongoose model
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error('Error listing categories:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
