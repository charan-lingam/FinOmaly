import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Building2, AlertTriangle, CheckCircle2,
  ChevronDown, ChevronRight, TrendingUp, FileBarChart2,
  UploadCloud, Info, ShieldAlert, Search,
} from 'lucide-react'
import { WaveLoader } from '../components/ui/wave-loader'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

const THRESHOLD = -1.78

const INDICATORS = [
  { key: 'dsri',  label: "Days' Sales in Receivables Index",   coeff: 0.920,  risky: v => v > 1 },
  { key: 'gmi',   label: 'Gross Margin Index',                  coeff: 0.528,  risky: v => v > 1 },
  { key: 'aqi',   label: 'Asset Quality Index',                 coeff: 0.404,  risky: v => v > 1 },
  { key: 'sgi',   label: 'Sales Growth Index',                  coeff: 0.892,  risky: v => v > 1 },
  { key: 'depi',  label: 'Depreciation Index',                  coeff: 0.115,  risky: v => v > 1 },
  { key: 'sgai',  label: 'SG&A Expense Index',                  coeff: -0.172, risky: v => v > 1 },
  { key: 'lvgi',  label: 'Leverage Index',                      coeff: -0.327, risky: v => v > 1 },
  { key: 'tata',  label: 'Total Accruals to Total Assets',      coeff: 4.679,  risky: v => v > 0.05 },
]

// ── sub-components ─────────────────────────────────────────────────────────

function RiskBadge({ isManipulator, size = 'md' }) {
  const sm = size === 'sm'
  if (isManipulator) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444',
        border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 20,
        padding: sm ? '2px 10px' : '6px 14px',
        fontSize: sm ? 11 : 12, fontWeight: 700,
      }}>
        <AlertTriangle size={sm ? 11 : 13} /> HIGH RISK
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 20,
      padding: sm ? '2px 10px' : '6px 14px',
      fontSize: sm ? 11 : 12, fontWeight: 700,
    }}>
      <CheckCircle2 size={sm ? 11 : 13} /> LOW RISK
    </span>
  )
}

function IndicatorDot({ risky }) {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: risky ? '#ef4444' : '#10b981', flexShrink: 0,
    }} />
  )
}

// Radar chart for a single analysis run
function IndicatorRadar({ run }) {
  const data = INDICATORS.map(ind => {
    const v = run.m_score_result[ind.key]
    return { subject: ind.key.toUpperCase(), value: v !== null ? Math.min(v, 3) : 0, fullMark: 3 }
  })
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 700 }} />
        <PolarRadiusAxis angle={90} domain={[0, 3]} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} tickCount={4} />
        <Radar
          dataKey="value"
          stroke={run.m_score_result.is_manipulator ? '#ef4444' : '#3b82f6'}
          fill={run.m_score_result.is_manipulator ? '#ef4444' : '#3b82f6'}
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(v, name) => [v.toFixed(3), name]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

// Expandable detail row
function AnalysisRow({ run, index, isLatest }) {
  const [expanded, setExpanded] = useState(index === 0) // auto-expand latest
  const { m_score_result, year_curr, year_prev } = run
  const score = m_score_result.m_score
  const isManip = m_score_result.is_manipulator
  const flaggedCount = INDICATORS.filter(ind => {
    const v = m_score_result[ind.key]
    return v !== null && ind.risky(v)
  }).length

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px 20px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
          borderBottom: expanded ? '1px solid var(--border)' : 'none',
        }}
      >
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>

        {/* Year range */}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
            {year_prev} → {year_curr}
            {isLatest && (
              <span style={{
                marginLeft: 8, background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
              }}>LATEST</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {flaggedCount} indicator{flaggedCount !== 1 ? 's' : ''} flagged
          </div>
        </div>

        {/* M-Score */}
        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 90 }}>
          <div style={{
            fontSize: 22, fontWeight: 800,
            color: isManip ? '#dc2626' : '#16a34a',
          }}>
            {score !== null ? score.toFixed(3) : 'N/A'}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>M-Score</div>
        </div>

        {/* Risk badge */}
        <RiskBadge isManipulator={isManip} size="sm" />
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '20px 20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 24, alignItems: 'start' }}>

            {/* Indicator table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11 }}>Indicator</th>
                    <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11 }}>Description</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11 }}>Coeff</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11 }}>Value</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11 }}>Contribution</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11 }}>Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {INDICATORS.map(ind => {
                    const v = m_score_result[ind.key]
                    const flagged = v !== null && ind.risky(v)
                    const contrib = v !== null ? ind.coeff * v : null
                    return (
                      <tr 
                        key={ind.key} 
                        style={{ 
                          borderBottom: '1px solid var(--border)', 
                          background: flagged ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '9px 12px' }}>
                          <code style={{
                            background: flagged ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                            color: flagged ? '#f87171' : 'var(--text-primary)',
                            border: flagged ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border)',
                            padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: 11,
                          }}>{ind.key.toUpperCase()}</code>
                        </td>
                        <td style={{ padding: '9px 12px', color: 'var(--text-primary)', fontSize: 12 }}>{ind.label}</td>
                        <td style={{ padding: '9px 12px', textAlign: 'right', color: ind.coeff >= 0 ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: 12 }}>
                          {ind.coeff >= 0 ? '+' : ''}{ind.coeff}
                        </td>
                        <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {v !== null ? v.toFixed(4) : <span style={{ color: 'var(--text-muted)' }}>N/A</span>}
                        </td>
                        <td style={{ padding: '9px 12px', textAlign: 'right', color: 'var(--text-secondary)', fontSize: 12 }}>
                          {contrib !== null ? (contrib >= 0 ? '+' : '') + contrib.toFixed(4) : '—'}
                        </td>
                        <td style={{ padding: '9px 12px', textAlign: 'center' }}>
                          <IndicatorDot risky={flagged} />
                        </td>
                      </tr>
                    )
                  })}
                  {/* Intercept + total */}
                  <tr style={{ borderTop: '2px solid var(--border)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <td colSpan={2} style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: 12 }}>Intercept (constant)</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#ef4444', fontSize: 12 }}>-4.84</td>
                    <td colSpan={2} style={{ padding: '10px 12px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>
                      M = {score !== null ? score.toFixed(3) : 'N/A'}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', padding: '0 12px' }}>
                M = -4.84 + 0.920(DSRI) + 0.528(GMI) + 0.404(AQI) + 0.892(SGI) + 0.115(DEPI) − 0.172(SGAI) + 4.679(TATA) − 0.327(LVGI)
              </div>
            </div>

            {/* Radar chart */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8, textAlign: 'center' }}>
                Indicator Profile
              </div>
              <IndicatorRadar run={run} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
                Outer edge = higher value. Values &gt; 1 may be risky.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── main page ──────────────────────────────────────────────────────────────

export default function CompanyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('finomaly_token')
        const headers = { Authorization: 'Bearer ' + token }

        // Get company name from list (no dedicated GET /companies/:id endpoint yet)
        const resComp = await fetch(API_BASE + '/api/v1/companies/', { headers })
        if (resComp.ok) {
          const list = await resComp.json()
          setCompany(list.find(c => c.id === id) || null)
        }

        // Fetch all year-pair analyses for this company
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

  if (loading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center' }}>
        <WaveLoader message="Loading analysis history…" colour="var(--text-muted)" />
      </div>
    )
  }

  if (!company) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Company not found.</div>
  }

  const highRiskCount = analyses.filter(a => a.m_score_result.is_manipulator).length
  const latestScore = analyses[0]?.m_score_result?.m_score ?? null
  const latestIsManip = analyses[0]?.m_score_result?.is_manipulator ?? null

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Page header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/companies" className="btn btn-outline" style={{ padding: 8 }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 size={20} /> {company.name}
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>({company.ticker})</span>
            </h1>
            <p className="page-description">{company.industry}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => navigate('/trends?company=' + id)}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
          >
            <TrendingUp size={15} /> Trend Explorer
          </button>
          <Link to="/analysis/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <UploadCloud size={15} /> Upload Data
          </Link>
        </div>
      </div>

      {/* Summary strip */}
      {analyses.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          <SummaryCard label="Analysis Runs" value={analyses.length} />
          <SummaryCard
            label="Latest M-Score"
            value={latestScore !== null ? latestScore.toFixed(3) : 'N/A'}
            colour={latestIsManip ? '#dc2626' : '#16a34a'}
          />
          <SummaryCard label="High Risk Runs" value={highRiskCount} colour={highRiskCount > 0 ? '#dc2626' : '#16a34a'} />
          <SummaryCard label="Year Range"
            value={`${analyses.at(-1)?.year_prev} – ${analyses[0]?.year_curr}`}
          />
        </div>
      )}

      {/* History section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileBarChart2 size={16} style={{ color: 'var(--text-secondary)' }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>Analysis History</span>
        {analyses.length > 0 && (
          <span style={{ background: 'var(--sidebar-bg)', color: 'var(--text-secondary)', fontSize: 11, fontWeight: 700, padding: '1px 8px', borderRadius: 10 }}>
            {analyses.length} run{analyses.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Analysis runs */}
      {analyses.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <FileBarChart2 size={40} style={{ color: 'var(--border)', marginBottom: 16 }} />
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>No Analysis History Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 360, margin: '0 auto 20px' }}>
            Upload at least two years of financial statements to compute the Beneish M-Score and build a history.
          </p>
          <Link to="/analysis/new" className="btn btn-primary">
            <UploadCloud size={14} style={{ marginRight: 6 }} /> Upload Financial Data
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {analyses.map((run, i) => (
            <AnalysisRow key={i} run={run} index={i} isLatest={i === 0} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 16px', borderRadius: 8,
        background: 'var(--tbd-bg)', border: '1px solid var(--tbd-border)',
        fontSize: 12, color: 'var(--tbd-text)', lineHeight: 1.6,
      }}>
        <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong>Disclaimer:</strong> FinOmaly is a financial screening and forensic-support tool.
          An elevated Beneish M-Score or anomaly flag does <strong>not</strong> establish fraud,
          manipulation, intent, or legal wrongdoing. Findings require appropriate human and professional evaluation.
        </span>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, colour }) {
  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: colour || 'var(--text-primary)' }}>{value}</div>
    </div>
  )
}
