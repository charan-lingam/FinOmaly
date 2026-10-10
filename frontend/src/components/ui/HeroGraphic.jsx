import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const data = [
  { time: 'Q1', value: 4000 },
  { time: 'Q2', value: 3000 },
  { time: 'Q3', value: 2000 },
  { time: 'Q4', value: 2780 },
  { time: 'Q5', value: 1890 },
  { time: 'Q6', value: 2390 },
  { time: 'Q7', value: 3490 },
  { time: 'Q8', value: 4100 }, // Anomaly spike
  { time: 'Q9', value: 3200 },
  { time: 'Q10', value: 2800 },
];

export default function HeroGraphic() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.1)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '4px' }}>M-Score Analysis</div>
            <div style={{ color: '#f8fafc', fontSize: '24px', fontWeight: 700 }}>Real-time Scan</div>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.2)', 
            color: '#fca5a5', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            fontSize: '13px', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            height: 'fit-content'
          }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', display: 'inline-block', marginRight: '8px', animation: 'pulse 2s infinite' }}></span>
            Anomaly Detected
          </div>
        </div>

        <div style={{ width: '100%', height: 'calc(100% - 70px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              <ReferenceDot x="Q8" y={4100} r={6} fill="#ef4444" stroke="#7f1d1d" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
