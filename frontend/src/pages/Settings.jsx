import { useState, useEffect } from 'react'
import { Save, Sliders, Bell, Building, ShieldAlert } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form states
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('finomaly_settings')
    if (saved) return JSON.parse(saved)
    return {
      orgName: 'My Workspace',
      mScoreThreshold: -1.78,
      defaultCurrency: 'USD',
      strictFlags: true,
      emailAlerts: false,
      weeklyReport: true
    }
  })

  const handleSave = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('finomaly_settings', JSON.stringify(settings))
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 800)
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h1>Settings</h1>
          <p>Configure organization preferences and analysis defaults.</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="btn btn-primary">
          {loading ? 'Saving...' : <><Save size={16} /> Save Changes</>}
        </button>
      </div>

      {saved && (
        <div style={{ padding: '12px 16px', background: 'var(--green-light)', color: '#065f46', borderRadius: 8, marginBottom: 24, fontSize: 13, fontWeight: 500 }}>
          Settings successfully saved!
        </div>
      )}

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar Tabs */}
        <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 8,
              background: activeTab === 'general' ? 'var(--blue)' : 'transparent',
              color: activeTab === 'general' ? '#fff' : 'var(--text-secondary)',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            <Building size={16} /> Organization
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 8,
              background: activeTab === 'analysis' ? 'var(--blue)' : 'transparent',
              color: activeTab === 'analysis' ? '#fff' : 'var(--text-secondary)',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            <Sliders size={16} /> Analysis Defaults
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 8,
              background: activeTab === 'notifications' ? 'var(--blue)' : 'transparent',
              color: activeTab === 'notifications' ? '#fff' : 'var(--text-secondary)',
              border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            <Bell size={16} /> Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div className="card" style={{ flex: 1 }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            <h3 className="card-title">
              {activeTab === 'general' && 'Organization Settings'}
              {activeTab === 'analysis' && 'Analysis & Threshold Defaults'}
              {activeTab === 'notifications' && 'Notification Preferences'}
            </h3>
          </div>
          <div className="card-body" style={{ paddingTop: 20 }}>
            
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--text-primary)' }}>Organization Name</label>
                  <input 
                    type="text" 
                    value={settings.orgName} 
                    onChange={e => handleChange('orgName', e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--text-primary)' }}>Support Email</label>
                  <input 
                    type="email" 
                    defaultValue="support@example.com"
                    disabled
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)', opacity: 0.6, cursor: 'not-allowed' }} 
                  />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Contact an administrator to change the primary support email.</p>
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--text-primary)' }}>Beneish M-Score Threshold</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input 
                      type="number" 
                      step="0.01"
                      value={settings.mScoreThreshold} 
                      onChange={e => handleChange('mScoreThreshold', parseFloat(e.target.value))}
                      style={{ width: 120, padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }} 
                    />
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Default is -1.78. Values above this trigger high-risk alerts.</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'var(--text-primary)' }}>Default Display Currency</label>
                  <select 
                    value={settings.defaultCurrency} 
                    onChange={e => handleChange('defaultCurrency', e.target.value)}
                    style={{ width: '100%', maxWidth: 200, padding: '10px 12px', borderRadius: 6, border: '1px solid var(--border)' }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>

                <div style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 8, background: 'rgba(0,0,0,0.1)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.strictFlags} 
                      onChange={e => handleChange('strictFlags', e.target.checked)}
                      style={{ width: 16, height: 16 }}
                    />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldAlert size={14} style={{ color: 'var(--amber)' }} /> Enable Strict Anomaly Flags
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        Triggers warnings for individual indicator breaches even if the total M-Score is safe.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={settings.emailAlerts} 
                    onChange={e => handleChange('emailAlerts', e.target.checked)}
                    style={{ width: 16, height: 16, marginTop: 2 }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>High Risk Email Alerts</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      Receive an immediate email notification when a newly uploaded analysis flags a high manipulation risk.
                    </div>
                  </div>
                </label>
                
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0' }} />

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={settings.weeklyReport} 
                    onChange={e => handleChange('weeklyReport', e.target.checked)}
                    style={{ width: 16, height: 16, marginTop: 2 }}
                  />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Weekly Digest</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      Receive a weekly summary of all companies analyzed and their status changes.
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

