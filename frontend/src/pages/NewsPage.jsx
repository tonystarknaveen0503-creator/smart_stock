import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/dashboard/Card'
import FeaturedCard from '../components/dashboard/FeaturedCard'
import Navbar from '../components/dashboard/Navbar'
import NewsCard from '../components/dashboard/NewsCard'
import Sidebar from '../components/dashboard/Sidebar'
import { useBackendAuth } from '../context/BackendAuthContext'

const categories = ['All', 'Stocks', 'IPO', 'Economy', 'Crypto']

const featuredStory = {
  category: 'Stocks',
  title: 'Benchmarks close higher as banking and IT stocks lift late-session momentum',
  description:
    'Indian equities extended gains into the close as private banks and software exporters attracted steady inflows. Analysts point to stronger earnings expectations and resilient domestic participation as the key drivers behind the broader move.',
  date: 'March 19, 2026',
  source: 'StockPro Markets Desk',
  image:
    'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=80',
}

const newsItems = [
  {
    title: 'NIFTY IT index rebounds after midday volatility',
    description:
      'Large-cap technology names recovered smartly as investors rotated back into export-oriented counters.',
    date: 'March 19, 2026',
    category: 'Stocks',
    image:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Upcoming IPO pipeline grows with strong retail interest',
    description:
      'New public issues across manufacturing and digital services continue to draw attention ahead of listing week.',
    date: 'March 19, 2026',
    category: 'IPO',
    image:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Rupee holds steady as traders assess global inflation signals',
    description:
      'Currency markets remained range-bound while investors waited for fresh policy guidance and commodity cues.',
    date: 'March 18, 2026',
    category: 'Economy',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Bitcoin firms up as risk appetite returns across global markets',
    description:
      'Crypto majors traded higher alongside equities, supported by improving sentiment in growth assets.',
    date: 'March 18, 2026',
    category: 'Crypto',
    image:
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Auto stocks gain on stronger monthly dispatch estimates',
    description:
      'Passenger vehicle and auto ancillary names moved higher as channel checks pointed to healthy demand.',
    date: 'March 18, 2026',
    category: 'Stocks',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Bond yields soften as investors price in a stable rate outlook',
    description:
      'Debt markets reflected improved confidence that near-term monetary policy may remain supportive.',
    date: 'March 17, 2026',
    category: 'Economy',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  },
]

const trendingItems = [
  { title: 'Top private banks lead index gains in afternoon trade', date: 'March 19, 2026' },
  { title: 'IPO subscriptions remain strong in the retail segment', date: 'March 19, 2026' },
  { title: 'Mid-cap momentum widens as sector breadth improves', date: 'March 18, 2026' },
  { title: 'Crypto volumes pick up after two quiet sessions', date: 'March 18, 2026' },
]

function NewsPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useBackendAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(6)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [activeCategory, searchQuery])

  const visibleNews = filteredNews.slice(0, visibleCount)
  const hasMore = visibleCount < filteredNews.length

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <Sidebar activeItem="News" open={sidebarOpen} setOpen={setSidebarOpen} />

        <section className="flex-1 p-6">
          <Navbar currentUser={currentUser} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(true)} />

          <div className="mx-auto max-w-7xl space-y-6">
            <header>
              <h1 className="text-3xl font-bold text-gray-800">Market News</h1>
              <p className="mt-2 text-gray-500">Stay updated with latest stock market news</p>
            </header>

            <section className="flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="w-full md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search news, topics, or sectors"
                  className="w-full rounded-lg border border-gray-200 p-3 outline-none transition-all duration-300 focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg border px-4 py-2 text-sm transition-all duration-300 hover:bg-gray-100 ${
                      activeCategory === category
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_320px]">
              <div className="space-y-6">
                <FeaturedCard item={featuredStory} />

                {visibleNews.length ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleNews.map((item) => (
                      <NewsCard key={`${item.title}-${item.date}`} item={item} />
                    ))}
                  </div>
                ) : (
                  <Card className="py-16 text-center">
                    <p className="text-base font-medium text-gray-500">No news available</p>
                  </Card>
                )}

                {visibleNews.length ? (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => count + 3)}
                      disabled={!hasMore}
                      className={`rounded-lg px-6 py-2 font-semibold text-white transition-all duration-300 ${
                        hasMore
                          ? 'bg-green-600 hover:scale-[1.02] hover:bg-green-700'
                          : 'cursor-not-allowed bg-green-300'
                      }`}
                    >
                      {hasMore ? 'Load More' : 'All News Loaded'}
                    </button>
                  </div>
                ) : null}
              </div>

              <aside className="hidden xl:block">
                <Card title="Trending" className="sticky top-28">
                  <div className="space-y-1">
                    {trendingItems.map((item) => (
                      <div key={item.title} className="border-b border-gray-100 py-3 last:border-b-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="mt-1 text-xs text-gray-400">{item.date}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </aside>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default NewsPage
