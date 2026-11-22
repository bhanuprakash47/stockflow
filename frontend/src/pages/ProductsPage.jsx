import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import Modal from '../components/common/Modal';
import ProductTable from '../components/products/ProductTable';
import ProductFormModal from '../components/products/ProductFormModal';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustProductStock,
} from '../api/productApi';
import '../styles/layout.css';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  const loadProducts = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchProducts(search);
      setProducts(data.products || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchProducts()
      .then((data) => {
        if (!ignore) {
          setProducts(data.products || []);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.error || 'Failed to load products.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProducts(searchQuery);
  };

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');

      if (productToEdit) {
        await updateProduct(productToEdit.id, formData);
        setSuccessMessage('Product updated successfully.');
      } else {
        await createProduct(formData);
        setSuccessMessage('Product created successfully.');
      }

      setIsFormModalOpen(false);
      loadProducts(searchQuery);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setError('');
      setSuccessMessage('');
      await deleteProduct(id);
      setSuccessMessage(`Product "${name}" deleted successfully.`);
      loadProducts(searchQuery);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product.');
    }
  };

  const handleOpenAdjustStock = (product) => {
    setProductToAdjust(product);
    setAdjustAmount('');
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustStock = async (e) => {
    e.preventDefault();
    if (!productToAdjust || adjustAmount === '' || isNaN(adjustAmount)) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccessMessage('');
      await adjustProductStock(productToAdjust.id, parseInt(adjustAmount, 10));
      setSuccessMessage(`Stock adjusted for "${productToAdjust.name}".`);
      setIsAdjustModalOpen(false);
      loadProducts(searchQuery);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to adjust stock.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Products Inventory</h1>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenAddModal}
            >
              + Add Product
            </button>
          </div>

          {error && <div className="alert-error">{error}</div>}
          {successMessage && <div className="alert-success">{successMessage}</div>}

          <div className="products-toolbar">
            <form onSubmit={handleSearchSubmit} className="search-box">
              <input
                type="text"
                className="search-input"
                placeholder="Search by Name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">
                Search
              </button>
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    loadProducts('');
                  }}
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          {loading ? (
            <div style={{ padding: '20px' }}>Loading products catalog...</div>
          ) : (
            <ProductTable
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
              onAdjustStock={handleOpenAdjustStock}
            />
          )}

          <ProductFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSave={handleSaveProduct}
            productToEdit={productToEdit}
            isSubmitting={isSubmitting}
          />

          <Modal
            isOpen={isAdjustModalOpen}
            onClose={() => setIsAdjustModalOpen(false)}
            title={`Adjust Stock: ${productToAdjust?.name || ''}`}
          >
            <form onSubmit={handleSaveAdjustStock} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '14px', color: '#4b5563' }}>
                Current Quantity on Hand: <strong>{productToAdjust?.quantityOnHand ?? 0}</strong>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="adjustment">
                  Adjustment Units (+ to add, - to deduct)
                </label>
                <input
                  id="adjustment"
                  type="number"
                  step="1"
                  className="form-input"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="e.g. 5 or -2"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAdjustModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Save Stock'}
                </button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
