import SummaryCard from '../components/dashboard/SummaryCard'
import CompanyTable from '../components/dashboard/CompanyTable'
import { MScoreDonut, CompanyScoreBar } from '../components/charts/MScoreCharts'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Welcome back 👋</h1>
          <p>Here's a snapshot of your financial analysis activity.</p>
        </div>
        <Link to="/analysis/new" className="btn btn-primary">
          + New Analysis
        </Link>
      </div>

      {/* Summary Cards with Ring Progress */}
      <SummaryCard />

      <div className="section-gap">
        {/* Charts Row */}
        <div className="row">
          <div className="flex-1">
            <div className="card">
              <div className="card-header" style={{ paddingBottom: 4 }}>
                <span className="card-title">M-Score Risk Distribution</span>
              </div>
              <div className="card-body">
                <MScoreDonut />
              </div>
            </div>
          </div>

          <div style={{ flex: 2 }}>
            <div className="card">
              <div className="card-header" style={{ paddingBottom: 4 }}>
                <span className="card-title">M-Score by Company</span>
              </div>
              <div className="card-body">
                <CompanyScoreBar />
              </div>
            </div>
          </div>
        </div>

        {/* Company Table */}
        <CompanyTable />
      </div>
    </div>
  )
}
