import { useNavigate } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Markets', path: '/markets' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'Watchlist', path: '/watchlist' },
  { label: 'News', path: '/news' },
  { label: 'Settings', path: '/settings' },
]

function Sidebar({ activeItem = 'Dashboard', open, setOpen }) {
  const navigate = useNavigate()

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition-opacity duration-300 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#111827] px-5 py-6 text-slate-100 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/80">StockPro</p>
            <h1 className="mt-2 text-2xl font-bold text-white">Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            X
          </button>
        </div>

        <nav className="mt-10 space-y-2">
          {menuItems.map((item) => {
            const active = item.label === activeItem

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  navigate(item.path)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              </button>
            )
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Market Status</p>
          <p className="mt-3 text-sm font-semibold text-white">Live session active</p>
          <p className="mt-2 text-sm text-slate-400">Track markets, manage positions, and review insights in one place.</p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
