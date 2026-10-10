import { useState, useEffect } from 'react'
import { TrendingUp, Building2, Loader, Info } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

// ── helpers ────────────────────────────────────────────────────────────────

function fmt(val) {
  if (val === null || val === undefined) return 'N/A'
  const abs = Math.abs(val)
  if (abs >= 1e9) return (val / 1e9).toFixed(2) + 'B'
  if (abs >= 1e6) return (val / 1e6).toFixed(2) + 'M'
  if (abs >= 1e3) return (val / 1e3).toFixed(1) + 'K'
  return val.toFixed(2)
}

const THRESHOLD = -1.78

// Colour palette for lines
const COLOURS = {
  net_sales: '#3b82f6',
  gross_profit: '#10b981',
  cogs: '#f59e0b',
  accounts_receivable: '#8b5cf6',
  total_assets: '#06b6d4',
  total_liabilities: '#ef4444',
  cfo: '#14b8a6',
  sga_expense: '#f97316',
  depreciation: '#6366f1',
}

const BENEISH_COLOURS = {
  dsri: '#ef4444',
  gmi: '#10b981',
  aqi: '#f59e0b',
  sgi: '#3b82f6',
  depi: '#8b5cf6',
  sgai: '#06b6d4',
  lvgi: '#f97316',
  tata: '#ec4899',
}

// Tab definitions
const TABS = [
  { id: 'revenue', label: 'Revenue & Costs', keys: ['net_sales', 'gross_profit', 'cogs'] },
  { id: 'balance', label: 'Balance Sheet', keys: ['total_assets', 'total_liabilities', 'accounts_receivable'] },
  { id: 'cash',    label: 'Cash & Expenses', keys: ['cfo', 'sga_expense', 'depreciation'] },
  { id: 'beneish', label: 'Beneish Indicators', keys: ['dsri', 'gmi', 'aqi', 'sgi', 'depi', 'sgai', 'lvgi', 'tata'], isBeneish: true },
  { id: 'mscore',  label: 'M-Score Trend', keys: ['m_score'], isMScore: true },
]

const LABELS = {
  net_sales: 'Net Sales', gross_profit: 'Gross Profit', cogs: 'COGS',
  accounts_receivable: 'Accounts Receivable', total_assets: 'Total Assets',
  total_liabilities: 'Total Liabilities', cfo: 'Cash Flow from Ops',
  sga_expense: 'SG&A Expense', depreciation: 'Depreciation',
  dsri: 'DSRI', gmi: 'GMI', aqi: 'AQI', sgi: 'SGI',
  depi: 'DEPI', sgai: 'SGAI', lvgi: 'LVGI', tata: 'TATA',
  m_score: 'M-Score',
}

const BENEISH_DESC = {
  dsri: "Days' Sales in Receivables Index — measures receivables growth vs. sales",
  gmi:  "Gross Margin Index — deteriorating margin is a red flag",
  aqi:  "Asset Quality Index — increase may signal capitalised expenses",
  sgi:  "Sales Growth Index — high growth pressures earnings management",
  depi: "Depreciation Index — slower depreciation inflates earnings",
  sgai: "SG&A Expense Index — rising overhead signals inefficiency",
  lvgi: "Leverage Index — increased leverage raises manipulation risk",
  tata: "Total Accruals to Total Assets — core accrual manipulation signal",
}

// Custom tooltip
function CustomTooltip({ active, payload, label, isBeneish, isMScore }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0f172a', color: '#f1f5f9',
      padding: '10px 14px', borderRadius: 8,
      fontSize: 12.5, lineHeight: 1.8, minWidth: 160,
    }}>
      <strong style={{ color: '#60a5fa', display: 'block', marginBottom: 4 }}>{label}</strong>
      {payload.map(p => (
        <div key={p.dataKey}>
          <span style={{ color: p.color }}>● {LABELS[p.dataKey] || p.dataKey}</span>
          {': '}
          <strong style={{ color: isMScore
            ? (p.value > THRESHOLD ? '#ef4444' : '#10b981')
            : isBeneish ? (p.value > 1 ? '#ef4444' : '#10b981') : '#f1f5f9'
          }}>
            {p.value !== null && p.value !== undefined ? (isBeneish || isMScore ? p.value.toFixed(3) : fmt(p.value)) : 'N/A'}
          </strong>
        </div>
      ))}
    </div>
  )
}

// ── main component ─────────────────────────────────────────────────────────

export default function TrendExplorer() {
  const [companies, setCompanies] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('revenue')
  const [noData, setNoData] = useState(false)

  // Fetch company list
  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('finomaly_token')
      const res = await fetch(API_BASE + '/api/v1/companies/', {
        headers: { Authorization: 'Bearer ' + token }
      })
      if (res.ok) {
        const list = await res.json()
        setCompanies(list)
        if (list.length > 0) setSelectedId(list[0].id)
      }
    }
    fetchCompanies()
  }, [])

  // Fetch trends whenever company changes
  useEffect(() => {
    if (!selectedId) return
    const fetchTrends = async () => {
      setLoading(true)
      setNoData(false)
      try {
        const token = localStorage.getItem('finomaly_token')
        const res = await fetch(API_BASE + '/api/v1/trends/' + selectedId, {
          headers: { Authorization: 'Bearer ' + token }
        })
        if (res.ok) {
          const points = await res.json()
          setData(points)
          setNoData(points.length === 0)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchTrends()
  }, [selectedId])

  const tab = TABS.find(t => t.id === activeTab)
  const colourMap = tab?.isBeneish ? BENEISH_COLOURS : COLOURS
  const hasData = data.length > 0

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={22} /> Trend Explorer
          </h1>
          <p className="page-description">
            Visualise financial metrics and Beneish indicators across all available years for a company.
          </p>
        </div>

        {/* Company picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Building2 size={18} style={{ color: '#64748b' }} />
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            style={{
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid #e2e8f0', fontSize: 14,
              background: '#fff', cursor: 'pointer',
            }}
          >
            {companies.length === 0 && <option>No companies yet</option>}
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.ticker})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats strip */}
      {hasData && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <StatBadge label="Years of Data" value={data.length} />
          <StatBadge label="Latest M-Score"
            value={data.filter(d => d.m_score != null).at(-1)?.m_score?.toFixed(2) ?? 'N/A'}
            highlight={data.filter(d => d.m_score != null).at(-1)?.m_score > THRESHOLD ? 'red' : 'green'}
          />
          <StatBadge label="Earliest Year" value={data[0]?.year ?? '—'} />
          <StatBadge label="Latest Year" value={data.at(-1)?.year ?? '—'} />
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              border: activeTab === t.id ? '1.5px solid #1e293b' : '1.5px solid #e2e8f0',
              background: activeTab === t.id ? '#1e293b' : '#fff',
              color: activeTab === t.id ? '#fff' : '#475569',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* Chart card */}
      <div className="card" style={{ padding: 24 }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
            <Loader className="spin" style={{ marginBottom: 8 }} />
            <div>Loading trend data…</div>
          </div>
        ) : !hasData || noData ? (
          <EmptyState />
        ) : (
          <>
            <h3 style={{ marginBottom: 4, fontSize: 15, fontWeight: 700 }}>
              {tab.label}
            </h3>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 24 }}>
              {tab.isMScore
                ? `Values above ${THRESHOLD} indicate elevated manipulation risk (threshold shown as dashed line).`
                : tab.isBeneish
                ? 'Values above 1.0 (neutral) in the direction of their coefficient indicate higher manipulation risk.'
                : 'All monetary values are in the currency reported in uploaded statements.'}
            </p>

            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={data} margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={tab.isBeneish || tab.isMScore ? v => v.toFixed(1) : fmt}
                  width={56}
                />
                <Tooltip
                  content={
                    <CustomTooltip
                      isBeneish={tab.isBeneish}
                      isMScore={tab.isMScore}
                    />
                  }
                />
                <Legend
                  formatter={key => LABELS[key] || key}
                  wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                />

                {/* M-Score threshold line */}
                {tab.isMScore && (
                  <ReferenceLine
                    y={THRESHOLD}
                    stroke="#ef4444"
                    strokeDasharray="6 3"
                    strokeWidth={1.5}
                    label={{ value: '−1.78 threshold', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }}
                  />
                )}

                {/* Neutral line for Beneish */}
                {tab.isBeneish && (
                  <ReferenceLine
                    y={1}
                    stroke="#94a3b8"
                    strokeDasharray="5 3"
                    strokeWidth={1.2}
                    label={{ value: 'Neutral (1.0)', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
                  />
                )}

                {tab.keys.map(key => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colourMap[key] || '#94a3b8'}
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: colourMap[key] || '#94a3b8' }}
                    activeDot={{ r: 6 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>

            {/* Beneish legend detail */}
            {tab.isBeneish && (
              <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
                {tab.keys.map(key => (
                  <div key={key} style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    padding: '10px 12px', borderRadius: 8, background: '#f8fafc',
                    border: '1px solid #f1f5f9', fontSize: 12,
                  }}>
                    <span style={{
                      display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
                      background: BENEISH_COLOURS[key], flexShrink: 0, marginTop: 2,
                    }} />
                    <div>
                      <strong style={{ color: '#1e293b' }}>{key.toUpperCase()}</strong>
                      {' — '}
                      <span style={{ color: '#64748b' }}>{BENEISH_DESC[key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 16px', borderRadius: 8,
        background: '#fefce8', border: '1px solid #fde68a', fontSize: 12, color: '#92400e',
      }}>
        <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        An elevated Beneish M-Score or anomaly flag does not establish fraud, manipulation, intent, or legal wrongdoing. Findings require appropriate human and professional evaluation.
      </div>
    </div>
  )
}

function StatBadge({ label, value, highlight }) {
  const colour = highlight === 'red' ? '#dc2626' : highlight === 'green' ? '#16a34a' : '#1e293b'
  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: colour }}>{value}</div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94a3b8' }}>
      <TrendingUp size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: '#475569' }}>No financial data yet</div>
      <div style={{ fontSize: 13 }}>
        Upload at least one year of financial statements via <strong>New Analysis</strong> to see trends here.
      </div>
    </div>
  )
}
