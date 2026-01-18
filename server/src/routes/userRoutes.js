import express from "express";
import { getUserProfile, getAllUsers } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
const router = express.Router();
router.get("/", protect, getAllUsers);
router.get("/profile", protect, getUserProfile);
export default router;
