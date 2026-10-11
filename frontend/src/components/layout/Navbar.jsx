import { useLocation, Link } from 'react-router-dom'
import { Bell, User } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your financial analysis activity' },
  '/companies': { title: 'Companies', subtitle: 'Manage companies within your organization' },
  '/analysis/new': { title: 'New Analysis', subtitle: 'Upload financial statements and run M-Score analysis' },
  '/analysis/report': { title: 'Analysis Report', subtitle: 'View Beneish M-Score results and anomaly findings' },
  '/trends': { title: 'Trend Explorer', subtitle: 'Visualise financial metrics across time' },
  '/settings': { title: 'Settings', subtitle: 'Manage organization and analysis preferences' },
  '/profile': { title: 'Profile', subtitle: 'Manage your personal account' }
}

export default function Navbar() {
  const { pathname } = useLocation()
  const info = PAGE_TITLES[pathname] || { title: 'FinOmaly', subtitle: '' }

  return (
    <header className="navbar">
      <div style={{ flex: 1 }}>
        <span className="navbar-title">{info.title}</span>
        {info.subtitle && (
          <span className="navbar-subtitle">— {info.subtitle}</span>
        )}
      </div>

      {/* Right side actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ 
          fontSize: '12px', 
          color: 'var(--text-secondary)', 
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border)',
          padding: '4px 10px',
          borderRadius: 20,
          fontWeight: 500 
        }}>
          developed by <span style={{ color: 'var(--blue, #3b82f6)', fontWeight: 600 }}>Trinetra189.</span>
        </span>

        <ModeToggle />
        <button
          className="btn btn-outline btn-sm"
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
          disabled
          title="Notifications — TBD"
        >
          <Bell size={14} />
        </button>

        <Link to="/profile" style={{width:32,height:32,borderRadius:"50%",background:"var(--blue-light)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--blue)",cursor:"pointer",textDecoration:"none"}} title="User Profile"><User size={15} /></Link>
      </div>
    </header>
  )
}

