import MScoreGauge from '../components/charts/MScoreGauge'
import IndicatorChart from '../components/charts/IndicatorChart'
import TBDSection from '../components/analysis/TBDSection'
import { TrendingUp, AlertOctagon, FileDown } from 'lucide-react'

const BENEISH_INDICATORS = [
  { symbol: 'DSRI', name: "Days' Sales in Receivables Index", coefficient: 0.920, value: null },
  { symbol: 'GMI',  name: 'Gross Margin Index',                coefficient: 0.528, value: null },
  { symbol: 'AQI',  name: 'Asset Quality Index',               coefficient: 0.404, value: null },
  { symbol: 'SGI',  name: 'Sales Growth Index',                coefficient: 0.892, value: null },
  { symbol: 'DEPI', name: 'Depreciation Index',                coefficient: 0.115, value: null },
  { symbol: 'SGAI', name: 'SG&A Expense Index',               coefficient: -0.172, value: null },
  { symbol: 'TATA', name: 'Total Accruals to Total Assets',    coefficient: 4.679, value: null },
  { symbol: 'LVGI', name: 'Leverage Index',                    coefficient: -0.327, value: null },
]

export default function AnalysisReport() {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Analysis Report</h1>
          <p>Beneish M-Score results, indicator breakdown, and anomaly findings.</p>
        </div>
        <button
          className="btn btn-outline"
          disabled
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
          title="PDF Export — TBD"
        >
          <FileDown size={14} />
          Export PDF
          <span className="tbd-badge" style={{ fontSize: 9 }}>TBD</span>
        </button>
      </div>

      <div className="section-gap">
        {/* M-Score Gauge + Run Info */}
        <div className="row">
          <div className="flex-1">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Beneish M-Score</span>
                <span style={{
                  background: '#f59e0b', color: '#fff',
                  fontSize: 10, fontWeight: 700, padding: '2px 7px',
                  borderRadius: 4, letterSpacing: '0.5px',
                }}>MOCK DATA</span>
              </div>
              <div className="card-body">
                <MScoreGauge score={null} />
                <p style={{
                  textAlign: 'center', fontSize: 11.5,
                  color: '#94a3b8', marginTop: 8,
                }}>
                  Connect a real analysis run to display actual results.
                </p>
              </div>
            </div>
          </div>

          <div style={{ width: 260, flexShrink: 0 }}>
            <div className="card" style={{ height: '100%' }}>
              <div className="card-header">
                <span className="card-title">Run Info</span>
              </div>
              <div className="card-body">
                <table style={{ width: '100%' }}>
                  <tbody>
                    {[
                      ['Company', '—'],
                      ['Analysis Year', '—'],
                      ['Prior Year', '—'],
                      ['Run Date', '—'],
                      ['Status', <span className="badge badge-muted">No Run Yet</span>],
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

        {/* Beneish Indicators Bar Chart */}
        <div className="card">
          <div className="card-header" style={{ paddingBottom: 12 }}>
            <span className="card-title">Beneish Indicator Values</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                <span style={{ color: '#ef4444', fontWeight: 700 }}>■</span> Elevated &nbsp;
                <span style={{ color: '#10b981', fontWeight: 700 }}>■</span> Normal
              </span>
            </div>
          </div>
          <div className="card-body">
            <IndicatorChart />
          </div>
        </div>

        {/* Indicators Coefficient Table */}
        <div className="card">
          <div className="card-header" style={{ paddingBottom: 12 }}>
            <span className="card-title">Indicator Coefficients</span>
            <span className="tbd-badge">Calculated Values TBD</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Indicator Name</th>
                  <th style={{ textAlign: 'right' }}>Coefficient</th>
                  <th style={{ textAlign: 'right' }}>Calculated Value</th>
                  <th style={{ textAlign: 'right' }}>Contribution</th>
                </tr>
              </thead>
              <tbody>
                {BENEISH_INDICATORS.map((ind) => (
                  <tr key={ind.symbol}>
                    <td>
                      <code style={{
                        background: '#eff6ff', color: '#3b82f6',
                        padding: '2px 7px', borderRadius: 4,
                        fontWeight: 700, fontSize: 12,
                      }}>
                        {ind.symbol}
                      </code>
                    </td>
                    <td style={{ fontWeight: 500 }}>{ind.name}</td>
                    <td style={{
                      textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                      color: ind.coefficient >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                    }}>
                      {ind.coefficient >= 0 ? '+' : ''}{ind.coefficient}
                    </td>
                    <td style={{ textAlign: 'right', color: '#94a3b8' }}>—</td>
                    <td style={{ textAlign: 'right', color: '#94a3b8' }}>—</td>
                  </tr>
                ))}
                <tr style={{ background: '#f8fafc' }}>
                  <td colSpan={2} style={{ fontWeight: 600, color: '#64748b', padding: '12px 16px' }}>
                    Intercept
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#ef4444' }}>−4.84</td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', fontSize: 11.5, color: '#94a3b8' }}>
            M = −4.84 + 0.920(DSRI) + 0.528(GMI) + 0.404(AQI) + 0.892(SGI) + 0.115(DEPI) − 0.172(SGAI) + 4.679(TATA) − 0.327(LVGI)
          </div>
        </div>

        {/* Anomaly Findings — TBD */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Anomaly Findings</span>
            <span className="tbd-badge">TBD</span>
          </div>
          <div className="card-body">
            <TBDSection
              title="Rule-Based Anomaly Detection"
              description="Rule-based checks and historical trend analysis will flag unusual patterns — showing the flagged metric, relevant values, historical change, and suggested area for human review."
              icon={<AlertOctagon size={22} />}
            />
          </div>
        </div>

        {/* Historical Trend Chart — TBD */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Historical Financial Trends</span>
            <span className="tbd-badge">TBD</span>
          </div>
          <div className="card-body">
            <TBDSection
              title="Multi-Year Trend Chart"
              description="Interactive line chart showing key financial metrics across all available financial years for this company — Revenue, Gross Margin, Leverage, and all 8 Beneish indicators over time."
              icon={<TrendingUp size={22} />}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 10, padding: '14px 18px',
          fontSize: 12.5, color: '#1e40af', lineHeight: 1.6,
        }}>
          <strong>Disclaimer:</strong> FinOmaly is a financial screening and forensic-support tool.
          An elevated Beneish M-Score or anomaly flag does <strong>not</strong> establish fraud,
          manipulation, intent, or legal wrongdoing. Findings require appropriate human and
          professional evaluation.
        </div>
      </div>
    </div>
  )
}
