import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import dotenv from "dotenv";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

//moddlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully..!!"))
    .catch((error) => console.log(error));

//test route
app.get("/", (req, res) => {
    res.send("API is running...!!");
});

const PORT = process.env.PORT || 5000;

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}..!!`);
});