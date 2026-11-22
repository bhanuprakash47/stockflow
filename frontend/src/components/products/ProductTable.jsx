import React from 'react';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete, onAdjustStock }) => {
  if (!products || products.length === 0) {
    return (
      <div className="product-table-wrapper" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        No products found. Click "Add Product" to create your first inventory item.
      </div>
    );
  }

  return (
    <div className="product-table-wrapper">
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity on Hand</th>
            <th>Status</th>
            <th>Cost Price</th>
            <th>Selling Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div>
                  <strong>{product.name}</strong>
                  {product.description && (
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {product.description}
                    </div>
                  )}
                </div>
              </td>
              <td><code>{product.sku}</code></td>
              <td><strong>{product.quantityOnHand}</strong></td>
              <td>
                {product.quantityOnHand === 0 ? (
                  <span className="badge badge-out">Out of Stock</span>
                ) : product.isLowStock ? (
                  <span className="badge badge-low">Low Stock</span>
                ) : (
                  <span className="badge badge-ok">In Stock</span>
                )}
              </td>
              <td>{product.costPrice !== null ? `$${parseFloat(product.costPrice).toFixed(2)}` : '-'}</td>
              <td>{product.sellingPrice !== null ? `$${parseFloat(product.sellingPrice).toFixed(2)}` : '-'}</td>
              <td>
                <div className="product-table-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onAdjustStock(product)}
                  >
                    Adjust Stock
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(product.id, product.name)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
