import express from "express";
import {signUpuser,loginUser,logoutUser,followandunfollowuser,updateUser,getUserProfile} from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();

router
.get('/profile/:query',getUserProfile)
.post('/signup',signUpuser)
.post('/login',loginUser)
.post ("/logout",logoutUser)
.post('/follow/:id',protectRoute,followandunfollowuser)
.put('/update/:id',protectRoute,updateUser)
export default router;