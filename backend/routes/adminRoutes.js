import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/stats", authMiddleware, async(req, res) => {
    try{
        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const totalCustomers = await User.countDocuments({
            userType: "customer",
        });

        const totalSellers = await User.countDocuments({
            userType: "seller",
        });

        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]);

        res.json({
            totalProducts,
            totalOrders,
            totalCustomers,
            totalSellers,
            totalRevenue: revenue.length > 0 ? revenue[0].total : 0,
        });
    }
    catch(error)
    {
        res.status(500).json({ message: error.message,});
    }
});

export default router;