import { useMemo, useState } from "react";
import { Edit3, Plus, Save, Trash2, Upload } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const ADMIN_SESSION_KEY = "sijo-admin-authenticated-v1";
const ADMIN_TOKEN_KEY = "sijo-admin-token-v1";
const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const stockColumns = ["In Stock", "Limited", "Out of Stock"];

const defaultFormState = {
  name: "",
  price: "",
  image:
    "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1400",
  category: "faucets",
  stock: "In Stock"
};

const AdminPage = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, resetProducts } =
    useProducts();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isAuthorized, setIsAuthorized] = useState(
    sessionStorage.getItem(ADMIN_SESSION_KEY) === "true"
  );
  const [authToken, setAuthToken] = useState(localStorage.getItem(ADMIN_TOKEN_KEY) || "");
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultFormState);
  const [draggingProductId, setDraggingProductId] = useState(null);

  const categoryNames = useMemo(
    () =>
      categories.reduce((map, category) => {
        map[category.slug] = category.title;
        return map;
      }, {}),
    [categories]
  );

  const handleAuthorize = (event) => {
    event.preventDefault();
    setIsSaving(true);
    fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: credentials.username.trim(),
        password: credentials.password
      })
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.message || "Invalid username or password.");
        }
        if (!data?.token) {
          throw new Error("Login failed.");
        }
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setAuthToken(data.token);
        setIsAuthorized(true);
        sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm(defaultFormState);
    setEditingId(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setField("image", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatPrice = (price) =>
    String(price).trim().startsWith("₹") ? String(price).trim() : `₹${String(price).trim()}`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!authToken) {
      alert("Please login again.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      image: form.image.trim() || "/images/category.png",
      price: formatPrice(form.price)
    };

    if (!payload.name || !payload.price || !payload.category || !payload.stock) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setIsSaving(true);
      if (editingId) {
        await updateProduct(editingId, payload, authToken);
      } else {
        await addProduct(payload, authToken);
      }
      resetForm();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock
    });
  };

  const handleDropToStock = async (stockValue) => {
    if (!draggingProductId) return;
    if (!authToken) return;
    try {
      await updateProduct(draggingProductId, { stock: stockValue }, authToken);
    } catch (error) {
      alert(error.message);
    }
    setDraggingProductId(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setIsAuthorized(false);
    setAuthToken("");
    setCredentials({ username: "", password: "" });
  };

  if (!isAuthorized) {
    return (
      <section className="bg-[#06080B] py-28">
        <div className="mx-auto max-w-md rounded-sm border border-slateGreySoft bg-slateGrey p-6">
          <h1 className="text-3xl font-semibold text-white">Owner Admin Login</h1>
          <p className="mt-2 text-sm text-textSoft">
            Enter owner credentials to manage products.
          </p>
          <form onSubmit={handleAuthorize} className="mt-6 space-y-4">
            <input
              type="text"
              value={credentials.username}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, username: event.target.value }))
              }
              placeholder="Username"
              className="w-full rounded-sm border border-white/20 bg-obsidian px-4 py-3 text-white outline-none transition focus:border-brushedGold"
            />
            <input
              type="password"
              value={credentials.password}
              onChange={(event) =>
                setCredentials((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder="Password"
              className="w-full rounded-sm border border-white/20 bg-obsidian px-4 py-3 text-white outline-none transition focus:border-brushedGold"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-sm bg-brushedGold px-4 py-3 text-sm font-semibold text-obsidian transition hover:bg-brushedGoldSoft"
            >
              {isSaving ? "Please wait..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#06080B] py-28">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <aside className="rounded-sm border border-slateGreySoft bg-slateGrey p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-white">
              {editingId ? "Edit Product" : "Add Product"}
            </h2>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-sm border border-white/20 px-3 py-1 text-xs text-white/80 transition hover:border-red-500/50 hover:text-red-300"
            >
              Logout
            </button>
          </div>
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              value={form.name}
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Product name"
              className="w-full rounded-sm border border-white/20 bg-obsidian px-3 py-2 text-sm text-white outline-none focus:border-brushedGold"
            />
            <input
              value={form.price}
              onChange={(event) => setField("price", event.target.value)}
              placeholder="Price (e.g. ₹52,000)"
              className="w-full rounded-sm border border-white/20 bg-obsidian px-3 py-2 text-sm text-white outline-none focus:border-brushedGold"
            />
            <label className="block rounded-sm border border-dashed border-white/20 bg-obsidian p-3 text-sm text-white/80">
              <span className="mb-2 inline-flex items-center gap-2">
                <Upload size={14} />
                Upload Product Image
              </span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-xs" />
            </label>
            {form.image ? (
              <img src={form.image} alt="Preview" className="h-24 w-full rounded-sm object-cover" />
            ) : null}
            <select
              value={form.category}
              onChange={(event) => setField("category", event.target.value)}
              className="w-full rounded-sm border border-white/20 bg-obsidian px-3 py-2 text-sm text-white outline-none focus:border-brushedGold"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
            <select
              value={form.stock}
              onChange={(event) => setField("stock", event.target.value)}
              className="w-full rounded-sm border border-white/20 bg-obsidian px-3 py-2 text-sm text-white outline-none focus:border-brushedGold"
            >
              <option>In Stock</option>
              <option>Limited</option>
              <option>Out of Stock</option>
            </select>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-brushedGold px-3 py-2 text-sm font-semibold text-obsidian transition hover:bg-brushedGoldSoft"
              >
                {editingId ? <Save size={16} /> : <Plus size={16} />}
                {editingId ? "Save" : "Add"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-sm border border-white/20 px-3 py-2 text-sm text-white transition hover:border-brushedGold hover:text-brushedGoldSoft"
              >
                Cancel
              </button>
            </div>
          </form>
          <button
            type="button"
            onClick={async () => {
              if (!authToken) return;
              try {
                await resetProducts(authToken);
              } catch (error) {
                alert(error.message);
              }
            }}
            className="mt-4 w-full rounded-sm border border-red-500/40 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
          >
            Reset to Default Products
          </button>
        </aside>

        <div className="rounded-sm border border-slateGreySoft bg-slateGrey p-5">
          <h2 className="text-2xl font-semibold text-white">Manage Products</h2>
          <p className="mt-1 text-sm text-textSoft">
            Drag products between inventory columns to update stock status instantly.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {stockColumns.map((stockValue) => (
              <div
                key={stockValue}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDropToStock(stockValue)}
                className="min-h-56 rounded-sm border border-white/15 bg-obsidian p-3"
              >
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brushedGold">
                  {stockValue}
                </h3>
                <div className="space-y-3">
                  {products
                    .filter((product) => product.stock === stockValue)
                    .map((product) => (
                      <article
                        key={product.id}
                        draggable
                        onDragStart={() => setDraggingProductId(product.id)}
                        className="grid cursor-grab gap-3 rounded-sm border border-white/10 bg-slateGrey p-3 active:cursor-grabbing"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-20 w-full rounded-sm object-cover"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-white">{product.name}</h4>
                          <p className="text-xs text-brushedGold">{product.price}</p>
                          <p className="text-xs text-textSoft">
                            {categoryNames[product.category] ?? product.category}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(product)}
                            className="inline-flex items-center gap-1 rounded-sm border border-white/20 px-2 py-1 text-xs text-white transition hover:border-brushedGold hover:text-brushedGoldSoft"
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!authToken) return;
                              try {
                                await deleteProduct(product.id, authToken);
                              } catch (error) {
                                alert(error.message);
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded-sm border border-red-500/40 px-2 py-1 text-xs text-red-300 transition hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
