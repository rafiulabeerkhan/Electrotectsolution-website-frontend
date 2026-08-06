import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

  const fetchDocuments = useCallback(
    async (type = "") => {
      setIsLoading(true);
      try {
        const url = type
          ? `${API_URL}/documents?type=${type}`
          : `${API_URL}/documents`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setDocuments(data.data);
        } else {
          toast.error(data.message || "Failed to fetch documents");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error connecting to server");
      } finally {
        setIsLoading(false);
      }
    },
    [accessToken, API_URL],
  );

  const createDocument = async (documentData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(documentData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Document created successfully!");
        return true;
      } else {
        toast.error(data.message || "Failed to create document");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDocument = async (id, documentData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/documents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(documentData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Document updated successfully!");
        return true;
      } else {
        toast.error(data.message || "Failed to update document");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Document deleted successfully!");
        return true;
      } else {
        toast.error(data.message || "Failed to delete document");
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentById = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        toast.error(data.message || "Failed to fetch document");
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDocument = async (documentId, format, customFileName = "") => {
    try {
      const response = await fetch(
        `${API_URL}/documents/${documentId}/${format}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        toast.error(`Failed to download ${format.toUpperCase()}`);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const extension =
        format === "pdf" ? "pdf" : format === "word" ? "docx" : "xlsx";
      a.download = customFileName ? `${customFileName}.${extension}` : `Document_${documentId}.${extension}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(`Error downloading ${format.toUpperCase()}`);
    }
  };

  const previewDocument = async (documentId) => {
    try {
      const response = await fetch(`${API_URL}/documents/${documentId}/pdf`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        toast.error("Failed to load PDF preview");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error(error);
      toast.error("Error previewing document");
    }
  };

  return {
    documents,
    isLoading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    downloadDocument,
    previewDocument,
  };
};
