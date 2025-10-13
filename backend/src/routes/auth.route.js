import express from "express";
import { Signup, Login, Logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.post('/signup', Signup);
router.post('/login',arcjetProtection,Login);
router.post('/logout',Logout);

router.put('/update-profile', protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) =>{
	res.status(200).json(req.user);
});

export default router;

