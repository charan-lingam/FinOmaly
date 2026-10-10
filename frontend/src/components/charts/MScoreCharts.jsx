import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from 'recharts'

// ── Risk Distribution Donut ──────────────────────────────
const RISK_DATA = [
  { name: 'Low Risk',  value: 2, color: '#10b981' },
  { name: 'High Risk', value: 1, color: '#ef4444' },
]

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0f172a', color: '#f1f5f9',
      padding: '8px 12px', borderRadius: 8, fontSize: 12.5,
    }}>
      <strong style={{ color: payload[0].payload.color }}>{payload[0].name}</strong>
      {': '}{payload[0].value} compan{payload[0].value > 1 ? 'ies' : 'y'}
    </div>
  )
}

export function MScoreDonut() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Risk Distribution</span>
        <span style={{
          background: '#f59e0b', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '2px 7px',
          borderRadius: 4, letterSpacing: '0.5px',
        }}>MOCK</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={RISK_DATA}
            cx="50%" cy="55%"
            innerRadius={55} outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {RISK_DATA.map((entry) => (
              <Cell key={entry.name} fill={entry.color} fillOpacity={0.88} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
          <Legend
            iconType="circle"
            iconSize={9}
            wrapperStyle={{ fontSize: 12, paddingTop: 4 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Company M-Score Bar Chart ────────────────────────────
const COMPANY_SCORES = [
  { name: 'Apex Ind.',   score: -1.43 },
  { name: 'BlueSky',     score: -2.71 },
  { name: 'Greenfield',  score: -2.05 },
]

const THRESHOLD = -1.78

function companyBarColor(score) {
  return score > THRESHOLD ? '#ef4444' : '#10b981'
}

const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const score = payload[0].value
  return (
    <div style={{
      background: '#0f172a', color: '#f1f5f9',
      padding: '8px 12px', borderRadius: 8, fontSize: 12.5,
    }}>
      <strong style={{ color: '#60a5fa' }}>{label}</strong>
      <br />M-Score: <strong style={{ color: companyBarColor(score) }}>{score.toFixed(2)}</strong>
      <br /><span style={{ color: '#94a3b8', fontSize: 11 }}>
        {score > THRESHOLD ? '⚠ Above threshold (High Risk)' : '✓ Below threshold (Low Risk)'}
      </span>
    </div>
  )
}

export function CompanyScoreBar() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>M-Score by Company</span>
        <span style={{
          background: '#f59e0b', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '2px 7px',
          borderRadius: 4, letterSpacing: '0.5px',
        }}>MOCK</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={COMPANY_SCORES}
          margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11.5, fill: '#64748b' }}
            tickLine={false}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            domain={[-4, 0]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
          <ReferenceLine
            y={THRESHOLD}
            stroke="#ef4444"
            strokeDasharray="5 3"
            strokeWidth={1.5}
            label={{ value: '−1.78', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }}
          />
          <Bar dataKey="score" radius={[5, 5, 0, 0]} maxBarSize={48}>
            {COMPANY_SCORES.map((d) => (
              <Cell key={d.name} fill={companyBarColor(d.score)} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

