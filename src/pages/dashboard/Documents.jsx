import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  FaPlus,
  FaFilePdf,
  FaFileWord,
  FaEye,
  FaFileExcel,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import DataTable from "../../components/DataTable";
import { useDocuments } from "../../hooks/useDocuments";
import { usePaginationStore } from "../../store/paginationStore";

const typeSingularMap = {
  invoices: "invoice",
  challans: "challan",
  proposals: "proposal",
};

const typeTitleMap = {
  invoices: "Invoices",
  challans: "Challans",
  proposals: "Quotations",
};

const Documents = () => {
  const { type = "invoices" } = useParams();
  const singularType = typeSingularMap[type] || "invoice";
  const title = typeTitleMap[type] || "Documents";

  const {
    documents,
    fetchDocuments,
    isLoading,
    downloadDocument,
    previewDocument,
    deleteDocument,
  } = useDocuments();
  const { page, limit, search, setPage } = usePaginationStore();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      const success = await deleteDocument(id);
      if (success) {
        fetchDocuments(singularType);
      }
    }
  };

  useEffect(() => {
    fetchDocuments(singularType);
    setPage(1); // Reset page on type change
  }, [fetchDocuments, singularType, setPage]);

  const filteredDocuments = documents.filter((doc) => {
    const searchTerm = search.toLowerCase();
    return (
      doc.bill_no?.toLowerCase().includes(searchTerm) ||
      doc.client_name?.toLowerCase().includes(searchTerm)
    );
  });

  const paginatedDocuments = filteredDocuments.slice(
    (page - 1) * limit,
    page * limit,
  );

  const formattedDocuments = paginatedDocuments.map((doc) => {
    const symbol = doc.currency === "USD" ? "$" : "৳";
    return {
      ...doc,
      formatted_date: new Date(doc.date).toLocaleDateString(),
      formatted_total: `${symbol} ${Number(doc.grand_total || 0).toFixed(2)}`,
    };
  });

  const tableHead = [
    "SL",
    "Document No",
    "Client Name",
    "Date",
    "Grand Total",
    "Action",
  ];

  const columnMapping = {
    "Document No": "bill_no",
    "Client Name": "client_name",
    Date: "formatted_date",
    "Grand Total": "formatted_total",
  };

  const getFileName = (row) => {
    const baseName = row.bill_no ? `${row.bill_no}_${row.client_name || "Document"}` : `Document_${row.id}`;
    return baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  };

  const actionButtonsConfig = [
    {
      icon: (
        <span
          className="flex items-center text-gray-500 hover:text-gray-700"
          title="View"
        >
          <FaEye size={18} />
        </span>
      ),
      show: () => true,
      onClick: (row) => previewDocument(row.id),
    },
    {
      icon: (
        <span
          className="flex items-center text-red-500 hover:text-red-700"
          title="Download PDF"
        >
          <FaFilePdf size={18} />
        </span>
      ),
      show: () => true,
      onClick: (row) => downloadDocument(row.id, "pdf", getFileName(row)),
    },
    {
      icon: (
        <span
          className="flex items-center text-blue-500 hover:text-blue-700"
          title="Download Word"
        >
          <FaFileWord size={18} />
        </span>
      ),
      show: () => true,
      onClick: (row) => downloadDocument(row.id, "word", getFileName(row)),
    },
    {
      icon: (
        <span
          className="flex items-center text-green-600 hover:text-green-800"
          title="Download Excel"
        >
          <FaFileExcel size={18} />
        </span>
      ),
      show: () => true,
      onClick: (row) => downloadDocument(row.id, "excel", getFileName(row)),
    },
    {
      icon: (
        <span
          className="flex items-center text-green-500 hover:text-green-700"
          title="Edit"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 576 512"
            height="18"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
          </svg>
        </span>
      ),
      show: () => true,
      onClick: (row) => navigate(`/dashboard/documents/${type}/edit/${row.id}`),
    },
    {
      icon: (
        <span
          className="flex items-center text-red-600 hover:text-red-800"
          title="Delete"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 448 512"
            height="18"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path>
          </svg>
        </span>
      ),
      show: () => true,
      onClick: (row) => handleDelete(row.id),
    },
  ];

  const headerConfig = {
    title: title,
    searchPlaceholder: `Search ${title.toLowerCase()}...`,
  };

  useEffect(() => {
    usePaginationStore.getState().setTotalData(filteredDocuments.length);
  }, [filteredDocuments.length]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <Button
          onClick={() => navigate(`/dashboard/documents/${type}/create`)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <DataTable
        tableHead={tableHead}
        tableData={formattedDocuments}
        columnMapping={columnMapping}
        actionButtonsConfig={actionButtonsConfig}
        headerConfig={headerConfig}
        loading={isLoading}
      />
    </div>
  );
};

export default Documents;
