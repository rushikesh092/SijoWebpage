import { useState, useMemo } from "react";
import { Edit3, Plus, Save, Trash2, Upload } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const stockColumns = ["In Stock", "Limited", "Out of Stock"];

const defaultFormState = {
  name: "",
  price: "",
  image:
    "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1400",
  category: "faucets",
  stock: "In Stock",
};

const AdminPage = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, resetProducts } =
    useProducts();

  // 🔐 SIMPLE LOGIN (HARD CODED)
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [isAuthorized, setIsAuthorized] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultFormState);
  const [draggingProductId, setDraggingProductId] = useState(null);

  const categoryNames = useMemo(() => {
    return categories.reduce((map, category) => {
      map[category.slug] = category.title;
      return map;
    }, {});
  }, [categories]);

  // 🔐 LOGIN FUNCTION
  const handleAuthorize = (e) => {
    e.preventDefault();

    if (
      credentials.username === "admin" &&
      credentials.password === "sijo@123"
    ) {
      setIsAuthorized(true);
    } else {
      alert("Wrong username or password");
    }
  };

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(defaultFormState);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      name: form.name.trim(),
      image: form.image.trim(),
      price: form.price,
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

  const handleDropToStock = (stockValue) => {
    if (!draggingProductId) return;

    updateProduct(draggingProductId, { stock: stockValue });
    setDraggingProductId(null);
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
          onSubmit={handleAuthorize}
          className="w-80 rounded-lg border border-gray-700 p-6"
        >
          <h2 className="mb-4 text-xl font-bold">Admin Login</h2>

          <input
            className="mb-3 w-full rounded bg-gray-800 p-2"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />

          <input
            className="mb-3 w-full rounded bg-gray-800 p-2"
            placeholder="Password"
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <button
            className="w-full rounded bg-yellow-500 p-2 font-bold text-black"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // 🔥 ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#0b0b0b] p-6 text-white">
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <button
          onClick={handleLogout}
          className="rounded bg-red-500 px-4 py-2"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="mb-6 rounded border p-4">
        <h2 className="mb-2 text-lg">Add / Edit Product</h2>

        <input
          className="mb-2 w-full rounded bg-gray-800 p-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />

        <input
          className="mb-2 w-full rounded bg-gray-800 p-2"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setField("price", e.target.value)}
        />

        <input
          className="mb-2 w-full rounded bg-gray-800 p-2"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setField("image", e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="rounded bg-green-500 px-4 py-2"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-3 gap-4">
        {stockColumns.map((stock) => (
          <div
            key={stock}
            className="rounded border p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropToStock(stock)}
          >
            <h3 className="mb-2 font-bold">{stock}</h3>

            {products
              .filter((p) => p.stock === stock)
              .map((product) => (
                <div
                  key={product.id}
                  draggable
                  onDragStart={() => setDraggingProductId(product.id)}
                  className="mb-2 rounded bg-gray-800 p-2"
                >
                  <p>{product.name}</p>
                  <p>{product.price}</p>

                  <button
                    onClick={() => startEdit(product)}
                    className="mr-2 text-blue-400"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;