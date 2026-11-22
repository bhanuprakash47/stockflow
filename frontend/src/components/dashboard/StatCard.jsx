import './StatCard.css';

const StatCard = ({ title, value, isWarning = false }) => {
  return (
    <div className="stat-card">
      <span className="stat-label">{title}</span>
      <span className={`stat-value ${isWarning ? 'warning' : ''}`}>{value}</span>
    </div>
  );
};

export default StatCard;
