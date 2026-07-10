import React from 'react';
import { LayoutDashboard, CreditCard, ShieldAlert, Settings, LogOut } from 'lucide-react';

/* 1. Catch the props sent from App.jsx inside the function arguments */
function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon"></div>
        <h2>OrderLY</h2>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {/* 2. When clicked, switch page state. Add 'active' class if page matches. */}
          <li 
            className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <LayoutDashboard className="nav-icon" />
            <span>Dashboard</span>
          </li>

          <li 
            className={`nav-item ${activePage === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActivePage('subscriptions')}
          >
            <CreditCard className="nav-icon" />
            <span>Subscriptions</span>
          </li>

          <li 
            className={`nav-item ${activePage === 'vault' ? 'active' : ''}`}
            onClick={() => setActivePage('vault')}
          >
            <ShieldAlert className="nav-icon" />
            <span>Legacy Vault</span>
          </li>

          <li 
            className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => setActivePage('settings')}
          >
            <Settings className="nav-icon" />
            <span>Settings</span>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-avatar">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User Avatar" />
        </div>
        <div className="user-info">
          <span className="user-name">Efeadi Michael</span>
          <span className="user-role">Premium Account</span>
        </div>
        <button className="logout-btn" aria-label="Log Out">
          <LogOut className="nav-icon" />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar