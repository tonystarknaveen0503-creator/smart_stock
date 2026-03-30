import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'
import { getMarketOverview } from '../services/marketApi'
import {
  addWatchlistSymbol,
  subscribeToWatchlist,
} from '../services/watchlistService'

const researchTags = [
  'NSE',
  'BSE',
  'Equity',
  'Commodity',
  'Mutual Funds',
  'Derivatives',
  'Currency',
  'IPO',
  'Capital Market',
]

const chartSummary = [
  { label: '1D', value: '▲ 1.4%' },
  { label: '1W', value: '▲ 3.1%' },
  { label: '1M', value: '▲ 6.8%' },
]

const newsItems = [
  'Market breadth remains positive across benchmark sectors.',
  'Currency and commodity desks are seeing healthy participation.',
  'IPO activity continues to drive retail interest and capital market attention.',
]

function DashboardPage() {
  const navigate = useNavigate()
  const { currentUser, firebaseEnabled, logout } = useAuth()
  const [marketData, setMarketData] = useState([])
  const [marketLoading, setMarketLoading] = useState(true)
  const [marketError, setMarketError] = useState('')
  const [watchlist, setWatchlist] = useState([])
  const [symbolInput, setSymbolInput] = useState('')
  const [watchlistError, setWatchlistError] = useState('')

  useEffect(() => {
    let active = true

    const loadMarketData = async () => {
      setMarketLoading(true)
      setMarketError('')

      try {
        const data = await getMarketOverview()
        if (active) {
          setMarketData(data)
        }
      } catch (error) {
        if (active) {
          setMarketError(error.message || 'Unable to load market data.')
        }
      } finally {
        if (active) {
          setMarketLoading(false)
        }
      }
    }

    loadMarketData()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!currentUser?.uid) {
      return undefined
    }

    return subscribeToWatchlist(currentUser.uid, setWatchlist)
  }, [currentUser?.uid])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleAddSymbol = async (event) => {
    event.preventDefault()
    setWatchlistError('')

    if (!symbolInput.trim()) {
      return
    }

    try {
      const createdItem = await addWatchlistSymbol(
        currentUser.uid,
        symbolInput.trim().toUpperCase(),
      )
      if (!firebaseEnabled && createdItem) {
        setWatchlist((current) => [createdItem, ...current])
      }
      setSymbolInput('')
    } catch (error) {
      setWatchlistError(error.message || 'Unable to save watchlist symbol.')
    }
  }

  return (
    <main className="dashboard-shell">
      <Sidebar />

      <section className="dashboard-panel">
        <Topbar
          currentUser={currentUser}
          onLogout={handleLogout}
          watchlistCount={watchlist.length}
        />

        <div className="dashboard-grid">
          <article className="dashboard-card highlight-card span-two">
            <p className="card-title">Live Insights</p>
            <h3>Real market overview</h3>
            <p>
              Smart Stock combines routed pages, Firebase authentication, a
              watchlist database, and live stock API integration in one place.
            </p>
          </article>

          <article className="dashboard-card">
            <p className="card-title">Charts</p>
            <div className="chip-row">
              {chartSummary.map((item) => (
                <span className="chip" key={item.label}>
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </article>

          <article className="dashboard-card">
            <p className="card-title">Market Research</p>
            <div className="chip-row">
              {researchTags.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </article>

          <article className="dashboard-card span-two">
            <p className="card-title">Live Stock Price</p>
            {marketLoading ? <p>Loading live prices...</p> : null}
            {marketError ? <p className="error-text">{marketError}</p> : null}
            {!marketLoading && !marketError ? (
              <div className="table-wrap">
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Price</th>
                      <th>Change</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.map((stock) => (
                      <tr key={stock.symbol}>
                        <td>{stock.symbol}</td>
                        <td>{stock.price}</td>
                        <td className={stock.change.startsWith('-') ? 'down' : 'up'}>
                          {stock.change}
                        </td>
                        <td>{stock.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>

          <article className="dashboard-card">
            <p className="card-title">News</p>
            <ul className="mini-list">
              {newsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="dashboard-card">
            <p className="card-title">Broker Place</p>
            <div className="chip-row">
              <span className="chip">Groww</span>
              <span className="chip">Kite</span>
              <span className="chip">Angel One</span>
              <span className="chip">Upstox</span>
            </div>
          </article>

          <article className="dashboard-card span-two">
            <p className="card-title">Watchlist Database</p>
            <form className="watchlist-form" onSubmit={handleAddSymbol}>
              <input
                type="text"
                value={symbolInput}
                onChange={(event) => setSymbolInput(event.target.value)}
                placeholder="Add symbol like IBM or RELIANCE.BSE"
              />
              <button className="primary-button" type="submit">
                Add Symbol
              </button>
            </form>
            {watchlistError ? <p className="error-text">{watchlistError}</p> : null}
            <div className="watchlist-grid">
              {watchlist.length ? (
                watchlist.map((item) => (
                  <div className="watchlist-item" key={item.id}>
                    <strong>{item.symbol}</strong>
                    <span>{firebaseEnabled ? 'Saved in Firestore' : 'Saved in demo memory'}</span>
                  </div>
                ))
              ) : (
                <p>No watchlist items yet. Add your first stock symbol.</p>
              )}
            </div>
          </article>

          <article className="dashboard-card span-two">
            <p className="card-title">API Document</p>
            <p>
              Configure <code>VITE_ALPHA_VANTAGE_API_KEY</code> for live market data
              and Firebase environment variables for authentication plus database
              persistence.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
