import { useNavigate } from 'react-router-dom'
import { useBackendAuth } from '../context/BackendAuthContext'

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Live Stock Price', path: '/dashboard' },
  { label: 'Charts', path: '/dashboard' },
  { label: 'Market Research', path: '/dashboard' },
  { label: 'Currency', path: '/dashboard' },
  { label: 'IPO', path: '/dashboard' },
  { label: 'Live Insights', path: '/dashboard' },
  { label: 'News', path: '/dashboard' },
  { label: 'Broker Place', path: '/dashboard' },
  { label: 'Capital Market', path: '/dashboard' },
  { label: 'API Document', path: '/dashboard' },
]

function SmartSidebar() {
  const navigate = useNavigate()
  const { currentUser } = useBackendAuth()
  const items = currentUser?.role === 'admin'
    ? [...navigationItems, { label: 'Admin Panel', path: '/admin' }]
    : navigationItems

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="section-label">Smart Stock</p>
        <h1>Trader Console</h1>
        <p>
          Live market tracking, research, broker coverage, and watchlist control
          in one focused workspace.
        </p>
        <div className="sidebar-status">
          <span className="sidebar-status-dot" />
          <strong>{currentUser?.role === 'admin' ? 'Admin session' : 'Investor session'}</strong>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {items.map((item) => (
          <button
            className="nav-item"
            key={item.label}
            type="button"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>Workspace</span>
        <strong>{currentUser?.email || 'smartstock@email.com'}</strong>
      </div>
    </aside>
  )
}

export default SmartSidebar
