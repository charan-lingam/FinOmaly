import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroGraphic from '../components/ui/HeroGraphic';
import CascadeText from '../components/ui/CascadeText';
import AnimatedTextCycle from '../components/ui/AnimatedTextCycle';
import { GlassFilter, GlassButton, GlassEffect } from '../components/ui/LiquidGlass';
import { ArrowRight, ShieldAlert, BarChart3, Lock } from 'lucide-react';
import FeaturedProjectHeroDemo from '../components/ui/featured-project-demo';



export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <GlassFilter />
      
      {/* Navbar */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CascadeText text="FinOmaly" as="div" fontSize="24px" color="#f8fafc" hoverColor="#3b82f6" />
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '12.5px', 
            color: '#94a3b8', 
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '5px 12px',
            borderRadius: 20,
            fontWeight: 500 
          }}>
            developed by <span style={{ color: '#60a5fa', fontWeight: 600 }}>Trinetra189.</span>
          </span>
          <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Sign In</Link>
          <GlassButton onClick={() => navigate('/signup')} style={{ padding: '8px 24px', borderRadius: '12px' }}>
            <span style={{ color: '#fff', fontSize: '14px' }}>Get Started</span>
          </GlassButton>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FeaturedProjectHeroDemo />
      </div>
    </div>
  );
}
