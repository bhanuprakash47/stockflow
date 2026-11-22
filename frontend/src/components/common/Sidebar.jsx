import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/products"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        Products
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
      >
        Settings
      </NavLink>
    </aside>
  );
};

export default Sidebar;
