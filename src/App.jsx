import React, { useState } from 'react';
import './App.css';
import Sidebar from './Components/Sidebar';
import subscriptions from './data/subscriptionsData.json';
import { DollarSign, Layers, Activity, X, ExternalLink } from 'lucide-react';

function App() {
  // 1. Create the state to track which page is currently open
  const [theme, setTheme] = useState('light');
  const [activePage, setActivePage] = useState('dashboard');
  const [vaultStep, setVaultStep] = useState(1);
  const [vaultData, setVaultData] = useState({
    inactivityPeriod: '6 Months',
    vaultAction: 'delete',
    trusteeName: '',
    trusteeEmail: ''
  });

  /* ==========================================
     DATA CALCULATIONS
     ========================================== */
  const totalMonthlySpend = subscriptions.reduce((total, sub) => {
    if (sub.status !== 'active') return total;
    return sub.billingCycle === 'yearly' ? total + (sub.cost / 12) : total + sub.cost;
  }, 0);

  const activeSubsCount = subscriptions.filter(sub => sub.status === 'active').length;
  const totalSubsCount = subscriptions.length;
  const avgClutterScore = Math.round(subscriptions.reduce((total, sub) => total + sub.OrderLYImpactScore, 0) / totalSubsCount);

  return (
    <div className={`app-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* 2. Pass activePage and setActivePage down to the Sidebar component */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">

        {/* ==========================================
           CONDITION 1: IF THE ACTIVE PAGE IS DASHBOARD
           ========================================== */}
        {activePage === 'dashboard' && (
          <div className="fade-in">
            <header className="content-header">
              <h1>Dashboard Overview</h1>
              <p>Welcome back! Let's optimize your digital footprint today.</p>
            </header>

            {/* Analytics Grid */}
            <div className="analytics-grid">
              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-title">Monthly Spend</span>
                  <div className="stat-icon-wrapper blue-tint"><DollarSign className="stat-icon" /></div>
                </div>
                <div className="stat-value">${totalMonthlySpend.toFixed(2)}</div>
                <div className="stat-footer text-green"><span>Optimized limit: $100.00</span></div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-title">Active Services</span>
                  <div className="stat-icon-wrapper green-tint"><Layers className="stat-icon" /></div>
                </div>
                <div className="stat-value">{activeSubsCount} <span className="stat-value-sub">/ {totalSubsCount}</span></div>
                <div className="stat-footer text-muted"><span>{totalSubsCount - activeSubsCount} service paused</span></div>
              </div>

              <div className="stat-card">
                <div className="stat-card-header">
                  <span className="stat-title">Avg Clutter Score</span>
                  <div className="stat-icon-wrapper orange-tint"><Activity className="stat-icon" /></div>
                </div>
                <div className="stat-value">{avgClutterScore}<span className="stat-value-sub">/10</span></div>
                <div className="stat-footer">
                  <span className={`status-pill ${avgClutterScore > 5 ? 'pill-warning' : 'pill-safe'}`}>
                    {avgClutterScore > 5 ? 'Action Advised' : 'Safe Footprint'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
           CONDITION 2: IF THE ACTIVE PAGE IS SUBSCRIPTIONS
           ========================================== */}
        {activePage === 'subscriptions' && (
  <div className="fade-in">
    <header className="content-header">
      <h1>Subscription Ledger</h1>
      <p>Review details, check billing cycles, and track data footprint scores.</p>
    </header>

    <div className="table-container">
      <div className="responsive-table-wrapper">
        <table className="subscription-table">
          {/* 1. Static Table Head: Visible on desktop, hidden on mobile via CSS */}
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Billing Cycle</th>
              <th>Next Renewal</th>
              <th>Status</th>
              <th>Impact Score</th>
            </tr>
          </thead>

          {/* 2. Dynamic Table Body: Loops through your JSON rows correctly */}
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="table-row">
                {/* Profile / Avatar Row */}
                <td className="td-profile">
                  <img src={sub.iconUrl} alt={sub.name} className="service-avatar" />
                  <span className="service-name-text">{sub.name}</span>
                </td>

                {/* Mobile Responsive Data-Label cells */}
                <td data-label="Category">
                  <span className="category-tag">{sub.category}</span>
                </td>
                <td data-label="Cost" className="td-cost">
                  ${sub.cost.toFixed(2)}
                </td>
                <td data-label="Billing Cycle" className="td-cycle">
                  {sub.billingCycle}
                </td>
                <td data-label="Next Renewal" className="td-date">
                  {sub.nextBillingDate}
                </td>
                <td data-label="Status">
                  <span className={`status-badge ${sub.status === 'active' ? 'badge-active' : 'badge-paused'}`}>
                    {sub.status}
                  </span>
                </td>
                <td>
                  <div className="impact-meter-wrapper">
                    <div
                      className="impact-meter-bar"
                      style={{
                        width: `${sub.OrderLYImpactScore * 10}%`,
                        backgroundColor: sub.OrderLYImpactScore > 7 ? '#ef4444' : sub.OrderLYImpactScore > 4 ? '#f97316' : '#0ed56d'
                      }}
                    ></div>
                    <span className="impact-text">Impact: {sub.OrderLYImpactScore}/10</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

        {/* ==========================================
   CONDITION 3: DIGITAL LEGACY VAULT WIZARD
   ========================================== */}
        {
          activePage === 'vault' && (
            <div className="fade-in vault-page-layout">

              {/* Left Column: The Form Wizard */}
              <div className="vault-form-container">
                <header className="content-header">
                  <h1>My Digital Safe</h1>
                  <p>Set instructions for what should happen to your digital assets in case of prolonged account inactivity.</p>
                </header>

                {/* Progress Multi-Step Tracker Bars */}
                <div className="wizard-progress-bar">
                  <div className={`progress-step ${vaultStep >= 1 ? 'step-active' : ''}`}>1. Trigger Condition</div>
                  <div className={`progress-step ${vaultStep >= 2 ? 'step-active' : ''}`}>2. Vault Action</div>
                  <div className={`progress-step ${vaultStep >= 3 ? 'step-active' : ''}`}>3. Legacy Contact</div>
                </div>

                <div className="form-card-body">
                  {/* STEP 1: CHOOSE INACTIVITY TRIGGER TIMELINE */}
                  {vaultStep === 1 && (
                    <div className="wizard-step-view slide-in">
                      <h3>When should your vault activate?</h3>
                      <p className="field-instruction">Select the duration of account inactivity required before execution actions begin.</p>
                      <div className="radio-options-grid">
                        {['3 Months', '6 Months', '1 Year', '2 Years'].map((time) => (
                          <label key={time} className={`custom-radio-card ${vaultData.inactivityPeriod === time ? 'radio-selected' : ''}`}>
                            <input
                              type="radio"
                              name="inactivityPeriod"
                              value={time}
                              checked={vaultData.inactivityPeriod === time}
                              onChange={(e) => setVaultData({ ...vaultData, inactivityPeriod: e.target.value })}
                            />
                            <span>{time} of complete inactivity</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: CHOOSE SECURITY ACTION DIRECTIVE */}
                  {vaultStep === 2 && (
                    <div className="wizard-step-view slide-in">
                      <h3>Select Automatic Safe Action</h3>
                      <p className="field-instruction">Choose what happens to your active database subscriptions and digital profile footprints.</p>
                      <div className="radio-options-grid">
                        {[
                          { id: 'delete', title: 'Delete Everything', desc: ' ; Permanently delete your accounts, stop subscriptions, and remove your saved data.' },
                          { id: 'transfer', title: 'Transfer to a Trusted Person', desc: ' ; Securely send your important account details to someone you trust.' },
                          { id: 'archive', title: 'Keep Everything Safe', desc: ' ; Lock your accounts and files so they stay safe until they are needed.' }
                        ].map((action) => (
                          <label key={action.id} className={`custom-radio-card ${vaultData.vaultAction === action.id ? 'radio-selected' : ''}`}>
                            <input
                              type="radio"
                              name="vaultAction"
                              value={action.id}
                              checked={vaultData.vaultAction === action.id}
                              onChange={(e) => setVaultData({ ...vaultData, vaultAction: e.target.value })}
                            />
                            <div className="radio-text-group">
                              <span className="radio-title-text">{action.title}</span>
                              <span className="radio-desc-text">{action.desc}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: ASSIGN LEGACY TRUSTEE CONTACT */}
                  {vaultStep === 3 && (
                    <div className="wizard-step-view slide-in">
                      <h3>Assign Beneficiary Trustee</h3>
                      <p className="field-instruction">Provide legal identification details and contact records for your security purpose.</p>
                      <div className="input-group">
                        <label>Trustee Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Ifeoma Amaka"
                          value={vaultData.trusteeName}
                          onChange={(e) => setVaultData({ ...vaultData, trusteeName: e.target.value })}
                          className="text-field-input"
                        />
                      </div>
                      <div className="input-group" style={{ marginTop: '16px' }}>
                        <label>Secure Verification Email</label>
                        <input
                          type="email"
                          placeholder="trustee@example.com"
                          value={vaultData.trusteeEmail}
                          onChange={(e) => setVaultData({ ...vaultData, trusteeEmail: e.target.value })}
                          className="text-field-input"
                        />
                      </div>
                    </div>
                  )}

                  {/* Wizard Footer Control Buttons */}
                  <div className="wizard-button-footer">
                    <button
                      className="secondary-action-btn"
                      disabled={vaultStep === 1}
                      onClick={() => setVaultStep(vaultStep - 1)}
                    >
                      Back
                    </button>

                    {vaultStep < 3 ? (
                      <button className="primary-action-btn" onClick={() => setVaultStep(vaultStep + 1)}>
                        Continue
                      </button>
                    ) : (
                      <button className="primary-action-btn success-green-btn" onClick={() => alert('Vault Directive Locked & Encrypted Securely!')}>
                        Lock Safe Directive
                      </button>
                    )
                    }
                  </div>
                </div>
              </div>

              {/* Right Column: Premium Live Preview Card */}
              <div className="vault-preview-sidebar">
                <div className="preview-sticky-card">
                  <span className="badge-preview-tag">LIVE VAULT MANIFEST</span>
                  <div className="preview-graphic-shield">🔒</div>
                  <h3>Directive Status Blueprint</h3>

                  <div className="manifest-item">
                    <label>Trigger Interval:</label>
                    <p>{vaultData.inactivityPeriod || 'Not specified yet'}</p>
                  </div>
                  <div className="manifest-item">
                    <label>Execution Command:</label>
                    <p style={{ textTransform: 'uppercase', color: '#06b6d4', fontWeight: '600' }}>
                      {vaultData.vaultAction || 'Pending Selection'}
                    </p>
                  </div>
                  <div className="manifest-item">
                    <label>Assigned Trustee Beneficiary:</label>
                    <p>{vaultData.trusteeName || 'None Assigned'}</p>
                    <span className="sub-email-text">{vaultData.trusteeEmail}</span>
                  </div>
                </div>
              </div>

            </div>
          )
        }

        {/* ==========================================
   CONDITION 4: ACCOUNT & CONFIGURATION SETTINGS
   ========================================== */}
        {
          activePage === 'settings' && (
            <div className="fade-in settings-container">
              <header className="content-header">
                <h1>Account Settings</h1>
                <p>Configure interface options, update profile parameters, and secure notifications.</p>
              </header>

              <div className="settings-grid-layout">

                {/* Card A: Interface Preferences (Theme Switcher) */}
                <div className="settings-card">
                  <h3>Interface Preferences</h3>
                  <p className="field-instruction">Choose how your OrderLY dashboard looks. Toggle between clean light mode and premium dark mode.</p>

                  <div className="theme-toggle-row">
                    <button
                      className={`theme-select-btn ${theme === 'light' ? 'theme-btn-active' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      ☀️ Light Mode
                    </button>
                    <button
                      className={`theme-select-btn ${theme === 'dark' ? 'theme-btn-active' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      🌙 Dark Mode
                    </button>
                  </div>
                </div>

                {/* Card B: User Information Profiles */}
                <div className="settings-card">
                  <h3>Developer Profile Record</h3>
                  <p className="field-instruction">Your profile info is displayed at the base of the navigation panel sidebar.</p>

                  <div className="profile-settings-form">
                    <div className="input-group">
                      <label>Display Name</label>
                      <input type="text" className="text-field-input" defaultValue="Efeadi Michael" />
                    </div>
                    <div className="input-group" style={{ marginTop: '16px' }}>
                      <label>Associated Email Portal</label>
                      <input type="email" className="text-field-input" defaultValue="Efeadi.Michael@gmail.com" />
                    </div>
                  </div>
                </div>

                {/* Card C: Automated Subscriptions Notifications */}
                <div className="settings-card">
                  <h3>Notification</h3>
                  <p className="field-instruction">Get alert warnings before subscriptions auto-renew or when Clutter Scores jump too high.</p>

                  <div className="notification-toggle-list">
                    <label className="toggle-setting-row">
                      <div className="toggle-text-lbl">
                        <span>Email Renewal Warnings</span>
                        <small>Receive a notification 5 days before any card charge hits.</small>
                      </div>
                      <input type="checkbox" defaultChecked className="ios-toggle-switch" />
                    </label>

                    <label className="toggle-setting-row" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                      <div className="toggle-text-lbl">
                        <span>High Clutter Score Alerts</span>
                        <small>Notify me when unutilized platforms drift past impact score 7.</small>
                      </div>
                      <input type="checkbox" defaultChecked className="ios-toggle-switch" />
                    </label>
                  </div>
                </div>

                {/* Card D: Creator Credits & Professional Links */}
                <div className="settings-card creator-profile-card">
                  <div className="creator-card-header">
                    <div>
                      <h3>About The Builder</h3>
                      <p className="field-instruction">This platform was engineered from scratch as a premium front-end portfolio showcase piece.</p>
                    </div>
                  </div>

                  <div className="creator-links-row">
                    {/* GitHub Portal Button */}
                    <a
                      href="https://github.com/JubilantCj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-portal-link github-btn-style"
                    >
                      <div className="social-link-content">
                        {/* Pure HTML SVG for GitHub Logo - Bulletproof & Universal */}
                        <svg
                          className="social-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                          <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>

                        <div className="social-text-info">
                          <span className="social-title">GitHub Profile</span>
                          <span className="social-handle">@JubilantCj</span>
                        </div>
                      </div>
                      <ExternalLink className="link-arrow-icon" />
                    </a>

                    {/* Twitter / X Portal Button */}
                    <a
                      href="https://x.com/jubilantud"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-portal-link twitter-btn-style"
                    >
                      <div className="social-link-content">
                        <X className="social-icon" />
                        <div className="social-text-info">
                          <span className="social-title">Twitter (X)</span>
                          <span className="social-handle">@jubilantud</span>
                        </div>
                      </div>
                      <ExternalLink className="link-arrow-icon" />
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )
        }



      </main >
    </div >
  );
}

export default App;