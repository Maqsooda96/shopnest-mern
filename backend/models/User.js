import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userType: {
            type: String,
            enum: ["customer", "seller", "admin"],
            default: "customer"
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
    },
    {
        timestamps: true
    }
    );

export default mongoose.model("User", userSchema);