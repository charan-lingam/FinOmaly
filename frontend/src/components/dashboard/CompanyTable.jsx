import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const MOCK_COMPANIES = [
  {
    id: 1,
    name: 'Apex Industries Ltd',
    industry: 'Manufacturing',
    lastAnalysis: 'FY2024',
    mScore: -1.43,
    risk: 'High',
    analyses: 5,
  },
  {
    id: 2,
    name: 'BlueSky Technologies',
    industry: 'Technology',
    lastAnalysis: 'FY2024',
    mScore: -2.71,
    risk: 'Low',
    analyses: 4,
  },
  {
    id: 3,
    name: 'Greenfield Retail Co.',
    industry: 'Retail',
    lastAnalysis: 'FY2023',
    mScore: -2.05,
    risk: 'Low',
    analyses: 3,
  },
]

const RiskBadge = ({ risk }) => {
  if (risk === 'High') return <span className="badge badge-red">High Risk</span>
  if (risk === 'Medium') return <span className="badge badge-amber">Medium</span>
  return <span className="badge badge-green">Low Risk</span>
}

export default function CompanyTable() {
  return (
    <div className="card">
      <div className="card-header" style={{ paddingBottom: 16 }}>
        <span className="card-title">Recent Companies</span>
        <Link to="/companies" className="btn btn-outline btn-sm">
          View All
        </Link>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Industry</th>
              <th>Last Analysis</th>
              <th>M-Score</th>
              <th>Risk</th>
              <th>Analyses</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COMPANIES.map((co) => (
              <tr key={co.id}>
                <td style={{ fontWeight: 600 }}>{co.name}</td>
                <td className="text-secondary">{co.industry}</td>
                <td className="text-secondary">{co.lastAnalysis}</td>
                <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {co.mScore.toFixed(2)}
                </td>
                <td><RiskBadge risk={co.risk} /></td>
                <td className="text-secondary">{co.analyses}</td>
                <td>
                  <Link
                    to="/analysis/report"
                    className="btn btn-outline btn-sm"
                    style={{ gap: 4 }}
                  >
                    View <ArrowRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

