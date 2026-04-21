import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    stock: { type: String, required: true, trim: true }
  },
  { versionKey: false }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
