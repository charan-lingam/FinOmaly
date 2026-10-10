import React from 'react';
import { Link } from 'react-router-dom';
import SplineScene from '../components/ui/SplineScene';
import CascadeText from '../components/ui/CascadeText';
import { ArrowRight, ShieldAlert, BarChart3, Lock } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CascadeText text="FinOmaly" as="div" fontSize="24px" color="#f8fafc" hoverColor="#3b82f6" />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', padding: '8px 16px', fontWeight: 500 }}>Sign In</Link>
          <Link to="/signup" style={{ backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600 }}>Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* Left Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 80px', zIndex: 10 }}>
          <h1 style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Detect Financial <span style={{ color: '#3b82f6' }}>Anomalies</span> in Seconds.
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '500px', marginBottom: '40px' }}>
            Protect your investments using our advanced Beneish M-Score engine. FinOmaly analyzes corporate statements and instantly flags hidden manipulation risks.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6', color: '#fff', padding: '14px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>
              Start Analyzing <ArrowRight size={20} />
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', padding: '14px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 600, textDecoration: 'none' }}>
              View Live Demo
            </Link>
          </div>

          {/* Feature highlights */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '8px' }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Fraud Detection</strong>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>8-Variable M-Score</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '8px' }}>
                <BarChart3 size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Fast Processing</strong>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Instant CSV Parsing</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '8px' }}>
                <Lock size={24} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '14px' }}>Secure Workspaces</strong>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Encrypted DB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3D Scene */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Subtle gradient overlay to blend the 3D scene into the dark background */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '150px', background: 'linear-gradient(90deg, #020617 0%, transparent 100%)', zIndex: 5, pointerEvents: 'none' }}></div>
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" 
            style={{ width: '100%', height: '100%', cursor: 'grab' }} 
          />
        </div>

      </main>
    </div>
  );
}
