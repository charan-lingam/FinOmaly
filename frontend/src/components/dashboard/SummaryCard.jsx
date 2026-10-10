import { Building2, BarChart3, AlertTriangle, Activity } from 'lucide-react'

// SVG circular ring progress indicator
function RingProgress({ pct = 0.5, color = '#3b82f6', size = 56, stroke = 5 }) {
  const r = (size - stroke * 2) / 2
  const c = 2 * Math.PI * r
  const offset = c - pct * c
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

const CARDS = [
  {
    label: 'Total Companies',
    value: '3',
    icon: <Building2 size={15} />,
    ringPct: 0.30,
    ringColor: '#3b82f6',
    sub: '3 of 10 capacity',
    iconBg: '#eff6ff',
    iconColor: '#3b82f6',
  },
  {
    label: 'Total Analyses',
    value: '12',
    icon: <BarChart3 size={15} />,
    ringPct: 0.60,
    ringColor: '#8b5cf6',
    sub: '12 of 20 runs',
    iconBg: '#f5f3ff',
    iconColor: '#8b5cf6',
  },
  {
    label: 'High Risk Flagged',
    value: '1',
    icon: <AlertTriangle size={15} />,
    ringPct: 0.33,
    ringColor: '#ef4444',
    sub: '1 of 3 companies',
    iconBg: '#fef2f2',
    iconColor: '#ef4444',
  },
  {
    label: 'Avg M-Score',
    value: '−2.14',
    icon: <Activity size={15} />,
    ringPct: 0.72,   // -2.14 on scale -5→0 ≈ 57%, scaled to feel
    ringColor: '#10b981',
    sub: 'Below −1.78 threshold',
    iconBg: '#ecfdf5',
    iconColor: '#10b981',
  },
]

export default function SummaryCard() {
  return (
    <div className="summary-grid">
      {CARDS.map((card) => (
        <div className="summary-card" key={card.label}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Icon pill */}
            <div
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: card.iconBg, color: card.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {card.icon}
            </div>

            {/* Ring progress */}
            <div style={{ position: 'relative', width: 56, height: 56 }}>
              <RingProgress pct={card.ringPct} color={card.ringColor} />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9.5, fontWeight: 700, color: card.ringColor,
              }}>
                {Math.round(card.ringPct * 100)}%
              </div>
            </div>
          </div>

          <div>
            <div className="summary-card-value">{card.value}</div>
            <div className="summary-card-label">{card.label}</div>
            <div className="summary-card-change mt-4">{card.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
