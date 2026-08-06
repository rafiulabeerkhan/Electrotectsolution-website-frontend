import { Button } from "flowbite-react";
import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import DataTable from "../../components/DataTable";
import ProductFormModal from "./ProductFormModal";
import { useProducts } from "../../hooks/useProducts";

const Products = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  
  const [formData, setFormData] = useState({
    product_description: "",
    unit: "",
    unit_price: "",
    qty: "",
    total_price: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [id]: value };
      
      // Auto-calculate total price
      if (id === 'qty' || id === 'unit_price') {
        const qty = parseFloat(newData.qty) || 0;
        const price = parseFloat(newData.unit_price) || 0;
        newData.total_price = (qty * price).toFixed(2);
      }
      
      return newData;
    });
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setFormData({ product_description: "", unit: "", unit_price: "", qty: "", total_price: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setCurrentProductId(product.id || product._id);
    setFormData({
      product_description: product.product_description || "",
      unit: product.unit || "",
      unit_price: product.unit_price || "",
      qty: product.qty || "",
      total_price: product.total_price || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse numeric fields for backend
    const payload = {
      ...formData,
      unit_price: parseFloat(formData.unit_price),
      qty: parseFloat(formData.qty),
      total_price: parseFloat(formData.total_price),
    };

    let success = false;
    if (isEditMode) {
      success = await updateProduct(currentProductId, payload);
    } else {
      success = await createProduct(payload);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const tableHead = ["SL", "Description", "Unit", "Unit Price", "Quantity", "Total Price", "Action"];
  
  const columnMapping = {
    Description: "product_description",
    Unit: "unit",
    "Unit Price": "unit_price",
    Quantity: "qty",
    "Total Price": "total_price",
  };

  const actionButtonsConfig = [
    {
      icon: <FaEdit />,
      show: () => true,
      onClick: (row) => openEditModal(row),
    },
    {
      icon: <FaTrash />,
      show: () => true,
      onClick: (row) => deleteProduct(row.id || row._id),
    },
  ];

  const headerConfig = {
    title: "Products Inventory",
    searchPlaceholder: "Search products...",
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your product inventory</p>
        </div>
        <Button onClick={openCreateModal} className="bg-primary-600 hover:bg-primary-700">
          <FaPlus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <DataTable 
        tableHead={tableHead}
        tableData={products}
        columnMapping={columnMapping}
        actionButtonsConfig={actionButtonsConfig}
        headerConfig={headerConfig}
        loading={loading}
      />

      <ProductFormModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isEditMode={isEditMode}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Products;
