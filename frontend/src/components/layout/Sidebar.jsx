import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  ScanSearch,
  FileBarChart2,
  Settings,
  TrendingUp,
  LogOut
} from 'lucide-react'

const TBDPill = () => <span className="nav-tbd-pill">TBD</span>

export default function Sidebar() {

  const handleLogout = () => {
    localStorage.removeItem('finomaly_token');
    window.location.href = '/welcome';
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <div>
            <div className="logo-text">FinOmaly</div>
            <div className="logo-sub">Financial Forensics</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>

        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        <NavLink
          to="/companies"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <Building2 size={16} />
          Companies
        </NavLink>

        <NavLink
          to="/analysis/new"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <ScanSearch size={16} />
          New Analysis
        </NavLink>

        <div className="nav-section-label">Analysis</div>

        <NavLink
          to="/analysis/report"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <FileBarChart2 size={16} />
          Analysis Report
        </NavLink>

        <NavLink
          to="/trends"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <TrendingUp size={16} />
          Trend Explorer
        </NavLink>

        <div className="nav-section-label">Account</div>

        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          <Settings size={16} />
          Settings
        </NavLink>

        <button 
          onClick={handleLogout}
          className="nav-link" 
          style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: '#ef4444' }}
        >
          <LogOut size={16} />
          Log Out
        </button>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-org">
          <strong>Acme Corp</strong>
          Organization A
        </div>
      </div>
    </aside>
  )
}

