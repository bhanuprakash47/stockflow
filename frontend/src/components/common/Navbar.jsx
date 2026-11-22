import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-title">StockFlow</Link>
        {user?.organization?.name && (
          <span className="org-badge">{user.organization.name}</span>
        )}
      </div>

      <div className="navbar-user">
        <span className="user-email">{user?.email}</span>
        <button type="button" onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
