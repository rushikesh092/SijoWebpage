import { useState, useMemo } from "react";
import { Edit3, Plus, Save, Trash2, Upload } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const stockColumns = ["In Stock", "Limited", "Out of Stock"];

const defaultFormState = {
  name: "",
  price: "",
  image: "",
  category: "faucets",
  stock: "In Stock",
};

const AdminPage = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, resetProducts } =
    useProducts();

  // 🔐 SIMPLE LOGIN
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [isAuthorized, setIsAuthorized] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultFormState);
  const [draggingId, setDraggingId] = useState(null);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.slug] = cat.title;
      return acc;
    }, {});
  }, [categories]);

  // 🔐 LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    if (
      credentials.username === "admin" &&
      credentials.password === "sijo@123"
    ) {
      setIsAuthorized(true);
    } else {
      alert("Wrong credentials");
    }
  };

  // 📁 IMAGE UPLOAD FROM PC
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(defaultFormState);
    setEditingId(null);
  };

  // ➕ ADD / EDIT PRODUCT
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      name: form.name.trim(),
      price: form.price,
      image:
        form.image ||
        "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
    };

    if (!payload.name || !payload.price) {
      alert("Fill all fields");
      return;
    }

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
    }

    resetForm();
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm(product);
  };

  const handleDrop = (stock) => {
    if (!draggingId) return;
    updateProduct(draggingId, { stock });
    setDraggingId(null);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setCredentials({ username: "", password: "" });
  };

  // 🔐 LOGIN SCREEN
  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <form
          onSubmit={handleLogin}
          className="w-96 rounded-xl border border-gray-700 bg-gray-900 p-6"
        >
          <h2 className="mb-4 text-2xl font-bold text-yellow-400">
            Admin Login
          </h2>

          <input
            className="mb-3 w-full rounded bg-gray-800 p-2"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />

          <input
            type="password"
            className="mb-4 w-full rounded bg-gray-800 p-2"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <button className="w-full rounded bg-yellow-500 p-2 font-bold text-black">
            Login
          </button>
        </form>
      </div>
    );
  }

  // 📊 ADMIN PANEL
  return (
    <div className="min-h-screen bg-[#0b0b0b] p-6 text-white">
      {/* HEADER */}
      <div className="mb-6 flex justify-between">
        <h1 className="text-3xl font-bold text-yellow-400">Admin Dashboard</h1>

        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="mb-8 rounded-xl border border-gray-700 bg-gray-900 p-5">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <input
          className="mb-2 w-full rounded bg-gray-800 p-2"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />

        <input
          className="mb-2 w-full rounded bg-gray-800 p-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setField("price", e.target.value)}
        />

        {/* 📁 FILE UPLOAD */}
        <label className="mb-2 block cursor-pointer rounded border border-dashed border-gray-500 bg-gray-800 p-3 text-sm">
          <div className="flex items-center gap-2">
            <Upload size={14} />
            Upload Image from PC
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mt-2 w-full text-xs"
          />
        </label>

        {/* 🖼️ PREVIEW */}
        {form.image && (
          <img
            src={form.image}
            className="mb-3 h-28 w-full rounded object-cover"
            alt="preview"
          />
        )}

        <button
          onClick={handleSubmit}
          className="rounded bg-green-500 px-4 py-2 font-bold text-black"
        >
          {editingId ? "Update" : "Add Product"}
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-3 gap-4">
        {stockColumns.map((stock) => (
          <div
            key={stock}
            className="rounded-xl border border-gray-700 bg-gray-900 p-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stock)}
          >
            <h3 className="mb-3 font-bold text-yellow-400">{stock}</h3>

            {products
              .filter((p) => p.stock === stock)
              .map((p) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => setDraggingId(p.id)}
                  className="mb-3 rounded bg-gray-800 p-3"
                >
                  <img
                    src={p.image}
                    className="mb-2 h-20 w-full rounded object-cover"
                  />

                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-yellow-400">{p.price}</p>

                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-blue-400"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;