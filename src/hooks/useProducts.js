import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { usePaginationStore } from "../store/paginationStore";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { accessToken } = useAuthStore();
  const { setTotalData } = usePaginationStore();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/products`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setTotalData(data.data.length);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      toast.error("Network error. Could not fetch products.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, accessToken, setTotalData]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (productData) => {
    try {
      const res = await fetch(`${apiUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Product created");
        await fetchProducts();
        return true;
      } else {
        toast.error(data.message || "Failed to create product");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred during create.");
      return false;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Product updated");
        await fetchProducts();
        return true;
      } else {
        toast.error(data.message || "Failed to update product");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred during update.");
      return false;
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return false;
    try {
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Product deleted");
        await fetchProducts();
        return true;
      } else {
        toast.error(data.message || "Delete failed");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred during delete.");
      return false;
    }
  };

  return { products, loading, fetchProducts, createProduct, updateProduct, deleteProduct };
};
