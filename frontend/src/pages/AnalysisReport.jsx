import { useState, useEffect } from 'react'
import MScoreGauge from '../components/charts/MScoreGauge'
import IndicatorChart from '../components/charts/IndicatorChart'
import TBDSection from '../components/analysis/TBDSection'
import {
  TrendingUp, AlertOctagon, FileDown, AlertTriangle, AlertCircle,
  ShieldAlert, CheckCircle2, Search, Filter, Activity, Sparkles,
  Info, ArrowUpRight
} from 'lucide-react'
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

const BENCHMARK_MAP = {
  dsri: { threshold: 1.031, name: "Days' Sales in Receivables Index", severity: 'high', review: 'Verify revenue recognition timing, check for channel stuffing, and audit unbilled receivables.' },
  gmi:  { threshold: 1.014, name: 'Gross Margin Index', severity: 'medium', review: 'Examine cost allocation, inventory valuation changes, and supplier contractual terms.' },
  aqi:  { threshold: 1.039, name: 'Asset Quality Index', severity: 'high', review: 'Audit capitalized software, goodwill impairments, and long-term asset capitalization policies.' },
  sgi:  { threshold: 1.134, name: 'Sales Growth Index', severity: 'medium', review: 'Sample sales contracts near quarter-ends and check bill-and-hold transactions.' },
  depi: { threshold: 1.001, name: 'Depreciation Index', severity: 'medium', review: 'Inspect fixed-asset schedules and depreciation policy modifications.' },
  sgai: { threshold: 1.054, name: 'SG&A Expense Index', severity: 'low', review: 'Audit executive compensation, marketing accruals, and recurring overhead expenses.' },
  lvgi: { threshold: 1.037, name: 'Leverage Index', severity: 'medium', review: 'Verify debt covenants, short-term refinancing capabilities, and off-balance-sheet commitments.' },
  tata: { threshold: 0.031, name: 'Total Accruals to Total Assets', severity: 'high', review: 'Reconcile net income to cash flow from operations line-by-line; inspect non-cash working capital.' },
}

function computeFallbackAnomalies(mScoreResult) {
  if (!mScoreResult) return []
  const findings = []

  const mScore = mScoreResult.m_score
  if (mScore !== null && mScore !== undefined && mScore > -1.78) {
    findings.push({
      severity: 'critical',
      metric_flagged: 'M_SCORE',
      title: 'High Probability of Financial Statement Manipulation',
      description: `Overall Beneish M-Score is ${mScore.toFixed(4)}, exceeding the critical -1.78 threshold. Statistically significant probability of earnings distortion.`,
      suggested_review: 'Initiate comprehensive forensic audit across revenue recognition, inventory, and capitalized expenditures.',
      value: mScore,
      threshold: -1.78,
    })
  }

  for (const [key, b] of Object.entries(BENCHMARK_MAP)) {
    const val = mScoreResult[key]
    if (val !== null && val !== undefined && val > b.threshold) {
      findings.push({
        severity: b.severity,
        metric_flagged: key.toUpperCase(),
        title: `Elevated ${b.name} (${key.toUpperCase()})`,
        description: `${b.name} is ${val.toFixed(4)}, exceeding benchmark threshold of ${b.threshold.toFixed(4)}.`,
        suggested_review: b.review,
        value: val,
        threshold: b.threshold,
      })
    }
  }

  return findings
}

function AnomalySeverityBadge({ severity }) {
  const s = severity?.toLowerCase()
  let bg = 'rgba(59, 130, 246, 0.15)'
  let color = '#60a5fa'
  let border = 'rgba(59, 130, 246, 0.3)'

  if (s === 'critical') {
    bg = 'rgba(239, 68, 68, 0.15)'
    color = '#ef4444'
    border = 'rgba(239, 68, 68, 0.3)'
  } else if (s === 'high') {
    bg = 'rgba(249, 115, 22, 0.15)'
    color = '#f97316'
    border = 'rgba(249, 115, 22, 0.3)'
  } else if (s === 'medium') {
    bg = 'rgba(234, 179, 8, 0.15)'
    color = '#eab308'
    border = 'rgba(234, 179, 8, 0.3)'
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: bg,
      color: color,
      border: `1px solid ${border}`,
      fontSize: 10,
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: 4,
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}>
      {s === 'critical' ? <ShieldAlert size={11} /> : <AlertTriangle size={11} />}
      {severity}
    </span>
  )
}

function AnomalyDetectionSection({ anomalies, yearCurr, yearPrev }) {
  const [filter, setFilter] = useState('ALL')

  const totalCount = anomalies.length
  const criticalCount = anomalies.filter(a => a.severity?.toLowerCase() === 'critical').length
  const highCount = anomalies.filter(a => a.severity?.toLowerCase() === 'high').length
  const mediumCount = anomalies.filter(a => a.severity?.toLowerCase() === 'medium').length
  const lowCount = anomalies.filter(a => a.severity?.toLowerCase() === 'low').length

  const filtered = filter === 'ALL'
    ? anomalies
    : anomalies.filter(a => a.severity?.toLowerCase() === filter.toLowerCase())

  return (
    <div className="card" style={{ marginTop: 24, overflow: 'hidden' }}>
      {/* Section Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: totalCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: totalCount > 0 ? '#ef4444' : '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {totalCount > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Financial Anomaly Detection
            </h3>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 12,
              background: totalCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: totalCount > 0 ? '#ef4444' : '#10b981',
              border: `1px solid ${totalCount > 0 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`
            }}>
              {totalCount} {totalCount === 1 ? 'Anomaly Flagged' : 'Anomalies Flagged'} ({yearPrev} → {yearCurr})
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', margin: '4px 0 0 36px' }}>
            Identifies unusual patterns in financial data, divergence between earnings and cash flows, and abnormal accruals.
          </p>
        </div>

        {/* Severity Filter Buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `All (${totalCount})` },
            { id: 'CRITICAL', label: `Critical (${criticalCount})` },
            { id: 'HIGH', label: `High (${highCount})` },
            { id: 'MEDIUM', label: `Medium (${mediumCount})` },
            { id: 'LOW', label: `Low (${lowCount})` },
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              style={{
                background: filter === btn.id ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.03)',
                color: filter === btn.id ? 'var(--card-bg)' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                padding: '4px 10px',
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
        padding: '14px 20px',
        background: 'rgba(255, 255, 255, 0.01)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Flagged Anomalies</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: totalCount > 0 ? '#ef4444' : '#10b981', marginTop: 2 }}>
            {totalCount}
          </div>
        </div>

        <div style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Critical & High Alerts</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: (criticalCount + highCount) > 0 ? '#ef4444' : '#10b981', marginTop: 2 }}>
            {criticalCount + highCount}
          </div>
        </div>

        <div style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Medium / Low Signals</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
            {mediumCount + lowCount}
          </div>
        </div>

        <div style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Forensic Action</div>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: criticalCount > 0 ? '#ef4444' : (highCount > 0 ? '#f97316' : '#10b981'),
            marginTop: 6
          }}>
            {criticalCount > 0 ? 'Urgent Audit Required' : (highCount > 0 ? 'Targeted Sampling' : 'Routine Verification')}
          </div>
        </div>
      </div>

      {/* Anomaly Finding Cards or Empty State */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: '32px 20px',
            textAlign: 'center',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 8
          }}>
            <CheckCircle2 size={32} style={{ color: '#10b981', margin: '0 auto 10px' }} />
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
              No {filter !== 'ALL' ? filter.toLowerCase() : ''} financial anomalies detected
            </h4>
            <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--text-muted)', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
              All audited Beneish ratios, cash flow relationships, and reported statement schedules conform to standard empirical forensic benchmarks for this period.
            </p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const s = item.severity?.toLowerCase()
            const accentBorderColor =
              s === 'critical' ? '#ef4444' :
              s === 'high' ? '#f97316' :
              s === 'medium' ? '#eab308' : '#3b82f6'

            return (
              <div
                key={idx}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  borderLeft: `4px solid ${accentBorderColor}`,
                  borderRadius: 8,
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <AnomalySeverityBadge severity={item.severity} />
                    <code style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border)',
                      color: '#60a5fa',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 4
                    }}>
                      {item.metric_flagged}
                    </code>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.title}
                    </span>
                  </div>

                  {item.value !== null && item.value !== undefined && (
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        Observed: {typeof item.value === 'number' ? item.value.toFixed(4) : item.value}
                      </span>
                      {item.threshold !== null && item.threshold !== undefined && (
                        <span> | Threshold: {typeof item.threshold === 'number' ? item.threshold.toFixed(4) : item.threshold}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {item.description}
                </p>

                {/* Suggested Forensic Audit Review */}
                {item.suggested_review && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '1px solid rgba(59, 130, 246, 0.15)',
                    fontSize: 12,
                    color: 'var(--text-primary)'
                  }}>
                    <Search size={14} style={{ color: '#60a5fa', flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong style={{ color: '#60a5fa' }}>Suggested Forensic Audit Step: </strong>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.suggested_review}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

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

  // Extract stored anomalies or synthesize fallback
  const anomalies = (analysis?.anomalies && analysis.anomalies.length > 0)
    ? analysis.anomalies
    : computeFallbackAnomalies(analysis?.m_score_result)

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <div className="page-header-left" style={{ flex: 1 }}>
          <h1>Analysis Report</h1>
          <p>Beneish M-Score results, financial anomaly detection, and forensic audit breakdown.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', minWidth: 200 }}
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
        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <WaveLoader message="Loading analysis…" colour="var(--text-muted)" />
        </div>
      ) : !analysis ? (
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <h3>No Analysis Available</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
            Please upload at least two years of financial statements for this company.
          </p>
        </div>
      ) : (
        <div className="section-gap" style={{ marginTop: 24 }}>
          {/* M-Score Gauge + Run Info */}
          <div className="row" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div className="flex-1" style={{ flex: 1, minWidth: 300 }}>
              <div className="card">
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid var(--border)' }}>
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
                  <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                    Threshold: -1.78
                  </p>
                </div>
              </div>
            </div>

            <div style={{ width: 260, flexShrink: 0 }}>
              <div className="card" style={{ height: '100%' }}>
                <div className="card-header" style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
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
                        <tr key={label} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 0', fontSize: 12, color: 'var(--text-secondary)' }}>{label}</td>
                          <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Anomaly Detection Section */}
          <AnomalyDetectionSection
            anomalies={anomalies}
            yearCurr={analysis.year_curr}
            yearPrev={analysis.year_prev}
          />

          {/* Indicators Coefficient Table */}
          <div className="card" style={{ marginTop: 24 }}>
            <div className="card-header" style={{ padding: 16, borderBottom: '1px solid var(--border)' }}>
              <span className="card-title" style={{ fontWeight: 'bold' }}>Indicator Coefficients</span>
            </div>
            <div className="table-wrapper" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>Symbol</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)' }}>Indicator Name</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>Coefficient</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>Calculated Value</th>
                    <th style={{ padding: '12px 16px', fontSize: 12, color: 'var(--text-secondary)', textAlign: 'right' }}>Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {BENEISH_INDICATORS.map((ind) => {
                    const val = analysis.m_score_result[ind.dbKey]
                    const contrib = val !== null ? (val * ind.coefficient) : null
                    return (
                      <tr key={ind.symbol} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <code style={{ background: 'var(--tbd-bg)', color: '#3b82f6', padding: '2px 7px', borderRadius: 4, fontWeight: 700, fontSize: 12 }}>
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
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500, fontSize: 13, color: 'var(--text-primary)' }}>
                          {contrib !== null ? (contrib >= 0 ? '+' : '') + contrib.toFixed(4) : 'N/A'}
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background: 'var(--main-bg)' }}>
                    <td colSpan={2} style={{ fontWeight: 600, color: 'var(--text-secondary)', padding: '12px 16px', fontSize: 13 }}>
                      Intercept
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#ef4444', padding: '12px 16px', fontSize: 13 }}>-4.84</td>
                    <td colSpan={2}></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 11.5, color: 'var(--text-muted)' }}>
              M = -4.84 + 0.920(DSRI) + 0.528(GMI) + 0.404(AQI) + 0.892(SGI) + 0.115(DEPI) - 0.172(SGAI) + 4.679(TATA) - 0.327(LVGI)
            </div>
          </div>
          
          <div style={{ padding: '14px 18px', background: 'var(--tbd-bg)', border: '1px solid var(--tbd-border)', borderRadius: 10, fontSize: 12.5, color: 'var(--tbd-text)', lineHeight: 1.6, marginTop: 24 }}>
            <strong>Disclaimer:</strong> FinOmaly is a financial screening and forensic-support tool.
            An elevated Beneish M-Score or anomaly flag does <strong>not</strong> establish fraud,
            manipulation, intent, or legal wrongdoing. Findings require appropriate human and professional evaluation.
          </div>
        </div>
      )}
    </div>
  )
}

