import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const payload = {
        email,
        password,
        org_name: orgName || undefined
      }

      const response = await fetch('https://finomaly-ejgp.onrender.com/api/v1/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed')
      }

      setSuccess('Account created successfully! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ width: 400, padding: 32, backgroundColor: 'white', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0, color: '#0f172a' }}>FinOmaly</h1>
          <p style={{ color: '#64748b', marginTop: 8 }}>Create your account</p>
        </div>

        {error && (
          <div style={{ padding: 12, backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: 12, backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}
              placeholder="you@example.com"
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}
              placeholder="Minimum 6 characters"
              required 
              minLength={6}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500 }}>Organization Name (Optional)</label>
            <input 
              type="text" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #e2e8f0' }}
              placeholder="Your Company Ltd"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading || !!success}
          >
            {loading ? 'Creating Account...' : <><UserPlus size={16} /> Sign Up</>}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
