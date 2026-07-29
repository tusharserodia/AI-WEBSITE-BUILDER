import jwt  from "jsonwebtoken";
import User from "../models/user.model.js";

export const googleAuth = async(req, res) => {
    try {
        const{name, email, avatar} = req.body;
        if(!email){
            return res.status(400).josn({
                message: "email is required!!"
            })
        }
        let user = await User.findOne({email});
        if(!user){
            user = await User.create({
                name, email, avatar
            })
        } 
        const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.cookie("token", token,{
           httpOnly: true,
           secure: true,
           sameSite: "none",
           maxAge:7*24*60*60*1000  
        })
        return res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: `Google Auth Error ${error}`
        });
    }
}
export const logout = async (req, res) => {
    try {
         res.clearCookie("token", {
           httpOnly: true,
           secure: true,
           sameSite: "none",
           maxAge:7*24*60*60*1000  
        });
        return res.status(200).json({
            message: "logout success"
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: `Logout Error ${error}`
        });
    }
}   
