import { useState } from 'react'
import { Building2, Search, Plus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import TBDSection from '../components/analysis/TBDSection'

const MOCK_COMPANIES = [
  {
    id: 1,
    name: 'Apex Industries Ltd',
    industry: 'Manufacturing',
    analyses: 5,
    lastRun: '2024-11-12',
    mScore: -1.43,
    risk: 'High',
  },
  {
    id: 2,
    name: 'BlueSky Technologies',
    industry: 'Technology',
    analyses: 4,
    lastRun: '2024-10-03',
    mScore: -2.71,
    risk: 'Low',
  },
  {
    id: 3,
    name: 'Greenfield Retail Co.',
    industry: 'Retail',
    analyses: 3,
    lastRun: '2023-09-22',
    mScore: -2.05,
    risk: 'Low',
  },
]

const RiskBadge = ({ risk }) => {
  if (risk === 'High') return <span className="badge badge-red">High Risk</span>
  if (risk === 'Medium') return <span className="badge badge-amber">Medium</span>
  return <span className="badge badge-green">Low Risk</span>
}

export default function Companies() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Companies</h1>
          <p>All companies registered under your organization.</p>
        </div>
        <button
          className="btn btn-primary"
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
          disabled
          title="Add Company — TBD"
        >
          <Plus size={15} />
          Add Company
          <span className="tbd-badge" style={{ fontSize: 9 }}>TBD</span>
        </button>
      </div>

      {/* Search + filters row */}
      <div
        className="card"
        style={{ marginBottom: 20, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search companies…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            fontSize: 13.5,
            color: 'var(--text-primary)',
            background: 'transparent',
          }}
        />
        <button
          className="btn btn-outline btn-sm"
          disabled
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
          title="Filters — TBD"
        >
          Filters <span className="tbd-badge" style={{ fontSize: 9 }}>TBD</span>
        </button>
      </div>

      {/* Companies Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Building2 size={40} className="empty-state-icon" style={{ color: 'var(--text-muted)' }} />
            <p>No companies found matching "{search}".</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Last Run</th>
                  <th>Latest M-Score</th>
                  <th>Risk Level</th>
                  <th>Analyses</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((co) => (
                  <tr key={co.id}>
                    <td style={{ fontWeight: 600 }}>{co.name}</td>
                    <td className="text-secondary">{co.industry}</td>
                    <td className="text-secondary">{co.lastRun}</td>
                    <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                      {co.mScore.toFixed(2)}
                    </td>
                    <td>
                      <RiskBadge risk={co.risk} />
                    </td>
                    <td className="text-secondary">{co.analyses}</td>
                    <td>
                      <Link
                        to="/analysis/report"
                        className="btn btn-outline btn-sm"
                        style={{ gap: 4 }}
                      >
                        View Report <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* TBD — Pagination */}
      <div style={{ marginTop: 16 }}>
        <TBDSection
          title="Pagination & Sorting"
          description="Paginated and sortable company list will be available once connected to the backend API."
        />
      </div>
    </div>
  )
}

