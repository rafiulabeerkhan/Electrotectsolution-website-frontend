import { Button, TextInput, Select, FileInput } from "flowbite-react";
import CustomModal from "../../components/CustomModal";

const UserFormModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  modalMode = "create",
}) => {
  const isView = modalMode === "view";
  const title = modalMode === "create" ? "Add New User" : modalMode === "edit" ? "Edit User" : "View User";
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.replace(/\/api\/?$/, "");

  return (
    <CustomModal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      header={title}
      closedBy="both"
      width="w-full max-w-4xl"
    >
      <form className="space-y-4" onSubmit={handleSubmit} id="userForm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <label htmlFor="name" className="text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
            </div>
            <TextInput
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isView}
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <div className="mb-2 block">
              <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
            </div>
            <TextInput
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isView}
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <label htmlFor="role" className="text-sm font-medium text-gray-900 dark:text-white">Role</label>
            </div>
            <Select
              id="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              disabled={isView}
            >
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </div>

          <div>
            <div className="mb-2 block">
              <label htmlFor="phone_number" className="text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
            </div>
            <TextInput
              id="phone_number"
              value={formData.phone_number || ""}
              onChange={handleInputChange}
              disabled={isView}
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        {!isView && (
          <div>
            <div className="mb-2 block">
              <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
                {modalMode === "edit" ? "Password (leave blank to keep)" : "Password"}
              </label>
            </div>
            <TextInput
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required={modalMode === "create"}
              placeholder="••••••••"
            />
          </div>
        )}

        <div>
          <div className="mb-2 block">
            <label htmlFor="signature_photo" className="text-sm font-medium text-gray-900 dark:text-white">Signature Photo</label>
          </div>
          <div className="flex flex-col gap-4">
             {formData.signature_photo ? (
                <div>
                   <img 
                     src={typeof formData.signature_photo === 'string' 
                       ? `${baseUrl}${formData.signature_photo.replace(/\\/g, '/').startsWith('/') ? '' : '/'}${formData.signature_photo.replace(/\\/g, '/')}` 
                       : URL.createObjectURL(formData.signature_photo)} 
                     alt="Signature" 
                     className="max-h-32 object-contain rounded border border-gray-200" 
                   />
                </div>
             ) : (
                isView && <p className="text-sm text-gray-500">No signature photo uploaded.</p>
             )}

             {!isView && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">{formData.signature_photo ? "Upload new photo to replace:" : "Upload photo:"}</p>
                  <FileInput
                     id="signature_photo"
                     onChange={handleFileChange}
                     accept="image/*"
                  />
                </div>
             )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            {isView ? "Close" : "Cancel"}
          </Button>
          {!isView && (
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
              {modalMode === "create" ? "Create User" : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </CustomModal>
  );
};

export default UserFormModal;
