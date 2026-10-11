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
    <div style={{ position: 'relative', display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--main-bg)' }}>
      {/* Top right attribution */}
      <div style={{ 
        position: 'absolute', 
        top: 24, 
        right: 28, 
        fontSize: '13px', 
        color: 'var(--text-secondary)', 
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--border)',
        padding: '6px 14px',
        borderRadius: 20,
        fontWeight: 500,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        developed by <span style={{ color: 'var(--blue, #3b82f6)', fontWeight: 600 }}>Trinetra189.</span>
      </div>

      <div style={{ width: 400, padding: 32, backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 8, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        
        {/* Auth Toggle Buttons above FinOmaly name */}
        <div style={{ 
          display: 'flex', 
          gap: 6, 
          width: '100%', 
          marginBottom: 20, 
          background: 'rgba(255, 255, 255, 0.04)', 
          border: '1px solid var(--border)', 
          borderRadius: 8, 
          padding: 4 
        }}>
          <Link 
            to="/login"
            style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: '7px 12px', 
              borderRadius: 6, 
              fontSize: 13, 
              fontWeight: 600,
              textDecoration: 'none',
              backgroundColor: 'var(--blue, #3b82f6)',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.25)'
            }}
          >
            Login
          </Link>
          <Link 
            to="/signup"
            style={{ 
              flex: 1, 
              textAlign: 'center', 
              padding: '7px 12px', 
              borderRadius: 6, 
              fontSize: 13, 
              fontWeight: 600,
              textDecoration: 'none',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)'
            }}
          >
            Sign Up
          </Link>
        </div>

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
      </div>
    </div>
  )
}

