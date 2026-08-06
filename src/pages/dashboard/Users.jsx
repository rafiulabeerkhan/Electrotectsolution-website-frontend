import { Button } from "flowbite-react";
import { useState } from "react";
import { FaPlus, FaEdit, FaEye } from "react-icons/fa";
import DataTable from "../../components/DataTable";
import UserFormModal from "./UserFormModal";
import { useUsers } from "../../hooks/useUsers";

const Users = () => {
  const { users, loading, createUser, updateUser } = useUsers();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MANAGER",
    phone_number: "",
    signature_photo: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, signature_photo: file }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const openCreateModal = () => {
    setModalMode("create");
    setFormData({ name: "", email: "", password: "", role: "MANAGER", phone_number: "", signature_photo: null });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode("edit");
    setSelectedUserId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", 
      role: user.role || "MANAGER",
      phone_number: user.phone_number || "",
      signature_photo: null,
    });
    setIsModalOpen(true);
  };

  const openViewModal = (user) => {
    setModalMode("view");
    setSelectedUserId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "MANAGER",
      phone_number: user.phone_number || "",
      signature_photo: user.signature_photo || null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === "view") {
      setIsModalOpen(false);
      return;
    }
    
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    if (formData.password) {
      submitData.append("password", formData.password);
    }
    submitData.append("role", formData.role);
    if (formData.phone_number) {
      submitData.append("phone_number", formData.phone_number);
    }
    if (formData.signature_photo && typeof formData.signature_photo === 'object') {
      submitData.append("signature_photo", formData.signature_photo);
    }

    let success = false;
    if (modalMode === "create") {
      success = await createUser(submitData);
    } else if (modalMode === "edit") {
      success = await updateUser(selectedUserId, submitData);
    }
    
    if (success) {
      setIsModalOpen(false);
    }
  };

  const tableHead = ["SL", "Name", "Email", "Role", "Phone Number", "Signature", "Created At", "Action"];
  
  const columnMapping = {
    Name: "name",
    Email: "email",
    Role: "role",
    "Phone Number": "phone_number",
    Signature: "signature_photo_display",
    "Created At": "created_at",
  };

  const actionButtonsConfig = [
    {
      icon: <FaEye />,
      onClick: openViewModal,
      show: () => true,
    },
    {
      icon: <FaEdit />,
      onClick: openEditModal,
      show: () => true,
    },
  ];

  const headerConfig = {
    title: "User Management",
    searchPlaceholder: "Search users...",
  };

  // Format dates in the users array
  const formattedUsers = users.map(user => ({
    ...user,
    created_at: new Date(user.created_at).toLocaleDateString(),
    signature_photo_display: user.signature_photo ? "Uploaded" : "None",
  }));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage system users and managers</p>
        </div>
        <Button onClick={openCreateModal} className="bg-primary-600 hover:bg-primary-700">
          <FaPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      <DataTable 
        tableHead={tableHead}
        tableData={formattedUsers}
        columnMapping={columnMapping}
        actionButtonsConfig={actionButtonsConfig}
        headerConfig={headerConfig}
        loading={loading}
      />

      <UserFormModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        modalMode={modalMode}
      />
    </div>
  );
};

export default Users;
