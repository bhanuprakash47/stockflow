import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import './ProductFormModal.css';

const ProductFormModal = ({ isOpen, onClose, onSave, productToEdit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantityOnHand: 0,
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        sku: productToEdit.sku || '',
        description: productToEdit.description || '',
        quantityOnHand: productToEdit.quantityOnHand !== undefined ? productToEdit.quantityOnHand : 0,
        costPrice: productToEdit.costPrice !== null && productToEdit.costPrice !== undefined ? productToEdit.costPrice : '',
        sellingPrice: productToEdit.sellingPrice !== null && productToEdit.sellingPrice !== undefined ? productToEdit.sellingPrice : '',
        lowStockThreshold: productToEdit.lowStockThreshold !== null && productToEdit.lowStockThreshold !== undefined ? productToEdit.lowStockThreshold : '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        quantityOnHand: 0,
        costPrice: '',
        sellingPrice: '',
        lowStockThreshold: '',
      });
    }
    setFormError('');
  }, [productToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.sku.trim()) {
      setFormError('Product Name and SKU are required.');
      return;
    }

    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Edit Product' : 'Add New Product'}
    >
      {formError && <div className="alert-error">{formError}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label className="form-label" htmlFor="name">Product Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Mechanical Keyboard"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="sku">SKU *</label>
            <input
              id="sku"
              name="sku"
              type="text"
              className="form-input"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. KB-100"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="quantityOnHand">Quantity on Hand *</label>
            <input
              id="quantityOnHand"
              name="quantityOnHand"
              type="number"
              min="0"
              step="1"
              className="form-input"
              value={formData.quantityOnHand}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="costPrice">Cost Price ($)</label>
            <input
              id="costPrice"
              name="costPrice"
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              value={formData.costPrice}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sellingPrice">Selling Price ($)</label>
            <input
              id="sellingPrice"
              name="sellingPrice"
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              value={formData.sellingPrice}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="lowStockThreshold">Low Stock Threshold</label>
          <input
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            step="1"
            className="form-input"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            placeholder="Leave blank to use store default"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="form-input"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional product notes or specifications..."
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (productToEdit ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
