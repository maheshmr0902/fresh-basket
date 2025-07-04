// routes/addressRouter.js
import express from "express";
import authUser from "../middlewares/authUser.js";
import { addAddress, getUserAddresses } from "../controllers/addressController.js";

const router = express.Router();

router.post("/add", authUser, addAddress);        // /api/address/add
router.post("/get", authUser, getUserAddresses);   // /api/address/get

export default router;






