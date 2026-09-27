import express from "express";
import Product from '../models/Product.js';
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename:(req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

const router = express.Router();

//create a product
router.post("/", authMiddleware, upload.single("image"), async(req, res) => {
    try{
    const { name, price, category } = req.body;
    const image = req.file ? req.file.filename : "";

        const product = new Product({
            name,
            price,
            category,
            image,
            sellerId: req.user.id
        });

        const savedProduct = await product.save();

        res.json(savedProduct);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Failed to create product", error: error.message });
    }
});

//get all products (filter and sorting)
router.get("/", async(req, res) => {
    try{
        const {category, sort } = req.query;

        let query = {
            status: "active",
        };

        if(category)
        {
            query.category = category;
        }

        let products = Product.find(query).populate("sellerId", "name email");

        if(sort === "price_asc")
        {
            products = products.sort({ price: 1 });
        }

        if(sort === "price_desc")
        {
            products = products.sort({ price: -1 });
        }

        const result = await products;
        
        res.json(result);
    }
    catch(error){
        res.status(500).json({ message: "Failed to fetch products" });
    }
});

//get logged-in seller products
router.get("/my-products", authMiddleware, async(req, res) => {
    try{
        const products = await Product.find({
            sellerId: req.user.id
        });
        res.json(products);
    }
    catch(error)
    {
        res.status(500).json({ message: "Failed to fetch seller products"});
    }
});

//get single product
router.get("/:id", async(req, res) => {
    try{
        const product = await Product.findById(req.params.id)
            .populate("sellerId", "name email");

        if(!product)
        {
            return res.status(404).json({ message: "Product not found "});
        }
        res.json(product);
    }
    catch(error){
        res.status(500).json({ message: "Error fetching product" });
    }
});

//delete product
router.delete("/:id", authMiddleware, async(req, res) =>{
    try{
            const product = await Product.findById(req.params.id);
            
            if(!product)
            {
                return res.status(404).json({ message: "Product not found" });
            }
            
            if (product.sellerId.toString() !== req.user.id)
            {
                return res.status(403).json({ message: "Not authorized" });
            }

            //Delete image from uploads folder
            if(product.image)
            {
                fs.unlink(`uploads/${product.image}`, (err) => {
                    if(err){
                        console.log("Image delete error: ", err);
                    }
                });
            }

            await product.deleteOne();
            
            res.json({ message: "Product deleted" });
    }
    catch(error){
        res.status(500).json({ message: "Failed to delete product" });
    }
});

//update product
router.put("/:id", authMiddleware, upload.single("image"), async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product)
        {
            return res.status(404).json({ message: "Product not found" });
        }

        if(product.sellerId.toString() !== req.user.id)
        {
            return res.status(403).json({ message: "Not authorized" });
        }

        //Delete old image if new one uploaded
        if(req.file && product.image)
        {
            fs.unlink(`uploads/${product.image}`, (error) => {
                if(error) console.log("Old image delete error: ", error);
            });
        }

        const updateData = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            image: req.file ? req.file.filename: product.image,
        };

        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        res.json(updateProduct);    
    }
    catch(error){
        res.status(500).json({ message: "Failed to update product" });
    }
});

router.patch("/:id/status", authMiddleware, async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product)
        {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        if(product.sellerId.toString() !== req.user.id)
        {
            return res.status(403).json({
                message: "Not authorized",
            });
        }
        product.status = product.status === "active" ? "inactive" : "active";

        await product.save();
        res.json(product);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            message: "Failed to update product status", 
        });
    }
});

export default router;