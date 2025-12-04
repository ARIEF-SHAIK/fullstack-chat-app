import express from 'express';
import { checkAuth, updateProfile, signup, login, logout } from '../controllers/auth.controller.js';
import upload from "../middleware/upload.js";
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.put("/update-profile", upload.single("profilepic"),protectRoute, updateProfile);

// router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);

export default router;
