import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/User.js';

const router = express.Router();

//Register
// > Backend validation
// > Duplication prevention
// > Password hashing (industry level)

router.post("/", async(req, res) => {
    try{
        const { name, email, password, userType} = req.body;

        if(!name || !email || !password || !userType)
        {
            return res.status(400).json({ message: "All fields are required"});
        }

        const existingUser = await User.findOne({ email });

        if(existingUser)
        {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            userType
        });

        const savedUser = await user.save();

        res.status(201).json({ message: "Registration successful", 
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                userType: savedUser.userType,
            },
        });
    }
        catch(error){
             console.log("REGISTER ERROR:", error);
            res.status(500).json({ message: error.message, errorName: error.name, });
        }
});

//login
router.post("/login", async(req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user)
        {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect)
        {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                id: user._id,
                userType: user.userType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({ message: "Login Successful", token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            },
        });
    }
    catch(error){
        console.log("LOGIN ERROR:", error);
        res.status(500).json({ message: error.message, errorName: error.name });
    }
});

export default router;