import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No authentication token provided.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found.',
      });
    }

    req.userId = decoded.id;  // for compatibility
   req.userId = user._id;

    next();
  } catch (error) {
    console.error('authUser middleware error:', error.message);

    const isJWTError =
      error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError';

    return res.status(isJWTError ? 401 : 500).json({
      success: false,
      message: isJWTError
        ? 'Invalid or expired authentication token.'
        : 'Internal server error during authentication.',
    });
  }
};

export default authUser;





