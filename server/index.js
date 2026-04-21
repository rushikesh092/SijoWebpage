import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initialProducts } from "../src/data/products.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "owner";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMeNow!123";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: "2mb" }));

const sanitizeProduct = (product) => ({
  id: Number(product.id),
  name: String(product.name || "").trim(),
  price: String(product.price || "").trim(),
  image: String(product.image || "").trim(),
  category: String(product.category || "").trim(),
  stock: String(product.stock || "").trim()
});

const validateProduct = (product) =>
  product.name && product.price && product.category && product.stock && product.image;

const ensureProductStore = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(PRODUCTS_FILE);
  } catch {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), "utf8");
  }
};

const readProducts = async () => {
  await ensureProductStore();
  const raw = await fs.readFile(PRODUCTS_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

const writeProducts = async (products) => {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) {
    return res.status(401).json({ message: "Missing auth token." });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired auth token." });
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { username = "", password = "" } = req.body || {};
  const isValid =
    username.trim() === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD;

  if (!isValid) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign({ role: "admin", username: ADMIN_USERNAME }, JWT_SECRET, {
    expiresIn: "8h"
  });
  return res.json({ token, username: ADMIN_USERNAME });
});

app.get("/api/products", async (_req, res) => {
  try {
    const products = await readProducts();
    return res.json({ products });
  } catch {
    return res.status(500).json({ message: "Failed to read products." });
  }
});

app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const products = await readProducts();
    const nextId = products.length ? Math.max(...products.map((item) => Number(item.id))) + 1 : 1;
    const payload = sanitizeProduct({ ...req.body, id: nextId });
    if (!validateProduct(payload)) {
      return res.status(400).json({ message: "Missing required product fields." });
    }
    const nextProducts = [...products, payload];
    await writeProducts(nextProducts);
    return res.status(201).json({ product: payload });
  } catch {
    return res.status(500).json({ message: "Failed to add product." });
  }
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const products = await readProducts();
    const index = products.findIndex((item) => Number(item.id) === id);
    if (index === -1) {
      return res.status(404).json({ message: "Product not found." });
    }

    const payload = sanitizeProduct({ ...products[index], ...req.body, id });
    if (!validateProduct(payload)) {
      return res.status(400).json({ message: "Missing required product fields." });
    }

    products[index] = payload;
    await writeProducts(products);
    return res.json({ product: payload });
  } catch {
    return res.status(500).json({ message: "Failed to update product." });
  }
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const products = await readProducts();
    const nextProducts = products.filter((item) => Number(item.id) !== id);
    if (nextProducts.length === products.length) {
      return res.status(404).json({ message: "Product not found." });
    }
    await writeProducts(nextProducts);
    return res.status(204).send();
  } catch {
    return res.status(500).json({ message: "Failed to delete product." });
  }
});

app.post("/api/products/reset", requireAdmin, async (_req, res) => {
  try {
    await writeProducts(initialProducts);
    return res.json({ products: initialProducts });
  } catch {
    return res.status(500).json({ message: "Failed to reset products." });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
