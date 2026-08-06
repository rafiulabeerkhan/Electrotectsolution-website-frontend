import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { usePaginationStore } from "../store/paginationStore";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { accessToken } = useAuthStore();
  const { setTotalData } = usePaginationStore();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        setTotalData(data.data.length);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("Network error. Could not fetch users.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, accessToken, setTotalData]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData) => {
    try {
      const isFormData = userData instanceof FormData;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers,
        body: isFormData ? userData : JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "User created successfully");
        await fetchUsers();
        return true;
      } else {
        toast.error(data.message || "Failed to create user");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred during create.");
      return false;
    }
  };

  const updateUser = async (id, userData) => {
    try {
      const isFormData = userData instanceof FormData;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      
      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${apiUrl}/users/${id}`, {
        method: "PUT",
        headers,
        body: isFormData ? userData : JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "User updated successfully");
        await fetchUsers();
        return true;
      } else {
        toast.error(data.message || "Failed to update user");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred during update.");
      return false;
    }
  };

  return { users, loading, fetchUsers, createUser, updateUser };
};
