import express from 'express';
import {
  registerUser,
  loginUser,
  checkAuth,
  logout
} from '../controllers/userControllers.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

// ✅ Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// ✅ Protected routes
userRouter.get('/is-auth', authUser, checkAuth);
userRouter.post('/logout', authUser, logout);

export default userRouter;








