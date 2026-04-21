import { initialProducts } from "../../src/data/products.js";
import { connectDb } from "./db.js";
import { Product } from "./product-model.js";

const sanitizeProduct = (product) => ({
  id: Number(product.id),
  name: String(product.name || "").trim(),
  price: String(product.price || "").trim(),
  image: String(product.image || "").trim(),
  category: String(product.category || "").trim(),
  stock: String(product.stock || "").trim()
});

export const validateProduct = (product) =>
  product.name && product.price && product.image && product.category && product.stock;

export const ensureSeededProducts = async () => {
  await connectDb();
  const count = await Product.countDocuments();
  if (count > 0) return;
  await Product.insertMany(initialProducts.map(sanitizeProduct), { ordered: true });
};

export const getAllProducts = async () => {
  await ensureSeededProducts();
  return Product.find({}, { _id: 0 }).sort({ id: 1 }).lean();
};

export const resetProducts = async () => {
  await connectDb();
  await Product.deleteMany({});
  await Product.insertMany(initialProducts.map(sanitizeProduct), { ordered: true });
  return Product.find({}, { _id: 0 }).sort({ id: 1 }).lean();
};

export { sanitizeProduct };
