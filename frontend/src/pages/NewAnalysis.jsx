import { useState, useEffect } from 'react'
import { FileUploadCard } from '../components/ui/file-upload-card'
import { FileUpload } from '../components/ui/file-upload'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function NewAnalysis() {
  const [companies, setCompanies] = useState([])
  const [selectedCompanyId, setSelectedCompanyId] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [globalSuccess, setGlobalSuccess] = useState(false)
  const [uploadMode, setUploadMode] = useState('grid') // 'grid' | 'card'

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

  const handleFilesChange = (newFiles) => {
    const preparedFiles = newFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }))
    setFiles(prev => [...prev, ...preparedFiles])
    setGlobalSuccess(false)
  }

  const handleFileRemove = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (files.length === 0 || !selectedCompanyId) return
    setLoading(true)
    setGlobalSuccess(false)

    const token = localStorage.getItem('finomaly_token')

    for (const item of files) {
      if (item.status === 'completed') continue

      // Set to uploading
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading', progress: 30 } : f))

      try {
        const formData = new FormData()
        formData.append('file', item.file)

        // Simulate progress tick
        setTimeout(() => {
          setFiles(prev => prev.map(f => f.id === item.id && f.status === 'uploading' ? { ...f, progress: 75 } : f))
        }, 300)

        const res = await fetch(API_BASE + '/api/v1/statements/upload/' + selectedCompanyId, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token },
          body: formData
        })

        if (res.ok) {
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'completed', progress: 100 } : f))
          setGlobalSuccess(true)
        } else {
          const errData = await res.json().catch(() => ({}))
          console.error('Upload failed:', errData)
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', progress: 0 } : f))
        }
      } catch (err) {
        console.error('Error uploading file:', err)
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', progress: 0 } : f))
      }
    }

    setLoading(false)
  }

  const pendingFilesCount = files.filter(f => f.status !== 'completed').length

  return (
    <div className="page-container" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title">New Analysis / CSV Upload</h1>
          <p className="page-description">Upload your canonical 13-variable financial CSV data.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Company Selection Card */}
        <div className="card" style={{ padding: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text-primary)' }}>
            Target Company
          </label>
          <select 
            value={selectedCompanyId} 
            onChange={e => setSelectedCompanyId(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 14px', 
              borderRadius: 8, 
              border: '1px solid var(--border)',
              backgroundColor: 'var(--main-bg)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
            required
          >
            <option value="" disabled>Select a company...</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.ticker})</option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => setUploadMode('grid')}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid var(--border)',
              backgroundColor: uploadMode === 'grid' ? 'var(--blue, #3b82f6)' : 'var(--card-bg)',
              color: uploadMode === 'grid' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Animated Dropzone
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('card')}
            style={{
              padding: '6px 16px',
              borderRadius: 6,
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid var(--border)',
              backgroundColor: uploadMode === 'card' ? 'var(--blue, #3b82f6)' : 'var(--card-bg)',
              color: uploadMode === 'card' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Queue Card View
          </button>
        </div>

        {/* File Upload Component */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {uploadMode === 'grid' ? (
            <div 
              className="w-full rounded-xl border border-dashed overflow-hidden" 
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card-bg)' }}
            >
              <FileUpload onChange={handleFilesChange} />
            </div>
          ) : (
            <FileUploadCard 
              className="w-full"
              files={files}
              onFilesChange={handleFilesChange}
              onFileRemove={handleFileRemove}
            />
          )}
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button 
            type="button"
            onClick={handleUpload}
            disabled={loading || pendingFilesCount === 0 || !selectedCompanyId} 
            className="btn btn-primary" 
            style={{ 
              justifyContent: 'center', 
              padding: '12px 20px', 
              fontSize: '1rem',
              fontWeight: 600,
              cursor: (loading || pendingFilesCount === 0 || !selectedCompanyId) ? 'not-allowed' : 'pointer',
              opacity: (loading || pendingFilesCount === 0 || !selectedCompanyId) ? 0.6 : 1
            }}
          >
            {loading ? 'Uploading Files...' : pendingFilesCount > 0 ? `Upload ${pendingFilesCount} File(s)` : 'Select Files to Upload'}
          </button>

          {globalSuccess && (
            <div style={{ 
              padding: 14, 
              backgroundColor: 'rgba(34, 197, 94, 0.15)', 
              color: 'var(--green, #22c55e)', 
              borderRadius: 8, 
              textAlign: 'center',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              fontWeight: 500
            }}>
              ✓ File(s) successfully processed and indexed!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
