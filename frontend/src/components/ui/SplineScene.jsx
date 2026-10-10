import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineScene({ scene, style }) {
  return (
    <Suspense
      fallback={
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
          Loading 3D Experience...
        </div>
      }
    >
      <Spline
        scene={scene}
        style={style}
      />
    </Suspense>
  );
}
