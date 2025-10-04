"use client"

import { GButton, GDatePicker, GInput, GInputSearch, GSelect, GTable, GTextArea } from "@gal-ui/components";
import { Form, Row, Col, Modal } from "antd";
import { useState } from "react";
import ConfirmationModal from "@/components/ConfirmationModal";

// Dummy data for available products
const availableProducts = [
  { key: 1, sku: "PROD0001", productName: "Macbook M1 Air", productPrice: "IDR 50.000", productQty: 500 },
  { key: 2, sku: "PROD7718", productName: "Raket Badminton", productPrice: "IDR 60.000", productQty: 300 },
  { key: 3, sku: "PROD7719", productName: "Jersey Arsenal L", productPrice: "IDR 50.000", productQty: 223 },
  { key: 4, sku: "PROD6618", productName: "TWS ABC Super", productPrice: "IDR 60.000", productQty: 122 },
  { key: 5, sku: "PROD1718", productName: "Macbook M1 Air", productPrice: "IDR 100.000", productQty: 1300 },
  { key: 6, sku: "PROD1719", productName: "Raket Badminton", productPrice: "IDR 35.000", productQty: 4000 },
  { key: 7, sku: "PROD1720", productName: "Sepatu Badminton L", productPrice: "IDR 40.000", productQty: 2700 },
];

interface CampaignFormProps {
  mode: "create" | "edit" | "view";
  status?: "Draft" | "Upcoming" | "Ongoing" | "Ended" | "Cancelled";
  initialData?: any;
  onBack?: () => void;
  onSaveDraft?: (data: any) => void;
  onSaveSchedule?: (data: any) => void;
  onPublish?: (data: any) => void;
  onCancel?: (data: any) => void;
}

const CampaignForm = ({
  mode,
  status,
  initialData,
  onBack,
  onSaveDraft,
  onSaveSchedule,
  onPublish,
  onCancel,
}: CampaignFormProps) => {
  const [products, setProducts] = useState(initialData?.products || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Life/Fashion");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Determine if form should be disabled
  const isDisabled = mode === "view" && (status === "Upcoming" || status === "Ongoing" || status === "Ended" || status === "Cancelled");
  const isEditable = mode === "create" || (mode === "edit" && status === "Draft") || (mode === "view" && status === "Draft");

  const calculateFinalPrice = (productPrice: string, discount: string, discountType: string) => {
    const priceValue = parseFloat(productPrice.replace(/[^\d]/g, ""));

    if (!discount || isNaN(priceValue)) {
      return productPrice;
    }

    let finalPrice = priceValue;

    if (discountType === "Percentage") {
      const percentValue = parseFloat(discount.replace(/[^\d]/g, ""));
      if (!isNaN(percentValue)) {
        finalPrice = priceValue - (priceValue * percentValue / 100);
      }
    } else if (discountType === "Nominal") {
      const nominalValue = parseFloat(discount.replace(/[^\d]/g, ""));
      if (!isNaN(nominalValue)) {
        finalPrice = priceValue - nominalValue;
      }
    }

    finalPrice = Math.max(0, finalPrice);
    const formattedPrice = Math.round(finalPrice).toLocaleString('id-ID');
    return `IDR ${formattedPrice}`;
  };

  const handleProductChange = (key: number, field: string, value: any) => {
    setProducts((prevProducts: any[]) =>
      prevProducts.map(product => {
        if (product.key === key) {
          let updatedProduct = { ...product };

          if (field === "discountType") {
            updatedProduct = { ...product, [field]: value, discount: "", finalPrice: product.productPrice };
          } else if (field === "flashSaleQty") {
            const qty = parseInt(value) || 0;
            const maxQty = product.productQty;
            updatedProduct = { ...product, [field]: Math.min(qty, maxQty) };
          } else {
            updatedProduct = { ...product, [field]: value };
          }

          if (field === "discount" || field === "discountType") {
            updatedProduct.finalPrice = calculateFinalPrice(
              updatedProduct.productPrice,
              updatedProduct.discount,
              updatedProduct.discountType
            );
          }

          return updatedProduct;
        }
        return product;
      })
    );
  };

  const handleDiscountChange = (key: number, value: string, discountType: string, productPrice: string) => {
    let validatedValue = value;

    if (discountType === "Percentage") {
      const numericValue = value.replace(/[^\d]/g, "");

      if (numericValue) {
        const percentValue = parseInt(numericValue);
        if (percentValue > 100) {
          validatedValue = "100%";
        } else {
          validatedValue = `${percentValue}%`;
        }
      } else {
        validatedValue = "";
      }
    } else if (discountType === "Nominal") {
      const numericValue = value.replace(/[^\d.]/g, "");
      validatedValue = numericValue;
    }

    setProducts((prevProducts: any[]) =>
      prevProducts.map(product => {
        if (product.key === key) {
          const finalPrice = calculateFinalPrice(productPrice, validatedValue, discountType);
          return { ...product, discount: validatedValue, finalPrice };
        }
        return product;
      })
    );
  };

  const handleDeleteProduct = (key: number) => {
    setProducts((prevProducts: any[]) => prevProducts.filter(product => product.key !== key));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSaveAsSchedule = () => {
    setIsScheduleModalOpen(true);
  };

  const handleConfirmSchedule = () => {
    onSaveSchedule?.(products);
    setIsScheduleModalOpen(false);
  };

  const handleSaveAsDraft = () => {
    setIsDraftModalOpen(true);
  };

  const handleConfirmDraft = () => {
    onSaveDraft?.(products);
    setIsDraftModalOpen(false);
  };

  const handlePublishCampaign = () => {
    setIsPublishModalOpen(true);
  };

  const handleConfirmPublish = () => {
    onPublish?.(products);
    setIsPublishModalOpen(false);
  };

  const handleCancelCampaign = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    onCancel?.(products);
    setIsCancelModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProducts([]);
    setSearchQuery("");
  };

  const handleSelectProduct = (key: number) => {
    setSelectedProducts(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredAvailableProducts.map(p => p.key));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleAddProductsToCampaign = () => {
    const productsToAdd = availableProducts
      .filter(p => selectedProducts.includes(p.key))
      .map(p => ({
        key: products.length + p.key,
        productName: p.productName,
        sku: p.sku,
        productPrice: p.productPrice,
        productQty: p.productQty,
        discountType: "Percentage",
        discount: "",
        flashSaleQty: 0,
        finalPrice: p.productPrice,
      }));

    setProducts([...products, ...productsToAdd]);
    handleCloseModal();
  };

  const filteredAvailableProducts = availableProducts.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const modalColumns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedProducts.length === filteredAvailableProducts.length && filteredAvailableProducts.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 cursor-pointer"
        />
      ),
      dataIndex: "checkbox",
      key: "checkbox",
      width: 50,
      render: (_: any, record: any) => (
        <input
          type="checkbox"
          checked={selectedProducts.includes(record.key)}
          onChange={() => handleSelectProduct(record.key)}
          className="w-4 h-4 cursor-pointer"
        />
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product Price",
      dataIndex: "productPrice",
      key: "productPrice",
    },
    {
      title: "Product Qty",
      dataIndex: "productQty",
      key: "productQty",
    },
  ];

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Product Price",
      dataIndex: "productPrice",
      key: "productPrice",
    },
    {
      title: "Product Qty",
      dataIndex: "productQty",
      key: "productQty",
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
      render: (_: any, record: any) => (
        <GSelect
          value={record.discountType}
          onChange={(value) => handleProductChange(record.key, "discountType", value)}
          options={[
            { label: "Percentage", value: "Percentage" },
            { label: "Nominal", value: "Nominal" },
          ]}
          customClassName="!w-[140px]"
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (_: any, record: any) => (
        <GInput
          value={record.discount}
          onChange={(e) => handleDiscountChange(record.key, e.target.value, record.discountType, record.productPrice)}
          placeholder={record.discountType === "Percentage" ? "0%" : "0"}
          customClassName="!w-[100px]"
          disabled={!isEditable}
        />
      ),
    },
    {
      title: "Flash Sale Qty",
      dataIndex: "flashSaleQty",
      key: "flashSaleQty",
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <GInput
            type="number"
            value={record.flashSaleQty}
            onChange={(e) => handleProductChange(record.key, "flashSaleQty", e.target.value)}
            customClassName="!w-[80px]"
            max={record.productQty}
            disabled={!isEditable}
          />
          {record.flashSaleQty > record.productQty && (
            <span className="text-xs text-red-500 mt-1">Max: {record.productQty}</span>
          )}
        </div>
      ),
    },
    {
      title: "Final Price",
      dataIndex: "finalPrice",
      key: "finalPrice",
    },
    ...(isEditable ? [{
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => handleDeleteProduct(record.key)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ),
    }] : []),
  ];

  // Render action buttons based on status
  const renderActionButtons = () => {
    if (status === "Ended" || status === "Cancelled") {
      return (
        <div className="flex justify-between mt-[20px]">
          <GButton btn_type='secondary-gray' onClick={onBack}>Back</GButton>
        </div>
      );
    }

    if (status === "Ongoing") {
      return (
        <div className="flex justify-between mt-[20px]">
          <GButton btn_type='secondary-gray' onClick={onBack}>Back</GButton>
          <GButton btn_type="destructive" onClick={handleCancelCampaign}>Cancel Campaign</GButton>
        </div>
      );
    }

    if (status === "Upcoming") {
      return (
        <div className="flex justify-between mt-[20px]">
          <GButton btn_type='secondary-gray' onClick={onBack}>Back</GButton>
          <div className="flex gap-[10px]">
            <GButton btn_type="destructive" onClick={handleCancelCampaign}>Cancel Campaign</GButton>
            <GButton btn_type="primary" onClick={handlePublishCampaign}>Publish Campaign</GButton>
          </div>
        </div>
      );
    }

    // Draft or Create mode
    return (
      <div className="flex justify-between mt-[20px]">
        <GButton btn_type='secondary-gray' onClick={onBack}>Cancel</GButton>
        <div className="flex gap-[10px]">
          <GButton btn_type='secondary-color' onClick={handleSaveAsSchedule}>Save as Schedule</GButton>
          <GButton btn_type="primary" onClick={handleSaveAsDraft}>Save as Draft</GButton>
        </div>
      </div>
    );
  };

  return (
    <div className="p-[30px]">
      <h1 className="text-xl font-bold mb-[20px]">Campaign Information</h1>
      <div className="border-[1px] border-border-primary rounded-[12px] p-[20px]">
        <Form layout="vertical" initialValues={initialData}>
          <Form.Item label="Campaign Name" name={"campaignName"} rules={[{ required: true, message: "Please input campaign name" }]}>
            <GInput placeholder="Campaign Name" disabled={isDisabled} />
          </Form.Item>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name={"startDate"} label="Start Date" rules={[{ required: true, message: "Please select start date" }]}>
                <GDatePicker showTime format="DD MMM YYYY, HH:mm a" shadow={false} customClassName="!w-full" disabled={isDisabled} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"endDate"} label="End Date" rules={[{ required: true, message: "Please select end date" }]}>
                <GDatePicker showTime format="DD MMM YYYY, HH:mm a" shadow={false} customClassName="!w-full" disabled={isDisabled} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Description" name={"description"} rules={[{ required: true, message: "Please input description" }]}>
            <GTextArea customSize='xl' placeholder="Description" disabled={isDisabled} />
          </Form.Item>
        </Form>
      </div>

      <h1 className="text-xl font-bold my-[20px]">List of Product</h1>
      <div>
        <GTable
          customHeader={
            <div className="flex items-center justify-between">
              <h1>{products.length}/6 Product Added</h1>
              {isEditable && <GButton btn_type="primary" onClick={handleOpenModal}>Add Product</GButton>}
            </div>
          }
          columns={columns}
          dataSource={products}
        />

        {renderActionButtons()}
      </div>

      {/* Add Product Modal */}
      {isEditable && (
        <Modal
          title="Add Product"
          open={isModalOpen}
          onCancel={handleCloseModal}
          width={900}
          footer={[
            <button
              key="cancel"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
            >
              Cancel
            </button>,
            <button
              key="submit"
              onClick={handleAddProductsToCampaign}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Product to Campaign
            </button>,
          ]}
        >
          <div className="space-y-4">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <label className="block text-sm font-medium mb-2">Categories</label>
                  <GSelect
                    value={selectedCategory}
                    onChange={(value) => setSelectedCategory(value)}
                    options={[
                      { label: "Life/Fashion", value: "Life/Fashion" },
                      { label: "Electronics", value: "Electronics" },
                      { label: "Sports", value: "Sports" },
                    ]}
                    customClassName="!w-full"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <label className="block text-sm font-medium mb-2">Search Product</label>
                  <GInputSearch
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </Col>
            </Row>

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">
                {selectedProducts.length}/{filteredAvailableProducts.length} Product Selected
              </p>
              <GTable
                columns={modalColumns}
                dataSource={filteredAvailableProducts}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                }}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Save as Schedule Confirmation Modal */}
      <ConfirmationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirm={handleConfirmSchedule}
        title="Save as Scheduled Campaign"
        description="By saving this campaign as Scheduled, the status will be changed to Upcoming and all data will be lock as non editable. Are you sure want to schedule this campaign?"
        confirmText="Schedule"
        cancelText="Cancel"
        confirmButtonType="destructive"
      />

      {/* Save as Draft Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        onConfirm={handleConfirmDraft}
        title="Save as Draft Campaign"
        description="By saving this campaign as Draft, you can continue editing it later. The campaign will not be published until you schedule or publish it. Are you sure want to save as draft?"
        confirmText="Save as Draft"
        cancelText="Cancel"
        confirmButtonType="primary"
      />

      {/* Publish Campaign Confirmation Modal */}
      <ConfirmationModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handleConfirmPublish}
        title="Publish Campaign"
        description="By publishing this campaign, it will go live immediately and customers will be able to see and purchase products. Are you sure want to publish this campaign?"
        confirmText="Publish"
        cancelText="Cancel"
        confirmButtonType="primary"
      />

      {/* Cancel Campaign Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Campaign"
        description="By cancelling this campaign, it will be stopped immediately and customers will no longer be able to purchase products. This action cannot be undone. Are you sure want to cancel this campaign?"
        confirmText="Cancel Campaign"
        cancelText="Go Back"
        confirmButtonType="destructive"
      />
    </div>
  );
};

export default CampaignForm;
