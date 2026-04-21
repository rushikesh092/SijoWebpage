import { requireAdmin } from "../_lib/auth.js";
import { resetProducts } from "../_lib/products.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    requireAdmin(req);
    const products = await resetProducts();
    return res.status(200).json({ products });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || "Request failed." });
  }
}
