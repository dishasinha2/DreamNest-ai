import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <h1>🏠 DreamNestAI</h1>
      </Link>
      
      <div className="navbar-user">
        <span>Welcome, {user.name}</span>
        <Link to="/create-project" className="btn-primary" style={{ padding: '8px 15px', textDecoration: 'none' }}>
          + New Project
        </Link>
        <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 15px' }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;