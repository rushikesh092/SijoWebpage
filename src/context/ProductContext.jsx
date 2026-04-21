import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { categories, initialProducts } from "../data/products";

const ProductContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const requestJson = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message || "Request failed.");
  }
  if (response.status === 204) return null;
  return response.json();
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await requestJson("/api/products");
      setProducts(Array.isArray(data?.products) ? data.products : initialProducts);
    } catch {
      setProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (productData, token) => {
    const data = await requestJson("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    setProducts((prev) => [...prev, data.product]);
  };

  const updateProduct = async (id, productData, token) => {
    const data = await requestJson(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    setProducts((prev) => prev.map((product) => (product.id === id ? data.product : product)));
  };

  const deleteProduct = async (id, token) => {
    await requestJson(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const resetProducts = async (token) => {
    const data = await requestJson("/api/products/reset", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setProducts(Array.isArray(data?.products) ? data.products : initialProducts);
  };

  const getProductsByCategory = (slug) =>
    products.filter((product) => product.category === slug);
  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);

  const value = {
    categories,
    products,
    isLoading,
    loadProducts,
    featuredProducts,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductProvider");
  }
  return context;
};
