import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  try {
    const token = req.cookies?.sellerToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No seller token",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Not a valid seller",
      });
    }

    req.seller = decoded.email;
    next();
  } catch (error) {
    console.error("authSeller middleware error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default authSeller;







