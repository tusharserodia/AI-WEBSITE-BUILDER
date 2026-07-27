import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import userRouter from "./routes/user.routes.js";
import websiteRouter from "./routes/website.routes.js";
import billingRouter from "./routes/billing.routes.js";
import stripe from "./config/stripe.js";
import { stripeWebhook } from "./controllers/stripeWebhook.controller.js";
const app= express();

app.post("/api/stripe/webhook", express.raw({type:"application/json"}), stripeWebhook);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
   origin: "http://localhost:5173",
   credentials: true
}));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);

const port= process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server started at port:", port);
    connectDB();
})