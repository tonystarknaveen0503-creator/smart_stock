import { lazy, Suspense } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import BackendProtectedRoute from './components/BackendProtectedRoute'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const DashboardPage = lazy(() => import('./pages/SmartDashboardPage'))
const MarketsPage = lazy(() => import('./pages/MarketsPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function App() {
  return (
    <Suspense
      fallback={
        <div className="status-screen">
          <div className="status-card">
            <p className="section-label">Smart Stock</p>
            <h2>Loading page</h2>
            <p>Preparing the next view for your market workspace.</p>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <BackendProtectedRoute>
              <DashboardPage />
            </BackendProtectedRoute>
          }
        />
        <Route
          path="/markets"
          element={
            <BackendProtectedRoute>
              <MarketsPage />
            </BackendProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <BackendProtectedRoute>
              <PortfolioPage />
            </BackendProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <BackendProtectedRoute>
              <WatchlistPage />
            </BackendProtectedRoute>
          }
        />
        <Route
          path="/news"
          element={
            <BackendProtectedRoute>
              <NewsPage />
            </BackendProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <BackendProtectedRoute>
              <SettingsPage />
            </BackendProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminPage />
            </AdminProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App

