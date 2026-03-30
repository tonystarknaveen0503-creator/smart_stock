function Topbar({ currentUser, onLogout, watchlistCount }) {
  return (
    <header className="topbar">
      <div>
        <p className="section-label">Dashboard</p>
        <h2>Welcome back, {currentUser?.displayName || 'Investor'}</h2>
      </div>

      <div className="topbar-actions">
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

export default Topbar
