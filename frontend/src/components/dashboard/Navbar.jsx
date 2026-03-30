function Navbar({ currentUser, onLogout, onMenuToggle }) {
  const initials = (currentUser?.name || currentUser?.email || 'SP')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 mb-6 flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-md sm:px-6">
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-50 lg:hidden"
        aria-label="Open sidebar"
      >
        ☰
      </button>

      <div className="hidden min-w-0 flex-1 md:block">
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <span className="mr-3 text-slate-400">⌕</span>
          <input
            type="text"
            placeholder="Search stocks, sectors, or news"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-50"
          aria-label="Notifications"
        >
          🔔
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-600" />
        </button>

        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{currentUser?.name || 'StockPro User'}</p>
          <p className="text-xs text-slate-500">{currentUser?.email || 'market@stockpro.com'}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-md">
          {initials}
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="hidden rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:scale-105 hover:bg-slate-800 md:inline-flex"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
