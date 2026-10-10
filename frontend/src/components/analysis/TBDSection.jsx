import { Construction } from 'lucide-react'

/**
 * Reusable TBD placeholder section.
 * Props: title, description, icon (optional lucide element)
 */
export default function TBDSection({ title, description, icon }) {
  return (
    <div className="tbd-section">
      <div className="tbd-section-icon">
        {icon || <Construction size={22} />}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
          <span className="tbd-section-title">{title}</span>
          <span className="tbd-badge">TBD</span>
        </div>
        <p className="tbd-section-desc">{description}</p>
      </div>
    </div>
  )
}

