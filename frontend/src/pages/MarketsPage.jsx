import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/dashboard/Card'
import Navbar from '../components/dashboard/Navbar'
import Sidebar from '../components/dashboard/Sidebar'
import Table from '../components/dashboard/Table'
import { useBackendAuth } from '../context/BackendAuthContext'

const filters = ['All', 'NSE', 'BSE', 'Commodities', 'Crypto']

const overviewCards = [
  { name: 'NIFTY 50', price: '22,145.60', change: '+1.12%', positive: true },
  { name: 'SENSEX', price: '73,420.18', change: '+0.94%', positive: true },
  { name: 'BANK NIFTY', price: '48,215.45', change: '-0.28%', positive: false },
  { name: 'FINNIFTY', price: '21,082.10', change: '+0.63%', positive: true },
]

const stockRows = [
  { company: 'Reliance Industries', market: 'NSE', price: '$64.80', change: '+1.84%', volume: '12.4M', cap: '$245B', action: 'Buy', positive: true },
  { company: 'Infosys', market: 'NSE', price: '$18.42', change: '+0.62%', volume: '8.1M', cap: '$76B', action: 'Buy', positive: true },
  { company: 'HDFC Bank', market: 'BSE', price: '$21.26', change: '-0.48%', volume: '5.6M', cap: '$120B', action: 'Buy', positive: false },
  { company: 'Tata Motors', market: 'NSE', price: '$12.14', change: '+2.14%', volume: '9.8M', cap: '$45B', action: 'Buy', positive: true },
  { company: 'Bitcoin', market: 'Crypto', price: '$68,420', change: '+3.12%', volume: '24.3B', cap: '$1.3T', action: 'Buy', positive: true },
]

const gainers = [
  { name: 'TCS', price: '$48.62', change: '+3.48%' },
  { name: 'Bharti Airtel', price: '$16.30', change: '+2.96%' },
  { name: 'Sun Pharma', price: '$21.72', change: '+2.41%' },
  { name: 'LTIMindtree', price: '$58.44', change: '+2.16%' },
]

const losers = [
  { name: 'ITC', price: '$5.98', change: '-1.76%' },
  { name: 'Kotak Bank', price: '$18.94', change: '-1.38%' },
  { name: 'Adani Ports', price: '$14.77', change: '-1.14%' },
  { name: 'Nestle India', price: '$29.16', change: '-0.94%' },
]

const news = [
  {
    title: 'Banking stocks hold momentum as investors rotate into financials',
    description: 'Private banking names continue to see strong buying interest as earnings expectations improve.',
    date: 'March 19, 2026',
    image:
      'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'IT counters rebound after morning volatility in broader markets',
    description: 'Large-cap software names stabilized through the session and outperformed the benchmark.',
    date: 'March 19, 2026',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Crypto sentiment improves as risk assets push to fresh highs',
    description: 'Digital assets traded firm alongside equities, supported by broader appetite for growth names.',
    date: 'March 18, 2026',
    image:
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=900&q=80',
  },
]

function MarketsPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useBackendAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const filteredStocks = useMemo(() => {
    return stockRows.filter((stock) => {
      const matchesSearch =
        stock.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.market.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesFilter =
        activeFilter === 'All' ||
        stock.market.toLowerCase() === activeFilter.toLowerCase() ||
        (activeFilter === 'Commodities' && stock.market === 'Commodities')

      return matchesSearch && matchesFilter
    })
  }, [activeFilter, searchQuery])

  const columns = [
    { key: 'company', label: 'Company Name' },
    { key: 'price', label: 'Price' },
    { key: 'change', label: 'Change %' },
    { key: 'volume', label: 'Volume' },
    { key: 'cap', label: 'Market Cap' },
    { key: 'action', label: 'Action' },
  ]

  const rows = filteredStocks.map((stock) => ({
    key: stock.company,
    company: (
      <div>
        <p className="font-semibold text-gray-900">{stock.company}</p>
        <p className="mt-1 text-xs text-gray-400">{stock.market}</p>
      </div>
    ),
    price: <span className="font-medium text-gray-900">{stock.price}</span>,
    change: <span className={`font-semibold ${stock.positive ? 'text-green-600' : 'text-red-600'}`}>{stock.change}</span>,
    volume: stock.volume,
    cap: stock.cap,
    action: (
      <button
        type="button"
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-green-700"
      >
        {stock.action}
      </button>
    ),
  }))

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar activeItem="Markets" open={sidebarOpen} setOpen={setSidebarOpen} />

        <section className="flex-1 p-6">
          <Navbar currentUser={currentUser} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(true)} />

          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Markets</h1>
              <p className="mt-2 text-gray-500">Track live stock prices and market trends</p>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search stock or market"
                  className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg border px-4 py-2 text-sm transition-all duration-300 hover:bg-gray-100 ${
                      activeFilter === filter ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {overviewCards.map((card) => (
                <Card key={card.name} className="hover:scale-[1.02]">
                  <p className="text-sm font-medium text-gray-500">{card.name}</p>
                  <p className="mt-3 text-xl font-semibold text-gray-900">{card.price}</p>
                  <p className={`mt-2 text-sm font-semibold ${card.positive ? 'text-green-600' : 'text-red-600'}`}>{card.change}</p>
                </Card>
              ))}
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Top Stocks</h2>
              </div>
              <Table columns={columns} rows={rows} />
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card title="Top Gainers">
                <div className="space-y-1">
                  {gainers.map((item) => (
                    <div key={item.name} className="flex items-center justify-between border-b border-gray-100 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-500">{item.price}</p>
                      </div>
                      <p className="text-sm font-semibold text-green-600">{item.change}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Top Losers">
                <div className="space-y-1">
                  {losers.map((item) => (
                    <div key={item.name} className="flex items-center justify-between border-b border-gray-100 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="mt-1 text-sm text-gray-500">{item.price}</p>
                      </div>
                      <p className="text-sm font-semibold text-red-600">{item.change}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Latest Market News</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {news.map((item) => (
                  <article
                    key={item.title}
                    className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">{item.description}</p>
                      <p className="mt-4 text-sm text-gray-400">{item.date}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default MarketsPage
