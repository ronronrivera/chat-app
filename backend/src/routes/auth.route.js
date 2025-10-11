import express from "express";
import { Signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/signup', Signup);


router.get('/login', (req, res) =>{
	res.send('login end point');
})

router.get('/logout', (req, res) =>{
res.send('logout end point');
})

export default router;

