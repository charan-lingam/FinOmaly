import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, Activity, AlertTriangle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function Dashboard() {
  const [stats, setStats] = useState({ companies: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('finomaly_token')
        const res = await fetch(API_BASE + '/api/v1/companies/', {
          headers: { Authorization: 'Bearer ' + token }
        })
        if (res.ok) {
          const companies = await res.json()
          setStats({ companies: companies.length })
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Welcome to FinOmaly</h1>
          <p className="page-description">Your financial forensics dashboard.</p>
        </div>
        <Link to="/analysis/new" className="btn btn-primary">
          + New Analysis
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginTop: 24 }}>
        <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: 8 }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Total Companies</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.companies}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, backgroundColor: '#dcfce3', color: '#16a34a', borderRadius: 8 }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Analyses Run</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>-</div>
          </div>
        </div>

        <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 8 }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 14 }}>High Risk Targets</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>-</div>
          </div>
        </div>
      </div>
    </div>
  )
}
