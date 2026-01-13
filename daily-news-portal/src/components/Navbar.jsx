import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <span className="brand-badge" />
          <span>Daily News Portal</span>
        </div>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink
            to="/admin/articles"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
