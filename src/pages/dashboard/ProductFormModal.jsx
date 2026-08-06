import { Button, TextInput, Textarea } from "flowbite-react";
import CustomModal from "../../components/CustomModal";

const ProductFormModal = ({
  isModalOpen,
  setIsModalOpen,
  isEditMode,
  formData,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <CustomModal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      header={isEditMode ? "Edit Product" : "Add New Product"}
      closedBy="both"
      width="w-full max-w-2xl"
    >
      <form className="space-y-4" onSubmit={handleSubmit} id="productForm">
        {/* Instructional Label */}
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
          <span className="font-semibold text-primary-600 dark:text-primary-400">Note:</span> The Total Price is automatically calculated when you enter the Quantity and Unit Price.
        </div>
        
        <div>
          <div className="mb-2 block">
            <label htmlFor="product_description" className="text-sm font-medium text-gray-900 dark:text-white">Product Description</label>
          </div>
          <Textarea
            id="product_description"
            value={formData.product_description}
            onChange={handleInputChange}
            required
            placeholder="Sample product description"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <label htmlFor="unit" className="text-sm font-medium text-gray-900 dark:text-white">Unit</label>
            </div>
            <TextInput
              id="unit"
              value={formData.unit}
              onChange={handleInputChange}
              required
              placeholder="e.g. pcs, kg, box"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <label htmlFor="unit_price" className="text-sm font-medium text-gray-900 dark:text-white">Unit Price</label>
            </div>
            <TextInput
              id="unit_price"
              type="number"
              step="0.01"
              value={formData.unit_price}
              onChange={handleInputChange}
              required
              placeholder="0.00"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 block">
              <label htmlFor="qty" className="text-sm font-medium text-gray-900 dark:text-white">Quantity</label>
            </div>
            <TextInput
              id="qty"
              type="number"
              value={formData.qty}
              onChange={handleInputChange}
              required
              placeholder="0"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <label htmlFor="total_price" className="text-sm font-medium text-gray-900 dark:text-white">Total Price (Auto-calculated)</label>
            </div>
            <TextInput
              id="total_price"
              type="number"
              step="0.01"
              value={formData.total_price}
              onChange={handleInputChange}
              readOnly
              className="bg-gray-100 cursor-not-allowed dark:bg-gray-700"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
            {isEditMode ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
};

export default ProductFormModal;
