import { Navigate, useLocation } from 'react-router-dom'
import { useBackendAuth } from '../context/BackendAuthContext'

function BackendProtectedRoute({ children }) {
  const { currentUser, authReady } = useBackendAuth()
  const location = useLocation()

  if (!authReady) {
    return (
      <div className="status-screen">
        <div className="status-card">
          <p className="section-label">Smart Stock</p>
          <h2>Loading session</h2>
          <p>Checking backend login and preparing your dashboard.</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default BackendProtectedRoute
