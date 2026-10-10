import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import KineticGrid from './components/ui/kinetic-grid'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
import NewAnalysis from './pages/NewAnalysis'
import AnalysisReport from './pages/AnalysisReport'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing'
import CompanyDetails from './pages/CompanyDetails'
import TrendExplorer from './pages/TrendExplorer'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}

function ProtectedRoute({ isAuth, children }) {
  if (!isAuth) {
    return <Navigate to="/welcome" replace />
  }
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('finomaly_token'))

  return (
    <BrowserRouter>
      <KineticGrid>
        <Routes>
          <Route path="/welcome" element={isAuth ? <Navigate to="/" replace /> : <Landing />} />
          <Route path="/login" element={isAuth ? <Navigate to="/" replace /> : <Login setAuth={setIsAuth} />} />
          <Route path="/signup" element={isAuth ? <Navigate to="/" replace /> : <Signup />} />
          
          <Route path="/" element={<ProtectedRoute isAuth={isAuth}><Dashboard /></ProtectedRoute>} />
          <Route path="/companies" element={<ProtectedRoute isAuth={isAuth}><Companies /></ProtectedRoute>} />
          <Route path="/companies/:id" element={<ProtectedRoute isAuth={isAuth}><CompanyDetails /></ProtectedRoute>} />
          <Route path="/analysis/new" element={<ProtectedRoute isAuth={isAuth}><NewAnalysis /></ProtectedRoute>} />
          <Route path="/analysis/report" element={<ProtectedRoute isAuth={isAuth}><AnalysisReport /></ProtectedRoute>} />
          <Route path="/trends" element={<ProtectedRoute isAuth={isAuth}><TrendExplorer /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute isAuth={isAuth}><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute isAuth={isAuth}><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </KineticGrid>
    </BrowserRouter>
  )
}


