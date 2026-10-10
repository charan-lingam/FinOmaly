import { useLocation } from 'react-router-dom'
import { Bell, User } from 'lucide-react'

const PAGE_TITLES = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your financial analysis activity' },
  '/companies': { title: 'Companies', subtitle: 'Manage companies within your organization' },
  '/analysis/new': { title: 'New Analysis', subtitle: 'Upload financial statements and run M-Score analysis' },
  '/analysis/report': { title: 'Analysis Report', subtitle: 'View Beneish M-Score results and anomaly findings' },
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          className="btn btn-outline btn-sm"
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
          disabled
          title="Notifications — TBD"
        >
          <Bell size={14} />
        </button>

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'not-allowed',
            opacity: 0.6,
          }}
          title="User Profile — Auth TBD"
        >
          <User size={15} />
        </div>
      </div>
    </header>
  )
}

