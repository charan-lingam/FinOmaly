import { useState, useEffect } from 'react'
import MScoreGauge from '../components/charts/MScoreGauge'
import IndicatorChart from '../components/charts/IndicatorChart'
import TBDSection from '../components/analysis/TBDSection'
import { TrendingUp, AlertOctagon, FileDown } from 'lucide-react'
import { WaveLoader } from '../components/ui/wave-loader'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

const BENEISH_INDICATORS = [
  { symbol: 'DSRI', name: "Days' Sales in Receivables Index", coefficient: 0.920, dbKey: 'dsri' },
  { symbol: 'GMI',  name: 'Gross Margin Index',                coefficient: 0.528, dbKey: 'gmi' },
  { symbol: 'AQI',  name: 'Asset Quality Index',               coefficient: 0.404, dbKey: 'aqi' },
  { symbol: 'SGI',  name: 'Sales Growth Index',                coefficient: 0.892, dbKey: 'sgi' },
  { symbol: 'DEPI', name: 'Depreciation Index',                coefficient: 0.115, dbKey: 'depi' },
  { symbol: 'SGAI', name: 'SG&A Expense Index',               coefficient: -0.172, dbKey: 'sgai' },
  { symbol: 'TATA', name: 'Total Accruals to Total Assets',    coefficient: 4.679, dbKey: 'tata' },
  { symbol: 'LVGI', name: 'Leverage Index',                    coefficient: -0.327, dbKey: 'lvgi' },
]

export default function AnalysisReport() {
  const [companies, setCompanies] = useState([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('finomaly_token')
      const res = await fetch(API_BASE + '/api/v1/companies/', {
        headers: { Authorization: 'Bearer ' + token }
      })
      if (res.ok) {
        const data = await res.json()
        setCompanies(data)
        if (data.length > 0) {
          setSelectedCompanyId(data[0].id)
        }
      }
    }
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (!selectedCompanyId) return
    const fetchAnalysis = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('finomaly_token')
        const res = await fetch(API_BASE + '/api/v1/analyses/' + selectedCompanyId, {
          headers: { Authorization: 'Bearer ' + token }
        })
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setAnalysis(data[0]) // latest year pair
          } else {
            setAnalysis(null)
          }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalysis()
  }, [selectedCompanyId])

  const comp = companies.find(c => c.id === selectedCompanyId)
  const mScore = analysis?.m_score_result?.m_score
  const isManip = analysis?.m_score_result?.is_manipulator

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <div className="page-header-left" style={{ flex: 1 }}>
          <h1>Analysis Report</h1>
          <p>Beneish M-Score results, indicator breakdown, and anomaly findings.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0', minWidth: 200 }}
          >
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button
            className="btn btn-outline"
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
            title="PDF Export - TBD"
          >
            <FileDown size={14} />
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
          <WaveLoader message="Loading analysis…" colour="#94a3b8" />
        </div>
      ) : !analysis ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <h3>No Analysis Available</h3>
          <p style={{ color: '#64748b', marginTop: 8 }}>
            Please upload at least two years of financial statements for this company.
          </p>
        </div>
      ) : (
        <div className="section-gap" style={{ marginTop: 24 }}>
          {/* M-Score Gauge + Run Info */}
          <div className="row" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div className="flex-1" style={{ flex: 1, minWidth: 300 }}>
              <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid #e2e8f0' }}>
                  <span className="card-title" style={{ fontWeight: 'bold' }}>Beneish M-Score</span>
                  {isManip ? (
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>HIGH RISK</span>
                  ) : (
                    <span style={{ background: '#10b981', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>LOW RISK</span>
                  )}
                </div>
                <div className="card-body" style={{ padding: 24, textAlign: 'center' }}>
                  <div style={{ fontSize: 64, fontWeight: 'bold', color: isManip ? '#ef4444' : '#10b981' }}>
                    {mScore !== null ? mScore : 'N/A'}
                  </div>
                  <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                    Threshold: -1.78
                  </p>
                </div>
              </div>
            </div>

            <div style={{ width: 260, flexShrink: 0 }}>
              <div className="card" style={{ height: '100%' }}>
                <div className="card-header" style={{ padding: 16, borderBottom: '1px solid #e2e8f0' }}>
                  <span className="card-title" style={{ fontWeight: 'bold' }}>Run Info</span>
                </div>
                <div className="card-body" style={{ padding: 16 }}>
                  <table style={{ width: '100%' }}>
                    <tbody>
                      {[
                        ['Company', comp?.ticker || '-'],
                        ['Analysis Year', analysis.year_curr],
                        ['Prior Year', analysis.year_prev],
                        ['Status', <span key="status" style={{ color: isManip ? '#ef4444' : '#10b981', fontWeight: 600 }}>Completed</span>],
                      ].map(([label, val]) => (
                        <tr key={label} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '10px 0', fontSize: 12, color: '#64748b' }}>{label}</td>
                          <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Indicators Coefficient Table */}
          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-header" style={{ padding: 16, borderBottom: '1px solid #e2e8f0' }}>
              <span className="card-title" style={{ fontWeight: 'bold' }}>Indicator Coefficients</span>
            </div>
            <div className="table-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>Symbol</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>Indicator Name</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', textAlign: 'right' }}>Coefficient</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', textAlign: 'right' }}>Calculated Value</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: '#64748b', textAlign: 'right' }}>Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {BENEISH_INDICATORS.map((ind) => {
                    const val = analysis.m_score_result[ind.dbKey]
                    const contrib = val !== null ? (val * ind.coefficient) : null
                    return (
                      <tr key={ind.symbol} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <code style={{ background: '#eff6ff', color: '#3b82f6', padding: '2px 7px', borderRadius: 4, fontWeight: 700, fontSize: 12 }}>
                            {ind.symbol}
                          </code>
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 500, fontSize: 13 }}>{ind.name}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: ind.coefficient >= 0 ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: 13 }}>
                          {ind.coefficient >= 0 ? '+' : ''}{ind.coefficient}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, fontSize: 13 }}>
                          {val !== null ? val.toFixed(4) : 'N/A'}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, fontSize: 13, color: '#475569' }}>
                          {contrib !== null ? (contrib >= 0 ? '+' : '') + contrib.toFixed(4) : 'N/A'}
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan={2} style={{ fontWeight: 600, color: '#64748b', padding: '12px 16px', fontSize: 13 }}>
                      Intercept
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#ef4444', padding: '12px 16px', fontSize: 13 }}>-4.84</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', fontSize: 11.5, color: '#94a3b8' }}>
              M = -4.84 + 0.920(DSRI) + 0.528(GMI) + 0.404(AQI) + 0.892(SGI) + 0.115(DEPI) - 0.172(SGAI) + 4.679(TATA) - 0.327(LVGI)
            </div>
          </div>
          
          <div style={{ padding: '14px 18px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, fontSize: 12.5, color: '#1e40af', lineHeight: 1.6, marginTop: 24 }}>
            <strong>Disclaimer:</strong> FinOmaly is a financial screening and forensic-support tool.
            An elevated Beneish M-Score or anomaly flag does <strong>not</strong> establish fraud,
            manipulation, intent, or legal wrongdoing. Findings require appropriate human and professional evaluation.
          </div>
        </div>
      )}
    </div>
  )
}
