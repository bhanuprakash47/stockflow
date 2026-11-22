import './LowStockTable.css';

const LowStockTable = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">Low Stock Items</h2>
        </div>
        <div className="empty-state">
          No low stock items. All inventory levels are above their thresholds.
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">Low Stock Items ({items.length})</h2>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity on Hand</th>
            <th>Low Stock Threshold</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td><strong>{item.name}</strong></td>
              <td><code>{item.sku}</code></td>
              <td>
                <span className={`badge ${item.quantityOnHand === 0 ? 'badge-out' : 'badge-low'}`}>
                  {item.quantityOnHand === 0 ? '0 units (Out of Stock)' : `${item.quantityOnHand} units`}
                </span>
              </td>
              <td>{item.lowStockThreshold} units</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockTable;
