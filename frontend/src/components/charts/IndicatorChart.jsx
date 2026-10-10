import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Cell, LabelList,
} from 'recharts'

const MOCK_INDICATORS = [
  { symbol: 'DSRI', name: "Days' Sales in Receivables", value: 1.45, coeff: 0.920 },
  { symbol: 'GMI',  name: 'Gross Margin Index',          value: 1.20, coeff: 0.528 },
  { symbol: 'AQI',  name: 'Asset Quality Index',         value: 1.10, coeff: 0.404 },
  { symbol: 'SGI',  name: 'Sales Growth Index',          value: 1.30, coeff: 0.892 },
  { symbol: 'DEPI', name: 'Depreciation Index',          value: 1.05, coeff: 0.115 },
  { symbol: 'SGAI', name: 'SG&A Expense Index',          value: 1.15, coeff: -0.172 },
  { symbol: 'TATA', name: 'Total Accruals / Total Assets',value: 0.12, coeff: 4.679 },
  { symbol: 'LVGI', name: 'Leverage Index',              value: 1.25, coeff: -0.327 },
]

const NEUTRAL = 1.0

function barColor(symbol, value) {
  if (symbol === 'TATA') return value > 0.05 ? '#ef4444' : '#10b981'
  return value > NEUTRAL ? '#ef4444' : '#10b981'
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#0f172a', color: '#f1f5f9',
      padding: '10px 14px', borderRadius: 8,
      fontSize: 12.5, lineHeight: 1.7,
    }}>
      <strong style={{ color: '#60a5fa' }}>{d.symbol}</strong> — {d.name}
      <br />Value: <strong style={{ color: barColor(d.symbol, d.value) }}>{d.value.toFixed(3)}</strong>
      <br />Coefficient: <strong>{d.coeff >= 0 ? '+' : ''}{d.coeff}</strong>
      <br />Contribution: <strong>{(d.coeff * d.value).toFixed(3)}</strong>
    </div>
  )
}

export default function IndicatorChart({ indicators = MOCK_INDICATORS, isMock = true }) {
  return (
    <div>
      {isMock && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            background: '#f59e0b', color: '#fff',
            fontSize: 10, fontWeight: 700, padding: '2px 7px',
            borderRadius: 4, letterSpacing: '0.5px',
          }}>
            MOCK DATA
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Values above the reference line (1.0) may indicate manipulation.
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={indicators}
          layout="vertical"
          margin={{ top: 4, right: 60, bottom: 4, left: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 2]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            type="category"
            dataKey="symbol"
            tick={{ fontSize: 12, fontWeight: 700, fill: '#1e293b' }}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <ReferenceLine
            x={NEUTRAL}
            stroke="#64748b"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            label={{ value: 'Neutral (1.0)', position: 'insideTopRight', fontSize: 10, fill: '#64748b' }}
          />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={22}>
            {indicators.map((d) => (
              <Cell key={d.symbol} fill={barColor(d.symbol, d.value)} fillOpacity={0.85} />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) => v.toFixed(2)}
              style={{ fontSize: 11, fontWeight: 600, fill: '#1e293b' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

