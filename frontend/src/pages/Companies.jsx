import { useState, useEffect } from 'react'
import { Building2, Search, Plus, ArrowRight, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: '', ticker: '', industry: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('finomaly_token')
      const res = await fetch(API_BASE + '/api/v1/companies/', {
        headers: { Authorization: 'Bearer ' + token }
      })
      if (res.ok) {
        const data = await res.json()
        setCompanies(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const token = localStorage.getItem('finomaly_token')
      const res = await fetch(API_BASE + '/api/v1/companies/', {
        method: 'POST',
        headers: { 
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCompany)
      })
      if (res.ok) {
        setShowModal(false)
        setNewCompany({ name: '', ticker: '', industry: '' })
        fetchCompanies()
      } else {
        alert('Failed to create company')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-description">Manage and view target companies in your portfolio.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Company
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 8, width: 400 }}>
            <h2 style={{ marginTop: 0 }}>New Company</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input required placeholder="Name (e.g. Tesla)" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} style={{ padding: 8 }} />
              <input required placeholder="Ticker (e.g. TSLA)" value={newCompany.ticker} onChange={e => setNewCompany({...newCompany, ticker: e.target.value})} style={{ padding: 8 }} />
              <input required placeholder="Industry (e.g. Auto)" value={newCompany.industry} onChange={e => setNewCompany({...newCompany, industry: e.target.value})} style={{ padding: 8 }} />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {submitting ? 'Saving...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><Loader className="spin" /> Loading...</div>
        ) : companies.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>No companies found. Create one to get started!</div>
        ) : (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ padding: 12 }}>Company</th>
                <th style={{ padding: 12 }}>Ticker</th>
                <th style={{ padding: 12 }}>Industry</th>
                <th style={{ padding: 12 }}>Added</th>
                <th style={{ padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.name}</div>
                  </td>
                  <td style={{ padding: 12 }}>
                    <code style={{ background: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
                      {c.ticker}
                    </code>
                  </td>
                  <td style={{ padding: 12, color: '#64748b', fontSize: 13 }}>{c.industry}</td>
                  <td style={{ padding: 12, color: '#94a3b8', fontSize: 12 }}>
                    {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: 12 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/companies/${c.id}`} className="btn btn-outline" style={{ padding: '4px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}>
                        Analysis History
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}


