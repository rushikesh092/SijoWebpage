import { requireAdmin } from "../_lib/auth.js";
import { Product } from "../_lib/product-model.js";
import { connectDb } from "../_lib/db.js";
import { sanitizeProduct, validateProduct } from "../_lib/products.js";

export default async function handler(req, res) {
  try {
    requireAdmin(req);
    await connectDb();

    const id = Number(req.query.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid product id." });
    }

    if (req.method === "PUT") {
      const existing = await Product.findOne({ id }, { _id: 0 }).lean();
      if (!existing) {
        return res.status(404).json({ message: "Product not found." });
      }

      const payload = sanitizeProduct({ ...existing, ...req.body, id });
      if (!validateProduct(payload)) {
        return res.status(400).json({ message: "Missing required product fields." });
      }

      await Product.updateOne({ id }, payload);
      return res.status(200).json({ product: payload });
    }

    if (req.method === "DELETE") {
      const result = await Product.deleteOne({ id });
      if (!result.deletedCount) {
        return res.status(404).json({ message: "Product not found." });
      }
      return res.status(204).send();
    }

    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Request failed." });
  }
}
