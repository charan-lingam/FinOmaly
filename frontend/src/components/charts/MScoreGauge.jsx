// SVG semicircle gauge for Beneish M-Score
// Range: -5 (safe/left) → 0.5 (manipulated/right)
// Threshold: -1.78

const GAUGE_MIN = -5
const GAUGE_MAX = 0.5
const CX = 150, CY = 155, R = 115, SW = 20

function pt(angleDeg) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CX + R * Math.cos(rad),
    y: CY - R * Math.sin(rad), // flipped y so 90° = top
  }
}

function arcPath(a1, a2) {
  const p1 = pt(a1)
  const p2 = pt(a2)
  const largeArc = Math.abs(a1 - a2) > 180 ? 1 : 0
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
}

function scoreToAngle(score) {
  const pct = Math.max(0, Math.min(1, (score - GAUGE_MIN) / (GAUGE_MAX - GAUGE_MIN)))
  return 180 - pct * 180 // 180° (left/safe) → 0° (right/danger)
}

const GREEN_END   = scoreToAngle(-2.5)  // ≈ 98°
const AMBER_END   = scoreToAngle(-1.78) // ≈ 74°
const THRESHOLD   = -1.78

export default function MScoreGauge({ score = null, loading = false }) {
  const displayScore = score ?? -1.43 // mock for TBD state
  const isMock = score === null

  const scoreAngle    = scoreToAngle(displayScore)
  const thresholdAngle = scoreToAngle(THRESHOLD)
  const needleLen     = R - 18
  const needlePt      = pt(scoreAngle)
  const threshPt      = pt(thresholdAngle)
  const threshOuter   = {
    x: CX + (R + 12) * Math.cos((thresholdAngle * Math.PI) / 180),
    y: CY - (R + 12) * Math.sin((thresholdAngle * Math.PI) / 180),
  }

  const riskLabel = displayScore > THRESHOLD ? 'High Risk' : displayScore > -2.5 ? 'Moderate' : 'Low Risk'
  const riskColor = displayScore > THRESHOLD ? '#ef4444' : displayScore > -2.5 ? '#f59e0b' : '#10b981'

  return (
    <div style={{ position: 'relative' }}>
      {isMock && (
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: '#f59e0b', color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '2px 7px',
          borderRadius: 4, letterSpacing: '0.5px',
        }}>
          MOCK DATA
        </div>
      )}

      <svg viewBox="0 0 300 175" style={{ width: '100%', display: 'block' }}>
        {/* Background track */}
        <path
          d={arcPath(180, 0)}
          fill="none" stroke="#e2e8f0"
          strokeWidth={SW} strokeLinecap="round"
        />

        {/* Green zone */}
        <path
          d={arcPath(180, GREEN_END)}
          fill="none" stroke="#10b981"
          strokeWidth={SW} strokeLinecap="round" opacity={0.9}
        />

        {/* Amber zone */}
        <path
          d={arcPath(GREEN_END, AMBER_END)}
          fill="none" stroke="#f59e0b"
          strokeWidth={SW} strokeLinecap="round" opacity={0.9}
        />

        {/* Red zone */}
        <path
          d={arcPath(AMBER_END, 0)}
          fill="none" stroke="#ef4444"
          strokeWidth={SW} strokeLinecap="round" opacity={0.9}
        />

        {/* Threshold marker tick */}
        <line
          x1={threshPt.x.toFixed(2)} y1={threshPt.y.toFixed(2)}
          x2={threshOuter.x.toFixed(2)} y2={threshOuter.y.toFixed(2)}
          stroke="#1e293b" strokeWidth={2.5} strokeLinecap="round"
        />
        <text
          x={(threshOuter.x + (thresholdAngle > 90 ? -4 : 4)).toFixed(1)}
          y={(threshOuter.y - 6).toFixed(1)}
          fontSize={9} fill="#64748b" fontWeight={600}
          textAnchor="middle"
        >
          −1.78
        </text>

        {/* Zone labels */}
        <text x="28"  y="158" fontSize={9} fill="#10b981" fontWeight={700}>SAFE</text>
        <text x="236" y="158" fontSize={9} fill="#ef4444" fontWeight={700}>RISK</text>

        {/* Needle shadow */}
        <line
          x1={CX} y1={CY}
          x2={(needlePt.x + 1.5).toFixed(2)} y2={(needlePt.y + 1.5).toFixed(2)}
          stroke="rgba(0,0,0,0.12)" strokeWidth={4} strokeLinecap="round"
        />
        {/* Needle */}
        <line
          x1={CX} y1={CY}
          x2={needlePt.x.toFixed(2)} y2={needlePt.y.toFixed(2)}
          stroke="#0f172a" strokeWidth={3.5} strokeLinecap="round"
        />

        {/* Center pivot */}
        <circle cx={CX} cy={CY} r={8} fill="#0f172a" />
        <circle cx={CX} cy={CY} r={4} fill="#f1f5f9" />

        {/* Score text */}
        <text
          x={CX} y={CY + 32}
          textAnchor="middle" fontSize={28} fontWeight={700}
          fill={riskColor}
        >
          {displayScore.toFixed(2)}
        </text>
        <text
          x={CX} y={CY + 50}
          textAnchor="middle" fontSize={12} fontWeight={600}
          fill={riskColor}
        >
          {riskLabel}
        </text>
        <text
          x={CX} y={CY + 64}
          textAnchor="middle" fontSize={10} fill="#94a3b8"
        >
          Threshold: −1.78
        </text>
      </svg>
    </div>
  )
}

