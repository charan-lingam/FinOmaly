import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Building2, Loader, AlertTriangle, CheckCircle2 } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function CompanyDetails() {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('finomaly_token')
        const headers = { Authorization: 'Bearer ' + token }
        
        // Fetch company details
        const resComp = await fetch(API_BASE + '/api/v1/companies/', { headers })
        if (resComp.ok) {
          const companies = await resComp.json()
          setCompany(companies.find(c => c.id === id))
        }

        // Fetch analyses
        const resAnalyses = await fetch(API_BASE + '/api/v1/analyses/' + id, { headers })
        if (resAnalyses.ok) {
          setAnalyses(await resAnalyses.json())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/analysis/new" className="btn btn-primary">Upload Financial Data</Link>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        {analyses.length === 0 ? (
          <div className="card" style={{ padding: 24 }}>
            <h3>No Analysis Found</h3>
            <p style={{ color: '#64748b', marginTop: 8 }}>
              Upload at least two years of financial statements to calculate the Beneish M-Score.
            </p>
          </div>
        ) : (
          analyses.map((analysis, idx) => (
            <div key={idx} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3>Analysis: {analysis.year_prev} to {analysis.year_curr}</h3>
                {analysis.m_score_result.is_manipulator ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', backgroundColor: '#fee2e2', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
                    <AlertTriangle size={20} /> High Risk of Manipulation
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', backgroundColor: '#dcfce3', padding: '8px 16px', borderRadius: 20, fontWeight: 'bold' }}>
                    <CheckCircle2 size={20} /> Low Risk
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: 24, padding: 24, backgroundColor: '#f8fafc', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>
                  Beneish M-Score
                </div>
                <div style={{ fontSize: 48, fontWeight: 'bold', color: analysis.m_score_result.is_manipulator ? '#dc2626' : '#16a34a', marginTop: 8 }}>
                  {analysis.m_score_result.m_score}
                </div>
                <div style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>
                  Threshold: -1.78
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: 16 }}>Indicators</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  {['dsri', 'gmi', 'aqi', 'sgi', 'depi', 'sgai', 'lvgi', 'tata'].map(key => (
                    <div key={key} style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 8 }}>
                      <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' }}>{key}</div>
                      <div style={{ fontSize: 20, fontWeight: 'bold', marginTop: 4 }}>
                        {analysis.m_score_result[key] !== null ? analysis.m_score_result[key] : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
