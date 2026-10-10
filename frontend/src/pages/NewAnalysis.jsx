import { useState, useEffect } from 'react'
import { FileSpreadsheet, Loader } from 'lucide-react'
import FileUpload from '../components/ui/FileUpload'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function NewAnalysis() {
  const [companies, setCompanies] = useState([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('finomaly_token')
      const res = await fetch(API_BASE + '/api/v1/companies/', {
        headers: { Authorization: 'Bearer ' + token }
      })
      if (res.ok) {
        const data = await res.json()
        setCompanies(data)
        if (data.length > 0) setSelectedCompanyId(data[0].id)
      }
    }
    fetchCompanies()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !selectedCompanyId) return
    setLoading(true)
    setSuccess(false)

    try {
      const token = localStorage.getItem('finomaly_token')
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(API_BASE + '/api/v1/statements/upload/' + selectedCompanyId, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: formData
      })

      if (res.ok) {
        setSuccess(true)
        setFile(null)
      } else {
        const data = await res.json()
        alert('Upload failed: ' + (data.detail || 'Unknown error'))
      }
    } catch (err) {
      console.error(err)
      alert('Error uploading file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Analysis / CSV Upload</h1>
          <p className="page-description">Upload your canonical 13-variable CSV for a company.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24, maxWidth: 600 }}>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Select Target Company</label>
            <select 
              value={selectedCompanyId} 
              onChange={e => setSelectedCompanyId(e.target.value)}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}
              required
            >
              <option value="" disabled>Select a company...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.ticker})</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <FileUpload onFileSelect={(selectedFile) => setFile(selectedFile)} />
          </div>

          <button type="submit" disabled={loading || !file || !selectedCompanyId} className="btn btn-primary" style={{ justifyContent: 'center' }}>
            {loading ? 'Uploading...' : 'Upload Data'}
          </button>

          {success && (
            <div style={{ padding: 12, backgroundColor: '#dcfce3', color: '#166534', borderRadius: 6, textAlign: 'center' }}>
              Successfully uploaded and saved to the database!
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
