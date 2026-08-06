import { useState, useEffect } from "react";
import { Button, Card, Label, TextInput, Textarea } from "flowbite-react";
import Select from "react-select";
import { FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDocuments } from "../../hooks/useDocuments";
import { useProducts } from "../../hooks/useProducts";
import { useClients } from "../../hooks/useClients";

const typeSingularMap = {
  invoices: "invoice",
  challans: "challan",
  proposals: "proposal"
};

const typeTitleMap = {
  invoices: "Invoice",
  challans: "Challan",
  proposals: "Proposal / Quotation"
};

const CreateDocument = () => {
  const navigate = useNavigate();
  const { type = "invoices", id } = useParams();
  const isEditing = !!id;
  
  const singularType = typeSingularMap[type] || "invoice";
  const title = typeTitleMap[type] || "Document";

  const { createDocument, updateDocument, getDocumentById, isLoading: docLoading } = useDocuments();
  const { products } = useProducts();
  const { clients, fetchClients } = useClients();
  
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const [formData, setFormData] = useState({
    distributor_id: "",
    client_name: "",
    delivery_address: "",
    receiving_person: "Engr. ",
    date: new Date().toISOString().split('T')[0],
    po_no: "",
    invoice_no: "",
    subject: "",
    amount_in_words: "",
    discount: 0,
    tax: 0,
    proposal_terms: "1. Payment: 100% Cash/Cheque with work order.\n2. Work will be complete within [X] working days after receiving the confirmed work order.\n3. Goods sold & once delivered are not returnable.\n4. Proposal Validity: 15 days from the date of quotation.",
    proposal_validity: "15 days",
    currency: "BDT",
  });

  const [items, setItems] = useState([
    { product_id: "", description: "", unit: "Nos", qty: 1, unit_price: 0, total_price: 0 }
  ]);
  
  // Load document data if editing
  useEffect(() => {
    if (isEditing) {
      const loadDoc = async () => {
        const doc = await getDocumentById(id);
        if (doc) {
          setFormData({
            distributor_id: doc.distributor_id || "",
            client_name: doc.client_name || "",
            delivery_address: doc.delivery_address || "",
            receiving_person: doc.receiving_person || "",
            date: doc.date ? new Date(doc.date).toISOString().split('T')[0] : "",
            po_no: doc.po_no || "",
            invoice_no: doc.invoice_no || "",
            subject: doc.subject || "",
            amount_in_words: doc.amount_in_words || "",
            discount: doc.discount || 0,
            tax: doc.tax || 0,
            proposal_terms: doc.proposal_terms || "1. Payment: 100% Cash/Cheque with work order.\n2. Work will be complete within [X] working days after receiving the confirmed work order.\n3. Goods sold & once delivered are not returnable.\n4. Proposal Validity: 15 days from the date of quotation.",
            proposal_validity: doc.proposal_validity || "15 days",
            currency: doc.currency || "BDT",
          });
          if (doc.items && doc.items.length > 0) {
            setItems(doc.items);
          }
        }
      };
      loadDoc();
    }
  }, [id, isEditing]);

  const productOptions = products.map(p => ({
    value: p.id,
    label: p.product_description ? `${p.product_description.substring(0, 40)}...` : `Product #${p.id}`
  }));

  const clientOptions = clients.map(c => ({
    value: c.id,
    label: c.name
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleClientSelect = (selectedOption) => {
    if (!selectedOption) return;
    const client = clients.find(c => c.id === selectedOption.value);
    if (client) {
      setFormData(prev => ({
        ...prev,
        client_name: client.name,
        delivery_address: client.address || "",
        distributor_id: client.distributor_id || "",
        receiving_person: client.receiving_person || "Engr. "
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'qty' || field === 'unit_price') {
      const qty = parseFloat(newItems[index].qty) || 0;
      const price = parseFloat(newItems[index].unit_price) || 0;
      newItems[index].total_price = qty * price;
    }
    
    setItems(newItems);
  };

  const handleProductSelect = (index, selectedOption) => {
    if (!selectedOption) {
      handleItemChange(index, 'product_id', "");
      return;
    }
    
    const productId = selectedOption.value;
    const prod = products.find(p => String(p.id) === String(productId));
    if (prod) {
      const newItems = [...items];
      newItems[index].product_id = prod.id;
      newItems[index].description = prod.product_description || "";
      newItems[index].unit = prod.unit || "Nos";
      newItems[index].unit_price = prod.unit_price || 0;
      
      const qty = parseFloat(newItems[index].qty) || 0;
      const price = parseFloat(prod.unit_price) || 0;
      newItems[index].total_price = qty * price;
      
      setItems(newItems);
    }
  };

  const addItemRow = () => {
    setItems([...items, { product_id: "", description: "", unit: "Nos", qty: 1, unit_price: 0, total_price: 0 }]);
  };

  const removeItemRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0);
  const discountAmount = (subtotal * (parseFloat(formData.discount) || 0)) / 100;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const taxAmount = (subtotalAfterDiscount * (parseFloat(formData.tax) || 0)) / 100;
  const grandTotal = subtotalAfterDiscount + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      type: singularType,
      subtotal,
      grand_total: grandTotal,
      items
    };
    
    let success;
    if (isEditing) {
      success = await updateDocument(id, payload);
    } else {
      success = await createDocument(payload);
    }
    
    if (success) {
      navigate(`/dashboard/documents/${type}`);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Button color="light" onClick={() => navigate(`/dashboard/documents/${type}`)}>
          <FaArrowLeft className="mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? `Edit ${title}` : `Create New ${title}`}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="flex flex-col sm:flex-row justify-between border-b pb-4 mb-4 gap-4">
            <h3 className="text-lg font-semibold dark:border-gray-700">Shipment Information</h3>
            <div className="w-full sm:w-1/2 md:w-1/3">
              <Label value="Select Existing Client to Auto-fill" className="mb-2 block text-blue-600 font-semibold" />
              <Select
                options={clientOptions}
                onChange={handleClientSelect}
                isClearable
                placeholder="Search Client..."
                className="text-gray-900"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label value="Distributor ID" className="mb-2 block" />
              <TextInput name="distributor_id" value={formData.distributor_id} onChange={handleInputChange} placeholder="e.g. DIST-001" />
            </div>
            <div>
              <Label value="Buyer Name" className="mb-2 block" />
              <Textarea name="client_name" value={formData.client_name} onChange={handleInputChange} required rows={2} placeholder="Company Name" />
            </div>
            <div>
              <Label value="Buyer Address" className="mb-2 block" />
              <Textarea name="delivery_address" value={formData.delivery_address} onChange={handleInputChange} required rows={2} placeholder="Address Line 1&#10;City, Country" />
            </div>
            <div>
              <Label value="Receiving Person" className="mb-2 block" />
              <TextInput name="receiving_person" value={formData.receiving_person} onChange={handleInputChange} placeholder="e.g. Engr. John Doe" />
            </div>
            <div>
              <Label value="Work Order / PO No" className="mb-2 block" />
              <TextInput name="po_no" value={formData.po_no} onChange={handleInputChange} placeholder="e.g. PO-2023-05" />
            </div>
            <div>
              <Label value="Invoice No" className="mb-2 block" />
              <TextInput name="invoice_no" value={formData.invoice_no} onChange={handleInputChange} placeholder="e.g. INV-1001" />
            </div>
            <div>
              <Label value="Delivery Date" className="mb-2 block" />
              <TextInput type="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>
            <div>
              <Label value="Subject" className="mb-2 block" />
              <TextInput name="subject" value={formData.subject} onChange={handleInputChange} placeholder={`${title} for Supply of...`} required />
            </div>
            <div>
              <Label value="Currency" className="mb-2 block" />
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </Card>

        {singularType === 'proposal' && (
          <Card>
            <h3 className="text-lg font-semibold border-b pb-2 mb-4 dark:border-gray-700">Proposal Settings</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label value="Proposal Validity" className="mb-2 block" />
                <TextInput name="proposal_validity" value={formData.proposal_validity} onChange={handleInputChange} placeholder="e.g. 15 days" required />
              </div>
              <div>
                <Label value="Terms & Conditions" className="mb-2 block" />
                <Textarea name="proposal_terms" value={formData.proposal_terms} onChange={handleInputChange} required rows={5} />
              </div>
            </div>
          </Card>
        )}

        <Card>
          <div className="flex justify-between items-center border-b pb-2 mb-4 dark:border-gray-700">
            <h3 className="text-lg font-semibold">{title} Items</h3>
            <Button size="sm" color="success" onClick={addItemRow}>
              <FaPlus className="mr-2" /> Add Item
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 w-10">SL</th>
                  <th className="px-4 py-3 min-w-[350px]">Select Product</th>
                  <th className="px-4 py-3 min-w-[250px]">Description</th>
                  <th className="px-4 py-3 w-28">Unit</th>
                  <th className="px-4 py-3 w-28">Qty</th>
                  {singularType !== 'challan' && (
                    <>
                      <th className="px-4 py-3 w-32">Unit Price</th>
                      <th className="px-4 py-3 w-32">Total Price</th>
                    </>
                  )}
                  <th className="px-4 py-3 w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Label value="Product" className="text-xs text-gray-500 font-semibold mb-1" />
                        <Select
                          options={productOptions}
                          value={productOptions.find(opt => opt.value === item.product_id) || null}
                          onChange={(selectedOption) => handleProductSelect(index, selectedOption)}
                          isClearable
                          placeholder="Search..."
                          className="text-gray-900"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Label value="Description" className="text-xs text-gray-500 font-semibold mb-1" />
                        <Textarea 
                          rows={2} 
                          value={item.description} 
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)} 
                          required 
                          placeholder="Enter item description..."
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Label value="Unit" className="text-xs text-gray-500 font-semibold mb-1" />
                        <TextInput 
                          value={item.unit} 
                          onChange={(e) => handleItemChange(index, 'unit', e.target.value)} 
                          required 
                          placeholder="e.g. Nos, kg, ltr"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <Label value="Quantity" className="text-xs text-gray-500 font-semibold mb-1" />
                        <TextInput 
                          type="number" 
                          min="1" 
                          value={item.qty} 
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)} 
                          required 
                          placeholder="Qty"
                        />
                      </div>
                    </td>
                    {singularType !== 'challan' && (
                      <>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <Label value="Unit Price (BDT)" className="text-xs text-gray-500 font-semibold mb-1" />
                            <TextInput 
                              type="number" 
                              step="0.01" 
                              value={item.unit_price} 
                              onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} 
                              required 
                              placeholder="Price"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 font-bold text-gray-900 dark:text-white">
                          <div className="flex flex-col gap-1">
                            <Label value="Total Price" className="text-xs text-gray-500 font-semibold mb-1" />
                            <span>{Number(item.total_price || 0).toFixed(2)}</span>
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-4 py-2 text-center">
                      <Button color="failure" size="xs" onClick={() => removeItemRow(index)} disabled={items.length === 1}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {singularType !== 'challan' && (
            <div className="flex flex-col items-end mt-6 pt-4 border-t dark:border-gray-700 gap-3">
              <div className="flex items-center gap-4 w-full md:w-1/2 lg:w-1/3 justify-between">
                <span className="font-semibold text-gray-600">Subtotal:</span>
                <span>{Number(subtotal || 0).toFixed(2)} {formData.currency}</span>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-1/2 lg:w-1/3 justify-between">
                <span className="font-semibold text-gray-600">Discount (%):</span>
                <TextInput 
                  type="number" 
                  name="discount"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.discount} 
                  onChange={handleInputChange} 
                  className="w-24 text-right"
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-1/2 lg:w-1/3 justify-between">
                <span className="font-semibold text-gray-600">Tax/VAT (%):</span>
                <TextInput 
                  type="number" 
                  name="tax"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.tax} 
                  onChange={handleInputChange} 
                  className="w-24 text-right"
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-1/2 lg:w-1/3 justify-between mt-2 pt-2 border-t text-xl font-bold dark:text-white">
                <span>Grand Total:</span>
                <span className="text-primary-600">{Number(grandTotal || 0).toFixed(2)} {formData.currency}</span>
              </div>
            </div>
          )}
        </Card>

        {singularType !== 'challan' && (
          <Card>
            <div className="flex flex-col gap-2">
              <Label value="Amount In Words (Leave blank to auto-generate from grand total)" />
              <TextInput 
                name="amount_in_words" 
                value={formData.amount_in_words} 
                onChange={handleInputChange} 
                placeholder="e.g. One Lac Eight Thousand BDT Taka Only" 
              />
            </div>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" size="xl" disabled={docLoading} className="bg-primary-600 hover:bg-primary-700">
            {docLoading ? "Saving..." : `Save ${title}`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDocument;
