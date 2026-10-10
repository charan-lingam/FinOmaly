import TBDSection from '../components/analysis/TBDSection'
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'

const REQUIRED_INPUTS = [
  { symbol: 'S', name: 'Net Sales / Revenue', source: 'Income Statement' },
  { symbol: 'AR', name: 'Accounts Receivable', source: 'Balance Sheet' },
  { symbol: 'COGS', name: 'Cost of Goods Sold', source: 'Income Statement' },
  { symbol: 'CA', name: 'Total Current Assets', source: 'Balance Sheet' },
  { symbol: 'PPE', name: 'Net Property, Plant & Equipment', source: 'Balance Sheet' },
  { symbol: 'TA', name: 'Total Assets', source: 'Balance Sheet' },
  { symbol: 'Dep', name: 'Depreciation Expense', source: 'Income / CF Statement' },
  { symbol: 'SG&A', name: 'SG&A Expenses', source: 'Income Statement' },
  { symbol: 'TL', name: 'Total Liabilities', source: 'Balance Sheet' },
  { symbol: 'ICO', name: 'Income from Continuing Operations', source: 'Income Statement' },
  { symbol: 'CFO', name: 'Net Cash Flow from Operations', source: 'Cash Flow Statement' },
]

export default function NewAnalysis() {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>New Analysis</h1>
          <p>Upload financial statements and compute the Beneish M-Score.</p>
        </div>
      </div>

      <div className="section-gap">
        {/* Step 1 — Company Selection TBD */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Step 1 — Select Company</span>
            <span className="tbd-badge">TBD</span>
          </div>
          <div className="card-body">
            <TBDSection
              title="Company Selector"
              description="Dropdown to select an existing company or create a new one within your organization. Requires backend authentication and company API."
            />
          </div>
        </div>

        {/* Step 2 — File Upload TBD */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Step 2 — Upload Financial Statements</span>
            <span className="tbd-badge">TBD</span>
          </div>
          <div className="card-body">
            <TBDSection
              title="File Upload"
              description="Drag-and-drop or click to upload CSV / Excel financial statements. Supports a single combined file or separate Income Statement, Balance Sheet, and Cash Flow files."
              icon={<UploadCloud size={22} />}
            />

            {/* Accepted formats info */}
            <div
              style={{
                marginTop: 16,
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              {['Combined .CSV', 'Combined .XLSX', 'Separate IS + BS + CF'].map((fmt) => (
                <div
                  key={fmt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: 'var(--main-bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '6px 12px',
                    fontSize: 12.5,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <FileSpreadsheet size={13} />
                  {fmt}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3 — Validation TBD */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Step 3 — Validation & Field Mapping</span>
            <span className="tbd-badge">TBD</span>
          </div>
          <div className="card-body">
            <TBDSection
              title="Auto-Validation"
              description="Backend will automatically detect financial years, validate required fields, map line items to Beneish inputs, and report any errors or ambiguities before analysis."
              icon={<CheckCircle2 size={22} />}
            />
          </div>
        </div>

        {/* Required Inputs Reference */}
        <div className="card">
          <div className="card-header" style={{ paddingBottom: 12 }}>
            <span className="card-title">Required Financial Inputs</span>
            <span className="badge badge-blue">11 inputs</span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Description</th>
                  <th>Typical Source</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {REQUIRED_INPUTS.map((inp) => (
                  <tr key={inp.symbol}>
                    <td>
                      <code
                        style={{
                          background: 'var(--blue-light)',
                          color: 'var(--blue)',
                          padding: '2px 7px',
                          borderRadius: 4,
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {inp.symbol}
                      </code>
                    </td>
                    <td style={{ fontWeight: 500 }}>{inp.name}</td>
                    <td className="text-secondary">{inp.source}</td>
                    <td>
                      <span className="badge badge-muted" style={{ gap: 4 }}>
                        <AlertCircle size={11} /> Awaiting Upload
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 4 — Run Analysis TBD */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Step 4 — Run Analysis</span>
            <span className="tbd-badge">TBD</span>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              className="btn btn-primary"
              disabled
              style={{ opacity: 0.45, cursor: 'not-allowed' }}
              title="Run Analysis — Available after upload and validation"
            >
              Run Beneish M-Score Analysis
            </button>
            <span className="text-muted">
              Enabled after successful upload and validation.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

