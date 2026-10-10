import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
import NewAnalysis from './pages/NewAnalysis'
import AnalysisReport from './pages/AnalysisReport'

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/companies" element={<AppLayout><Companies /></AppLayout>} />
        <Route path="/analysis/new" element={<AppLayout><NewAnalysis /></AppLayout>} />
        <Route path="/analysis/report" element={<AppLayout><AnalysisReport /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

