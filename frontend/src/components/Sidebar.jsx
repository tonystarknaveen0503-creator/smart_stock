const navigationItems = [
  'Dashboard',
  'Live Stock Price',
  'Charts',
  'Market Research',
  'News',
  'Broker Place',
  'API Document',
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="section-label">Smart Stock</p>
        <h1>Control Center</h1>
        <p>Track the market with a clean workspace for prices, research, and watchlists.</p>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {navigationItems.map((item) => (
          <button className="nav-item" key={item} type="button">
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
