function SmartTopbar({ currentUser, onLogout, watchlistCount }) {
  const todayLabel = new Date().toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="topbar">
      <div>
        <p className="section-label">Dashboard</p>
        <h2>Welcome back, {currentUser?.name || 'Investor'}</h2>
        <p className="topbar-copy">
          Track markets, review signals, and manage your Smart Stock workspace.
        </p>
      </div>

      <div className="topbar-actions">
        <div className="topbar-pill">
          <span>Today</span>
          <strong>{todayLabel}</strong>
        </div>
        <div className="topbar-pill">
          <span>Watchlist</span>
          <strong>{watchlistCount}</strong>
        </div>
        <div className="topbar-pill">
          <span>Email</span>
          <strong>{currentUser?.email || 'Not available'}</strong>
        </div>
        <button className="secondary-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default SmartTopbar
