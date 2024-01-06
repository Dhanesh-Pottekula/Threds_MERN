import User from "../models/Usermodel.js"
import jwt, { decode }  from "jsonwebtoken"
const protectRoute = async (req,res,next)=>{
    try {
        
        const token = req.cookies.jwt;
        
        if (!token) return res.status (401).json('unauthorised')

        const decoded =  jwt.verify(token,process.env.JWT_SECRET)
        
        const userid=decoded.userId

        const user = await User.findById(userid).select("-password");

        req.user=user

        next();
    } 
    catch (error) {
        res.status(500).json({ message: error.message });
    console.log("error in protected middleware  user");
    }
}

export {protectRoute}