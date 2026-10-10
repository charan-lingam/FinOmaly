import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Activity, AlertTriangle, ArrowRight } from 'lucide-react'
import SplineScene from '../components/ui/SplineScene';
import AnimatedTextCycle from '../components/ui/AnimatedTextCycle';
import { GlassFilter, GlassButton, GlassEffect } from '../components/ui/LiquidGlass';

const API_BASE = import.meta.env.VITE_API_URL || 'https://finomaly-ejgp.onrender.com'

export default function Dashboard() {
  const [stats, setStats] = useState({ companies: 0 })
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('finomaly_token')
        const res = await fetch(API_BASE + '/api/v1/companies/', {
          headers: { Authorization: 'Bearer ' + token }
        })
        if (res.ok) {
          const companies = await res.json()
          setStats({ companies: companies.length })
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <GlassFilter />
      
      {/* 3D Hero Section */}
      <div style={{ 
        backgroundColor: '#020617', 
        color: '#f8fafc', 
        borderRadius: '24px', 
        display: 'flex', 
        position: 'relative', 
        overflow: 'hidden',
        minHeight: '360px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Left Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 56px', zIndex: 10, position: 'relative' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <span>Detect Financial</span> 
            <span style={{ color: '#3b82f6' }}>
              <AnimatedTextCycle words={["Anomalies", "Fraud", "Manipulation"]} interval={3500} />
            </span>
          </h1>
          <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '450px', marginBottom: '32px' }}>
            Run the Beneish M-Score engine against your company statements and instantly flag hidden manipulation risks.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <GlassButton onClick={() => navigate('/analysis/new')} style={{ padding: '12px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '15px' }}>
                Start New Analysis <ArrowRight size={18} />
              </div>
            </GlassButton>
          </div>
        </div>

        {/* Right 3D Scene */}
        <div style={{ flex: 1, position: 'relative', minWidth: '400px' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '100px', background: 'linear-gradient(90deg, #020617 0%, transparent 100%)', zIndex: 5, pointerEvents: 'none' }}></div>
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" 
            style={{ width: '100%', height: '100%', cursor: 'grab' }} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginTop: 24 }}>
        <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, backgroundColor: '#e0e7ff', color: '#4f46e5', borderRadius: 8 }}>
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Total Companies</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{stats.companies}</div>
          </div>
        </div>

        <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, backgroundColor: '#dcfce3', color: '#16a34a', borderRadius: 8 }}>
            <Activity size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 14 }}>Analyses Run</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>-</div>
          </div>
        </div>

        <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ padding: 12, backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 8 }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: 14 }}>High Risk Targets</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>-</div>
          </div>
        </div>
      </div>
    </div>
  )
}
