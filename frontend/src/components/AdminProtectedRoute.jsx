import { Navigate, useLocation } from 'react-router-dom'
import { useBackendAuth } from '../context/BackendAuthContext'

function AdminProtectedRoute({ children }) {
  const { currentUser, authReady } = useBackendAuth()
  const location = useLocation()

  if (!authReady) {
    return (
      <div className="status-screen">
        <div className="status-card">
          <p className="section-label">Smart Stock</p>
          <h2>Loading admin session</h2>
          <p>Checking admin access for the Smart Stock control panel.</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminProtectedRoute
