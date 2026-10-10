import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
import NewAnalysis from './pages/NewAnalysis'
import AnalysisReport from './pages/AnalysisReport'
import Login from './pages/Login'
import CompanyDetails from './pages/CompanyDetails'

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
    return <Navigate to="/login" replace />
  }
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('finomaly_token'))

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuth ? <Navigate to="/" replace /> : <Login setAuth={setIsAuth} />} />
        
        <Route path="/" element={<ProtectedRoute isAuth={isAuth}><Dashboard /></ProtectedRoute>} />
        <Route path="/companies" element={<ProtectedRoute isAuth={isAuth}><Companies /></ProtectedRoute>} />
        <Route path="/companies/:id" element={<ProtectedRoute isAuth={isAuth}><CompanyDetails /></ProtectedRoute>} />
        <Route path="/analysis/new" element={<ProtectedRoute isAuth={isAuth}><NewAnalysis /></ProtectedRoute>} />
        <Route path="/analysis/report" element={<ProtectedRoute isAuth={isAuth}><AnalysisReport /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}


