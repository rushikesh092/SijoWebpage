import { requireAdmin } from "../_lib/auth.js";
import { Product } from "../_lib/product-model.js";
import {
  getAllProducts,
  sanitizeProduct,
  validateProduct
} from "../_lib/products.js";
import { connectDb } from "../_lib/db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const products = await getAllProducts();
      return res.status(200).json({ products });
    }

    if (req.method === "POST") {
      requireAdmin(req);
      await connectDb();

      const latest = await Product.findOne({}, { id: 1, _id: 0 }).sort({ id: -1 }).lean();
      const nextId = latest?.id ? Number(latest.id) + 1 : 1;
      const payload = sanitizeProduct({ ...req.body, id: nextId });

      if (!validateProduct(payload)) {
        return res.status(400).json({ message: "Missing required product fields." });
      }

      await Product.create(payload);
      return res.status(201).json({ product: payload });
    }

    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Request failed." });
  }
}
