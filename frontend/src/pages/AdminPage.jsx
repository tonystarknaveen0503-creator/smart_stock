import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SmartSidebar from '../components/SmartSidebar'
import SmartTopbar from '../components/SmartTopbar'
import { useBackendAuth } from '../context/BackendAuthContext'
import { API_BASE_URL, request } from '../services/api'

function AdminPage() {
  const navigate = useNavigate()
  const { currentUser, token, logout } = useBackendAuth()
  const [summary, setSummary] = useState({
    users: [],
    watchlists: [],
    pagination: {
      users: { page: 1, totalPages: 1, total: 0 },
      watchlists: { page: 1, totalPages: 1, total: 0 },
      pageSize: 5,
    },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState('')
  const [editingSymbol, setEditingSymbol] = useState('')
  const [userPage, setUserPage] = useState(1)
  const [watchlistPage, setWatchlistPage] = useState(1)

  const loadSummary = async () => {
    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        userPage: String(userPage),
        watchlistPage: String(watchlistPage),
        pageSize: '5',
      })
      const payload = await request(`/admin/summary?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSummary(payload)
    } catch (requestError) {
      setError(requestError.message || 'Unable to load admin summary.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      return
    }
    loadSummary()
  }, [token, userPage, watchlistPage])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleStartEdit = (item) => {
    setEditingId(item.id)
    setEditingSymbol(item.symbol)
  }

  const handleSaveEdit = async () => {
    try {
      const payload = await request(`/admin/watchlists/${editingId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symbol: editingSymbol }),
      })

      setSummary((current) => ({
        ...current,
        watchlists: current.watchlists.map((item) =>
          item.id === editingId ? payload.item : item,
        ),
      }))
      setEditingId('')
      setEditingSymbol('')
    } catch (requestError) {
      setError(requestError.message || 'Unable to update watchlist.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await request(`/admin/watchlists/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSummary((current) => ({
        ...current,
        watchlists: current.watchlists.filter((item) => item.id !== id),
      }))
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete watchlist.')
    }
  }

  const handleExport = async (type) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/export/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Unable to export CSV.')
      }

      const csvText = await response.text()
      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `smartstock-${type}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (requestError) {
      setError(requestError.message || 'Unable to export CSV.')
    }
  }

  return (
    <main className="dashboard-shell">
      <SmartSidebar />

      <section className="dashboard-panel">
        <SmartTopbar
          currentUser={currentUser}
          onLogout={handleLogout}
          watchlistCount={summary.watchlists.length}
        />

        <div className="filter-bar">
          <div className="filter-group">
            <button className="secondary-button" type="button" onClick={loadSummary}>
              Refresh Admin Data
            </button>
          </div>
          <div className="filter-group">
            <button className="filter-pill" type="button" onClick={() => handleExport('users')}>
              Export Users CSV
            </button>
            <button
              className="filter-pill"
              type="button"
              onClick={() => handleExport('watchlists')}
            >
              Export Watchlists CSV
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          <article className="dashboard-card highlight-card span-two">
            <p className="card-title">Admin Panel</p>
            <h3>Users and watchlists</h3>
            <p>
              Manage registered Smart Stock users and review saved watchlist symbols from MongoDB.
            </p>
          </article>

          <article className="dashboard-card">
            <p className="card-title">Users</p>
            <h3>{summary.users.length}</h3>
            <p>Total registered accounts in the admin panel.</p>
          </article>

          <article className="dashboard-card">
            <p className="card-title">Watchlists</p>
            <h3>{summary.watchlists.length}</h3>
            <p>Total saved symbols across all Smart Stock users.</p>
          </article>

          <article className="dashboard-card span-two">
            <p className="card-title">User Accounts</p>
            {loading ? <p>Loading admin users...</p> : null}
            {error ? <p className="error-text">{error}</p> : null}
            {!loading && !error ? (
              <div className="table-wrap">
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            <div className="pagination-row">
              <button
                className="action-button"
                type="button"
                disabled={summary.pagination.users.page <= 1}
                onClick={() => setUserPage((current) => Math.max(current - 1, 1))}
              >
                Previous
              </button>
              <span>
                Page {summary.pagination.users.page} of {summary.pagination.users.totalPages}
              </span>
              <button
                className="action-button"
                type="button"
                disabled={
                  summary.pagination.users.page >= summary.pagination.users.totalPages
                }
                onClick={() =>
                  setUserPage((current) =>
                    Math.min(current + 1, summary.pagination.users.totalPages),
                  )
                }
              >
                Next
              </button>
            </div>
          </article>

          <article className="dashboard-card span-two">
            <p className="card-title">Watchlist Records</p>
            {!loading && !error ? (
              <div className="table-wrap">
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Saved</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.watchlists.map((item) => (
                      <tr key={item.id}>
                        <td>
                          {editingId === item.id ? (
                            <input
                              className="admin-input"
                              type="text"
                              value={editingSymbol}
                              onChange={(event) => setEditingSymbol(event.target.value.toUpperCase())}
                            />
                          ) : (
                            item.symbol
                          )}
                        </td>
                        <td>{item.user?.name || 'Unknown'}</td>
                        <td>{item.user?.email || 'Unknown'}</td>
                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                        <td>
                          <div className="admin-actions">
                            {editingId === item.id ? (
                              <button
                                className="action-button save"
                                type="button"
                                onClick={handleSaveEdit}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                className="action-button"
                                type="button"
                                onClick={() => handleStartEdit(item)}
                              >
                                Edit
                              </button>
                            )}
                            <button
                              className="action-button danger"
                              type="button"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            <div className="pagination-row">
              <button
                className="action-button"
                type="button"
                disabled={summary.pagination.watchlists.page <= 1}
                onClick={() => setWatchlistPage((current) => Math.max(current - 1, 1))}
              >
                Previous
              </button>
              <span>
                Page {summary.pagination.watchlists.page} of{' '}
                {summary.pagination.watchlists.totalPages}
              </span>
              <button
                className="action-button"
                type="button"
                disabled={
                  summary.pagination.watchlists.page >=
                  summary.pagination.watchlists.totalPages
                }
                onClick={() =>
                  setWatchlistPage((current) =>
                    Math.min(current + 1, summary.pagination.watchlists.totalPages),
                  )
                }
              >
                Next
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default AdminPage
