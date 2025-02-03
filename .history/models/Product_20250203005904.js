import { model, Schema, models } from "mongoose";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: [String] },  
}, { timestamps: true });

export const Product = models.Product || model('Product', ProductSchema);
