// controllers/sellerController.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// --- Seller Login - POST /api/seller/login ---
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const expectedEmail = process.env.SELLER_EMAIL;
   const expectedPasswordHash = process.env.SELLER_PASSWORD_HASH;
   console.log("SELLER_PASSWORD_HASH:", process.env.SELLER_PASSWORD_HASH);



    // Check email and password
    if (email !== expectedEmail) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, expectedPasswordHash);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Create JWT token
    const token = jwt.sign({ email, role: 'seller' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Set cookie
    res.cookie('sellerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Seller logged in successfully',
    });
  } catch (error) {
    console.error('❌ Seller Login Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// --- Seller Auth Check - GET /api/seller/is-auth ---
export const checkSellerAuth = (req, res) => {
  try {
    const token = req.cookies?.sellerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Invalid token',
        });
      }

      const expectedEmail = process.env.SELLER_EMAIL;
      const isSeller = decoded.email === expectedEmail && decoded.role === 'seller';

      if (!isSeller) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: Not a valid seller',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Seller is authenticated',
      });
    });
  } catch (error) {
    console.error('❌ Auth Check Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// --- Seller Logout - GET /api/seller/logout ---
export const sellerLogout = (req, res) => {
  try {
    res.clearCookie('sellerToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Seller logged out successfully',
    });
  } catch (error) {
    console.error('❌ Logout Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};




