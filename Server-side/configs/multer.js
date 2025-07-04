import multer from "multer";
import path from "path";

// Configure multer disk storage
const storage = multer.diskStorage({
  filename: (file, callback) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    callback(null, filename);
  },
});

// Optional file filter to accept only images
const fileFilter = (_req, file, callback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, JPG, and WEBP images are allowed."), false);
  }
};

// Export upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, /* 5 MB */
  },
});




