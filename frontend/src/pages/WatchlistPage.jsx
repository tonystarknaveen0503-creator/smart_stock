import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/dashboard/Card'
import Navbar from '../components/dashboard/Navbar'
import Sidebar from '../components/dashboard/Sidebar'
import Table from '../components/dashboard/Table'
import { useBackendAuth } from '../context/BackendAuthContext'

const initialWatchlist = [
  {
    stock: 'Reliance Industries',
    price: '$64.80',
    change: '+1.84%',
    high: '$65.24',
    low: '$63.92',
    volume: '12.4M',
    positive: true,
  },
  {
    stock: 'Infosys',
    price: '$18.42',
    change: '+0.62%',
    high: '$18.68',
    low: '$18.01',
    volume: '8.1M',
    positive: true,
  },
  {
    stock: 'HDFC Bank',
    price: '$21.26',
    change: '-0.48%',
    high: '$21.80',
    low: '$21.02',
    volume: '5.6M',
    positive: false,
  },
  {
    stock: 'Tata Motors',
    price: '$12.14',
    change: '+2.14%',
    high: '$12.36',
    low: '$11.74',
    volume: '9.8M',
    positive: true,
  },
]

function WatchlistPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useBackendAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [watchlist, setWatchlist] = useState(initialWatchlist)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleAddStock = () => {
    const newStock = {
      stock: 'ICICI Bank',
      price: '$29.42',
      change: '+1.08%',
      high: '$29.70',
      low: '$28.95',
      volume: '7.2M',
      positive: true,
    }

    setWatchlist((current) => {
      if (current.some((item) => item.stock === newStock.stock)) {
        return current
      }

      return [newStock, ...current]
    })
  }

  const handleRemoveStock = (stockName) => {
    setWatchlist((current) => current.filter((item) => item.stock !== stockName))
  }

  const filteredWatchlist = useMemo(
    () => watchlist.filter((item) => item.stock.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery, watchlist],
  )

  const mostWatched = watchlist[0]
  const topGainer = [...watchlist].filter((item) => item.positive).sort((a, b) => Number.parseFloat(b.change) - Number.parseFloat(a.change))[0]
  const topLoser = [...watchlist].filter((item) => !item.positive).sort((a, b) => Number.parseFloat(a.change) - Number.parseFloat(b.change))[0]

  const quickCards = [
    { label: 'Most Watched Stock', value: mostWatched?.stock || '--', meta: mostWatched?.price || 'No data', tone: 'text-slate-900' },
    { label: 'Top Gainer', value: topGainer?.stock || '--', meta: topGainer?.change || 'No data', tone: 'text-green-600' },
    { label: 'Top Loser', value: topLoser?.stock || '--', meta: topLoser?.change || 'No data', tone: 'text-red-600' },
    { label: 'Alerts Triggered', value: '03', meta: '2 price alerts, 1 volume alert', tone: 'text-slate-900' },
  ]

  const columns = [
    { key: 'stock', label: 'Stock Name' },
    { key: 'price', label: 'Price' },
    { key: 'change', label: 'Change %' },
    { key: 'high', label: 'Day High' },
    { key: 'low', label: 'Day Low' },
    { key: 'volume', label: 'Volume' },
    { key: 'action', label: 'Action' },
  ]

  const rows = filteredWatchlist.map((item) => ({
    key: item.stock,
    stock: (
      <div>
        <p className="font-semibold text-gray-900">{item.stock}</p>
        <div className="mt-2 h-2 w-24 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-2 rounded-full ${item.positive ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: item.positive ? '72%' : '41%' }}
          />
        </div>
      </div>
    ),
    price: <span className="font-medium text-gray-900">{item.price}</span>,
    change: <span className={`font-semibold ${item.positive ? 'text-green-600' : 'text-red-600'}`}>{item.change}</span>,
    high: item.high,
    low: item.low,
    volume: item.volume,
    action: (
      <div className="flex flex-wrap justify-end gap-2">
        <button
          type="button"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-green-700"
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => handleRemoveStock(item.stock)}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-red-700"
        >
          Remove
        </button>
      </div>
    ),
  }))

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar activeItem="Watchlist" open={sidebarOpen} setOpen={setSidebarOpen} />

        <section className="flex-1 p-6">
          <Navbar currentUser={currentUser} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(true)} />

          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Watchlist</h1>
              <p className="mt-2 text-gray-500">Track your favorite stocks in real-time</p>
            </div>

            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {quickCards.map((card) => (
                <Card key={card.label} className="hover:scale-[1.02]">
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-3 text-xl font-bold text-gray-900">{card.value}</p>
                  <p className={`mt-2 text-sm font-semibold ${card.tone}`}>{card.meta}</p>
                </Card>
              ))}
            </section>

            <section className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search watchlist"
                  className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAddStock}
                className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700"
              >
                Add Stock
              </button>
            </section>

            {filteredWatchlist.length ? (
              <Table columns={columns} rows={rows} />
            ) : (
              <Card className="py-16 text-center">
                <p className="text-lg font-semibold text-gray-900">No stocks in your watchlist</p>
                <p className="mt-3 text-gray-500">Add stocks to start tracking live prices and day movement.</p>
                <button
                  type="button"
                  onClick={handleAddStock}
                  className="mt-6 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700"
                >
                  Add Stocks
                </button>
              </Card>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

export default WatchlistPage
