import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import LowStockTable from '../components/dashboard/LowStockTable';
import { fetchDashboard } from '../api/dashboardApi';
import '../styles/layout.css';
import './DashboardPage.css';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalQuantityOnHand: 0,
    lowStockCount: 0,
    lowStockItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchDashboard();
      setMetrics(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchDashboard()
      .then((data) => {
        if (!ignore) {
          setMetrics(data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.response?.data?.error || 'Failed to load dashboard metrics.');
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

  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Dashboard Overview</h1>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={loadDashboardData}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {error && <div className="alert-error">{error}</div>}

          {loading ? (
            <div style={{ padding: '20px' }}>Loading inventory summary...</div>
          ) : (
            <div className="dashboard-container">
              <div className="stats-grid">
                <StatCard
                  title="Total Products"
                  value={metrics.totalProducts}
                />
                <StatCard
                  title="Total Units on Hand"
                  value={metrics.totalQuantityOnHand}
                />
                <StatCard
                  title="Low Stock Alerts"
                  value={metrics.lowStockCount}
                  isWarning={metrics.lowStockCount > 0}
                />
              </div>

              <LowStockTable items={metrics.lowStockItems} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
