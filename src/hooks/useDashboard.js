import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { accessToken } = useAuthStore();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/api";

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiUrl}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      const message = err.message || 'Failed to fetch dashboard stats';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, accessToken]);

  return {
    stats,
    loading,
    error,
    fetchStats
  };
};
