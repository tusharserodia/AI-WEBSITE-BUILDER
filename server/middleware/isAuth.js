import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const isAuth = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({
                success: false,
                message: "token not found!!"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user=await User.findById(decoded.id);
        next(); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({
                success: false,
                message: "invalid token!!"
            })
    }
}
export default isAuth;