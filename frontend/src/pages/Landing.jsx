import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SplineScene from '../components/ui/SplineScene';
import CascadeText from '../components/ui/CascadeText';
import AnimatedTextCycle from '../components/ui/AnimatedTextCycle';
import { GlassFilter, GlassButton, GlassEffect } from '../components/ui/LiquidGlass';
import { ArrowRight, ShieldAlert, BarChart3, Lock } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GlassFilter />
      
      {/* Navbar */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CascadeText text="FinOmaly" as="div" fontSize="24px" color="#f8fafc" hoverColor="#3b82f6" />
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Sign In</Link>
          <GlassButton onClick={() => navigate('/signup')} style={{ padding: '8px 24px', borderRadius: '12px' }}>
            <span style={{ color: '#fff', fontSize: '14px' }}>Get Started</span>
          </GlassButton>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        
        {/* Left Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 80px', zIndex: 10, position: 'relative' }}>
          
          <h1 style={{ fontSize: '72px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <span>Detect Financial</span> 
            <span style={{ color: '#3b82f6' }}>
              <AnimatedTextCycle words={["Anomalies", "Fraud", "Manipulation"]} interval={3500} />
            </span>
            <span>in Seconds.</span>
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '550px', marginBottom: '48px' }}>
            Protect your investments using our advanced Beneish M-Score engine. FinOmaly analyzes corporate statements and instantly flags hidden manipulation risks.
          </p>
          
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <GlassButton onClick={() => navigate('/signup')} style={{ padding: '16px 32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '18px' }}>
                Start Analyzing <ArrowRight size={20} />
              </div>
            </GlassButton>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', padding: '16px 32px', borderRadius: '24px', fontSize: '18px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', backgroundColor: 'rgba(255,255,255,0.02)' }} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.02)'}>
              View Live Demo
            </Link>
          </div>

          {/* Feature highlights */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '72px' }}>
            {[
              { icon: ShieldAlert, title: "Fraud Detection", subtitle: "8-Variable M-Score" },
              { icon: BarChart3, title: "Fast Processing", subtitle: "Instant CSV Parsing" },
              { icon: Lock, title: "Secure Workspaces", subtitle: "Encrypted DB" }
            ].map((feat, idx) => (
              <GlassEffect key={idx} style={{ padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', minWidth: '220px' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(59,130,246,0.15)', color: '#60a5fa', borderRadius: '12px' }}>
                  <feat.icon size={24} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '15px', color: '#fff' }}>{feat.title}</strong>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>{feat.subtitle}</span>
                </div>
              </GlassEffect>
            ))}
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
