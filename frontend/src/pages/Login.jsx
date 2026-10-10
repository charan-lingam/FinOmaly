import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import CascadeText from '../components/ui/CascadeText'

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function Login({ setAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSeed = async () => {
    try {
      await fetch(`${API_BASE}/api/v1/seed`, { method: 'POST' })
      alert('Test user seeded in database!')
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // OAuth2 form data requires URL encoded bodies, not JSON
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await fetch(`${API_BASE}/api/v1/login/access-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed')
      }

      // Store JWT token
      localStorage.setItem('finomaly_token', data.access_token)
      setAuth(true)
      navigate('/')
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--main-bg)' }}>
      <div style={{ width: 400, padding: 32, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CascadeText text="FinOmaly" as="div" fontSize="32px" color="var(--text-primary)" hoverColor="#2563eb" />
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Sign in to access your dashboard</p>
        </div>

        {error && (
          <div style={{ padding: 12, backgroundColor: 'var(--red-light)', color: '#ef4444', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)' }}
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', backgroundColor: 'var(--main-bg)', color: 'var(--text-primary)' }}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <span style={{ height: 1, backgroundColor: 'var(--border)', flex: 1 }}></span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>OR</span>
            <span style={{ height: 1, backgroundColor: 'var(--border)', flex: 1 }}></span>
          </div>
          <button onClick={handleSeed} type="button" className="btn btn-outline" style={{ fontSize: 12, padding: '4px 8px', marginTop: 16 }}>
            Seed Demo User
          </button>
        </div>
      </div>
    </div>
  )
}

