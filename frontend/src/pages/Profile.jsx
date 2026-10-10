import { useState, useEffect } from 'react'
import { User, Mail, Shield, Building, LogOut, Key } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { WaveLoader } from '../components/ui/wave-loader'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('finomaly_token')
        if (!token) throw new Error('Not authenticated')

        const res = await fetch(`${API_BASE}/api/v1/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!res.ok) throw new Error('Failed to load profile')
        
        const data = await res.json()
        setUser(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('finomaly_token')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
        <WaveLoader message="Loading profile..." />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="empty-state card">
        <User className="empty-state-icon" />
        <p>{error || 'Could not load profile.'}</p>
        <button className="btn btn-outline" onClick={() => navigate('/')}>Return to Dashboard</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ color: 'var(--red)', borderColor: 'var(--red-light)' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="section-gap">
        {/* Profile Info */}
        <div className="card">
          <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} /> Account Details
            </h3>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, paddingTop: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500 }}>
                <Mail size={16} style={{ color: 'var(--text-muted)' }} /> {user.email}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>User ID</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                <Key size={14} /> {user.id}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Role</label>
              <div className="badge badge-blue" style={{ display: 'inline-flex' }}>
                <Shield size={12} style={{ marginRight: 4 }} /> Admin
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Organization</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                <Building size={16} style={{ color: 'var(--text-muted)' }} /> My Workspace
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder settings */}
        <div className="card">
          <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            <h3 className="card-title">Preferences</h3>
          </div>
          <div className="card-body" style={{ paddingTop: 20 }}>
            <p className="text-secondary" style={{ fontSize: 14 }}>
              Theme preferences are locked to Dark Mode for the best experience with the interactive background. Additional notification settings and API keys will be available in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

