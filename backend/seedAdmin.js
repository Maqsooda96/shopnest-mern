import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            email: "admin@shopnest.com",
        });

        if(existingAdmin)
        {
            console.log("admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        const admin = new User({
            name: "Admin",
            email: "admin@shopnest.com",
            password: hashedPassword,
            userType: "admin",
        });

        await admin.save();

        console.log("Admin created successfully");
        process.exit();
    }
    catch(error)
    {
        console.log(error);
        process.exit(1);
    }
};

createAdmin();