import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: String,
                price: Number,
                quantity: Number,
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
        },

        deliveryDetails: {
            fullName: String,
            phone: String,
            address: String,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Order", orderSchema);