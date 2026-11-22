import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">The page you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '8px' }}>
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
