import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { accessToken } = useAuthStore();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api";

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiUrl}/clients`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (err) {
      const message = err.message || 'Failed to fetch clients';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, accessToken]);

  const createClient = async (clientData) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(clientData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Client created successfully');
        await fetchClients();
        return true;
      } else {
        toast.error(data.message || 'Failed to create client');
        return false;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create client');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id, clientData) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/clients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(clientData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Client updated successfully');
        await fetchClients();
        return true;
      } else {
        toast.error(data.message || 'Failed to update client');
        return false;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update client');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/clients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Client deleted successfully');
        await fetchClients();
        return true;
      } else {
        toast.error(data.message || 'Failed to delete client');
        return false;
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete client');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient
  };
};
