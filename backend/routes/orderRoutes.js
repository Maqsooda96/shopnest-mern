import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try{
       const { fullName, phone, address, paymentMethod } = req.body;

       const cartItems = await Cart.find({
        userId: req.user.id,
       }).populate("productId");

       if(cartItems.length === 0)
       {
        return res.status(400).json({ message: "Cart is empty" ,});
       }

       const items = cartItems.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
       }));

       const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

       const order = new Order({
        userId: req.user.id,
        items,
        totalAmount,
        deliveryDetails: {
            fullName,
            phone,
            address,
        },
        paymentMethod,
       });

       await order.save();
       await Cart.deleteMany({
        userId: req.user.id,
       });

       res.json({ message: "Order placed successfully", order, });
       
    }
    catch(error)
    {
        res.status(500).json({ message: error.message });
    }
});

router.get("/my-orders", authMiddleware, async (req, res) => {
    try{
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1});

        res.json(orders);
    }
    catch(error)
    {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

//Admin - Get all orders
router.get("/", authMiddleware, async (req, res) => {
    try{
        const orders = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        
            res.json(orders);
    }
    catch(error)
    {
        res.status(500).json({ message: "Failed to fetch all orders" });
    }
});

//Admin - Update order status
router.put("/:id/status", authMiddleware, async (req, res) => {
    try{
        const  { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({ message: "Order status updated", order });
    }
    catch(error)
    {
        res.status(500).json({ message: "Failed to update order status" });
    }
});

export default router;