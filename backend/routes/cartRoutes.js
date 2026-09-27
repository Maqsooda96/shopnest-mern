import express from "express";
import Cart from "../models/Cart.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//Add to Cart
router.post("/", authMiddleware, async(req, res) => {
    try{
        const { productId } = req.body;

        const existingCart = await Cart.findOne({
            userId: req.user.id,
            productId,
        });

        if (existingCart)
        {
            existingCart.quantity += 1;
            await existingCart.save();

            return res.json(existingCart);
        }

        const cartItem = new Cart({
            userId: req.user.id,
            productId,
        });

        await cartItem.save();

        res.json(cartItem);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            message: "Failed to add to cart",
        });
    }
});

//GET Cart Items
router.get("/", authMiddleware, async (req, res) => {
    try{
        const cartItems = await Cart.find({
            userId: req.user.id,
        }).populate("productId");
        res.json(cartItems);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch cart",});
    }
});

//Increase Quantity
router.put("/increase/:id", authMiddleware, async(req, res) => {
    try{
        const cartItem = await Cart.findById(req.params.id);

        cartItem.quantity += 1;
        await cartItem.save();

        res.json(cartItem);
    }
    catch(error)
    {
        res.status(500).json({ message: "Failed to update quantity" });
    }
});

//Decrease quantity
router.put("/decrease/:id", authMiddleware, async(req, res) => {
    try{
        const cartItem = await Cart.findById(req.params.id);

        if(cartItem.quantity > 1)
        {
            cartItem.quantity -= 1;
            await cartItem.save();
        }else
        {
            await Cart.findByIdAndDelete(req.params.id);
        }

        res.json({ message: "Updated" });
    }
    catch(error)
    {
        res.status(500).json({ message: "Failed to update quantity" });
    }
});

//Delete
router.delete("/:id", authMiddleware, async (req, res) => {
    try{
        await Cart.findByIdAndDelete(req.params.id);

        res.json({ message: "Item removed from cart",});
    }
    catch(error)
    {
        res.status(500).json({ message: "Failed to remove item" });
    }
});

export default router;