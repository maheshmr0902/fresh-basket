import express from 'express';
import {
  sellerLogin,
  checkSellerAuth,
  sellerLogout,
} from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.get('/is-auth', authSeller, checkSellerAuth);
sellerRouter.get('/logout', authSeller, sellerLogout);

export default sellerRouter;





