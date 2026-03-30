import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/dashboard/Navbar'
import Sidebar from '../components/dashboard/Sidebar'
import { useBackendAuth } from '../context/BackendAuthContext'

const TIME_RANGES = {
  '1D': '5min',
  '1W': '15min',
  '1M': '60min',
  '1Y': 'daily',
}

const POPULAR_STOCKS = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META', 'RELIANCE.NS']

function PortfolioPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useBackendAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState('AAPL')
  const [timeRange, setTimeRange] = useState('1D')
  const [stockData, setStockData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [watchlist, setWatchlist] = useState(['AAPL', 'TSLA', 'GOOGL'])
  const [chartData, setChartData] = useState([])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const fetchStockData = useCallback(async (symbol) => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      generateMockData(symbol)
      setLoading(false)
    }, 500)
  }, [timeRange])

  const generateMockData = (symbol) => {
    const basePrice = { AAPL: 178, TSLA: 245, GOOGL: 141, MSFT: 378, AMZN: 178, NVDA: 495, META: 503, 'RELIANCE.NS': 2850 }[symbol] || 100
    const change = (Math.random() - 0.5) * 10
    setStockData({
      symbol,
      price: basePrice,
      change: change,
      changePercent: ((change / basePrice) * 100).toFixed(2),
      volume: Math.floor(Math.random() * 50000000) + 10000000,
      high: basePrice + Math.random() * 5,
      low: basePrice - Math.random() * 5,
      open: basePrice - Math.random() * 3,
      previousClose: basePrice - change,
    })
    generateMockChartData(basePrice, timeRange)
  }

  const generateMockChartData = (basePrice, range) => {
    const points = range === '1D' ? 78 : range === '1W' ? 40 : range === '1M' ? 30 : 252
    const data = []
    let price = basePrice * (0.85 + Math.random() * 0.15)
    for (let i = 0; i < points; i++) {
      price += (Math.random() - 0.48) * (basePrice * 0.02)
      data.push({
        time: i,
        price: parseFloat(price.toFixed(2)),
      })
    }
    setChartData(data)
  }

  useEffect(() => {
    fetchStockData(selectedStock)
  }, [selectedStock, timeRange, fetchStockData])

  useEffect(() => {
    const interval = setInterval(() => {
      if (stockData) {
        const newPrice = stockData.price + (Math.random() - 0.5) * 0.5
        setStockData(prev => ({
          ...prev,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat((newPrice - prev.previousClose).toFixed(2)),
          changePercent: (((newPrice - prev.previousClose) / prev.previousClose) * 100).toFixed(2),
        }))
        setChartData(prev => {
          const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, price: newPrice }]
          return newData
        })
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [stockData])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSelectedStock(searchQuery.trim().toUpperCase())
      setSearchQuery('')
    }
  }

  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol])
    }
  }

  const removeFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(s => s !== symbol))
  }

  const isPositive = stockData?.change >= 0
  const chartColor = isPositive ? '#22c55e' : '#ef4444'
  const changeTextColor = isPositive ? 'text-green-500' : 'text-red-500'

  return (
    <main className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <div className="flex min-h-screen">
        <Sidebar activeItem="Portfolio" open={sidebarOpen} setOpen={setSidebarOpen} />

        <section className="flex-1 p-6">
          <Navbar currentUser={currentUser} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(true)} />

          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Stock Market Dashboard
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Real-time stock data visualization</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className={`rounded-2xl border shadow-lg ${darkMode ? 'border-slate-700 bg-slate-800/80 shadow-slate-900/50' : 'border-white/50 bg-white/80 backdrop-blur-sm shadow-blue-200/50'}`}>
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{selectedStock}</h2>
                      {stockData && (
                        <div className="mt-2 flex items-center gap-4">
                          <span className="text-3xl font-bold text-slate-800 dark:text-blue-300">
                            ${stockData.price.toFixed(2)}
                          </span>
                          <span className={`text-lg font-semibold ${changeTextColor}`}>
                            {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent}%)
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {Object.keys(TIME_RANGES).map(range => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`rounded-lg px-4 py-2 font-semibold transition-all ${
                            timeRange === range
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                              : darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex h-80 items-center justify-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                    </div>
                  ) : error ? (
                    <div className="flex h-80 flex-col items-center justify-center gap-4">
                      <p className="text-rose-500">{error}</p>
                      <button onClick={() => fetchStockData(selectedStock)} className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-2.5 font-semibold text-white">
                        Retry
                      </button>
                    </div>
                  ) : (
                    <div className="relative h-80">
                      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={chartColor} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={chartColor} stopOpacity="0.05" />
                          </linearGradient>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={chartColor} />
                            <stop offset="100%" stopColor={isPositive ? '#16a34a' : '#dc2626'} />
                          </linearGradient>
                        </defs>
                        {chartData.length > 0 && (
                          <>
                            <path
                              d={`M ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((d.price - Math.min(...chartData.map(x => x.price))) / (Math.max(...chartData.map(x => x.price)) - Math.min(...chartData.map(x => x.price)))) * 100}`).join(' L ')} L 100,100 L 0,100 Z`}
                              fill="url(#chartGradient)"
                            />
                            <path
                              d={`M ${chartData.map((d, i) => `${(i / (chartData.length - 1)) * 100},${100 - ((d.price - Math.min(...chartData.map(x => x.price))) / (Math.max(...chartData.map(x => x.price)) - Math.min(...chartData.map(x => x.price)))) * 100}`).join(' L ')}`}
                              fill="none"
                              stroke="url(#lineGradient)"
                              strokeWidth="0.8"
                            />
                          </>
                        )}
                      </svg>
                    </div>
                  )}
                </div>

                {stockData && (
                  <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {[
                      { label: 'Open', value: `$${stockData.open.toFixed(2)}`, icon: '📊' },
                      { label: 'High', value: `$${stockData.high.toFixed(2)}`, icon: '📈' },
                      { label: 'Low', value: `$${stockData.low.toFixed(2)}`, icon: '📉' },
                      { label: 'Volume', value: `${(stockData.volume / 1000000).toFixed(2)}M`, icon: '📋' },
                    ].map(item => (
                      <div key={item.label} className={`rounded-xl border p-4 shadow-lg ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-white/50 bg-white/80 backdrop-blur-sm'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.icon}</span>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                        </div>
                        <p className="mt-2 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className={`rounded-2xl border p-6 shadow-lg ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-white/50 bg-white/80 backdrop-blur-sm'}`}>
                  <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Search Stock</h3>
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter ticker (e.g., AAPL)"
                      className={`flex-1 rounded-xl border p-3 outline-none transition-all focus:ring-2 focus:ring-purple-500 ${
                        darkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200'
                      }`}
                    />
                    <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105">
                      Search
                    </button>
                  </form>
                </div>

                <div className={`rounded-2xl border p-6 shadow-lg ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-white/50 bg-white/80 backdrop-blur-sm'}`}>
                  <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Watchlist</h3>
                  <div className="space-y-3">
                    {watchlist.map(symbol => (
                      <div
                        key={symbol}
                        className={`flex cursor-pointer items-center justify-between rounded-xl p-3 transition-all hover:scale-[1.02] ${
                          darkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'
                        } ${selectedStock === symbol ? 'ring-2 ring-purple-500' : ''}`}
                        onClick={() => setSelectedStock(symbol)}
                      >
                        <div>
                          <p className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{symbol}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Click to view</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromWatchlist(symbol) }}
                          className="text-rose-500 hover:text-rose-600 font-semibold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  {watchlist.length < 5 && (
                    <div className="mt-4">
                      <select
                        onChange={(e) => { if (e.target.value) addToWatchlist(e.target.value); e.target.value = '' }}
                        className={`w-full rounded-xl border p-3 outline-none ${darkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200'}`}
                        defaultValue=""
                      >
                        <option value="" disabled>Add stock...</option>
                        {POPULAR_STOCKS.filter(s => !watchlist.includes(s)).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className={`rounded-2xl border p-6 shadow-lg ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-white/50 bg-white/80 backdrop-blur-sm'}`}>
                  <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Popular Stocks</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {POPULAR_STOCKS.map(symbol => (
                      <button
                        key={symbol}
                        onClick={() => setSelectedStock(symbol)}
                        className={`rounded-xl p-3 text-center font-bold transition-all hover:scale-105 ${
                          selectedStock === symbol
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                            : darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border p-6 shadow-lg ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-white/50 bg-white/80 backdrop-blur-sm'}`}>
              <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Technical Indicators</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Moving Avg (20)</p>
                  <p className="mt-1 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${stockData ? (stockData.price * 0.98).toFixed(2) : '-'}
                  </p>
                  <p className="text-sm text-blue-500 font-semibold">SMA 20</p>
                </div>
                <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Moving Avg (50)</p>
                  <p className="mt-1 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${stockData ? (stockData.price * 0.95).toFixed(2) : '-'}
                  </p>
                  <p className="text-sm text-purple-500 font-semibold">SMA 50</p>
                </div>
                <div className={`rounded-xl p-4 ${darkMode ? 'bg-slate-700/50' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                  <p className="text-sm text-slate-500 dark:text-slate-400">RSI (14)</p>
                  <p className="mt-1 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {(30 + Math.random() * 40).toFixed(1)}
                  </p>
                  <p className="text-sm text-purple-500 font-semibold">Relative Strength</p>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border p-6 shadow-lg text-center ${darkMode ? 'border-slate-700 bg-slate-800/80' : 'border-white/50 bg-white/80 backdrop-blur-sm'}`}>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                🔄 Data refreshes automatically every 5 seconds. Market data is simulated for demonstration.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default PortfolioPage
