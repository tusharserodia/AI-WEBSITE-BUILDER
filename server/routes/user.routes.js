import express from "express"
import isAuth from "../middleware/isAuth.js";
import {  generateDemo, getCurrentUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/me", isAuth, getCurrentUser );
userRouter.get("/gen", generateDemo );
// userRouter.get("/logout",logout );
export default userRouter;