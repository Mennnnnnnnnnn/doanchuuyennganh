import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import { connectDB } from "./lib/db.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({limit:"10mb"}));// allows you to parse the body of the request
app.use(cookieParser());
app.use("/api/auth",authRoutes);// tuyen duong den authRoutes
app.use("/api/products",productRoutes);// tuyen duong den productRoutes
app.use("/api/cart",cartRoutes);// tuyen duong den cartRoutes
app.use("/api/coupons",couponRoutes);// tuyen duong den couponRoutes
app.use("/api/payments",paymentRoutes);// tuyen duong den paymentRoutes
app.use("/api/analytics",analyticsRoutes);// tuyen duong den analyticsRoutes
app.listen(PORT,()=>{
    console.log("server is running on http://localhost:"+PORT);
    connectDB();
});

