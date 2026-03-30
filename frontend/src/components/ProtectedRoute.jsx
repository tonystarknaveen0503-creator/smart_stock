import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { currentUser, authReady } = useAuth()
  const location = useLocation()

  if (!authReady) {
    return (
      <div className="status-screen">
        <div className="status-card">
          <p className="section-label">Smart Stock</p>
          <h2>Checking your session</h2>
          <p>Loading authentication details and preparing your dashboard.</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
