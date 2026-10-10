import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2, Loader } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function CompanyDetails() {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem('finomaly_token')
        const res = await fetch(API_BASE + '/api/v1/companies/', {
          headers: { Authorization: 'Bearer ' + token }
        })
        if (res.ok) {
          const companies = await res.json()
          const found = companies.find(c => c.id === id)
          setCompany(found)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
  }, [id])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}><Loader className="spin" /> Loading...</div>
  if (!company) return <div style={{ padding: 40, textAlign: 'center' }}>Company not found.</div>

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link to="/companies" className="btn btn-outline" style={{ padding: '8px' }}><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Building2 /> {company.name} ({company.ticker})
          </h1>
          <p className="page-description">Industry: {company.industry}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginTop: 24 }}>
        <h3>Company Overview</h3>
        <p style={{ color: '#64748b' }}>Financial statements and detailed Beneish M-Score analysis for this company will appear here.</p>
        <div style={{ marginTop: 24 }}>
          <Link to="/analysis/new" className="btn btn-primary">Upload Financial Data for {company.name}</Link>
        </div>
      </div>
    </div>
  )
}
