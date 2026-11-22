import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { fetchSettings, updateSettings } from '../api/settingsApi';
import '../styles/layout.css';
import './SettingsPage.css';

const SettingsPage = () => {
  const [defaultThreshold, setDefaultThreshold] = useState(5);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchSettings();
      if (data.setting && data.setting.defaultLowStockThreshold !== undefined) {
        setDefaultThreshold(data.setting.defaultLowStockThreshold);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load store settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const parsed = parseInt(defaultThreshold, 10);
    if (isNaN(parsed) || parsed < 0) {
      setError('Threshold must be a non-negative whole number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await updateSettings({ defaultLowStockThreshold: parsed });
      setDefaultThreshold(data.setting.defaultLowStockThreshold);
      setSuccessMessage('Store settings updated successfully.');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update settings.');
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
            <h1 className="page-title">Store Settings</h1>
          </div>

          {error && <div className="alert-error">{error}</div>}
          {successMessage && <div className="alert-success">{successMessage}</div>}

          {loading ? (
            <div style={{ padding: '20px' }}>Loading settings...</div>
          ) : (
            <div className="settings-card">
              <p className="settings-description">
                Configure your organization's global low stock default. If an individual product does not specify its own low stock threshold, this default value will be used across your dashboard and inventory alerts.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="threshold">
                    Default Low Stock Threshold (units)
                  </label>
                  <input
                    id="threshold"
                    type="number"
                    min="0"
                    step="1"
                    className="form-input"
                    value={defaultThreshold}
                    onChange={(e) => setDefaultThreshold(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
