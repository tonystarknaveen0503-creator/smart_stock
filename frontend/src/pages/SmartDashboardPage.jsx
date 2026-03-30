import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../components/dashboard/Card'
import Navbar from '../components/dashboard/Navbar'
import Sidebar from '../components/dashboard/Sidebar'
import { useBackendAuth } from '../context/BackendAuthContext'

const summaryCards = [
  { title: 'Total Portfolio Value', value: '$124,580', change: '+8.24%', tone: 'text-green-600', helper: 'Updated from today\'s closing session' },
  { title: "Today's Profit / Loss", value: '+$2,845', change: '+2.33%', tone: 'text-green-600', helper: 'Strong gains across large-cap holdings' },
  { title: 'Investments', value: '$92,300', change: '+12 active', tone: 'text-slate-900', helper: 'Diversified across equity and ETF positions' },
  { title: 'Available Balance', value: '$18,740', change: '-1.10%', tone: 'text-red-600', helper: 'Ready for new market opportunities' },
]

const chartData = [
  { month: 'Jan', value: 68, color: '#bbf7d0' },
  { month: 'Feb', value: 74, color: '#86efac' },
  { month: 'Mar', value: 71, color: '#4ade80' },
  { month: 'Apr', value: 89, color: '#22c55e' },
  { month: 'May', value: 94, color: '#16a34a' },
  { month: 'Jun', value: 101, color: '#15803d' },
]

const marketCards = [
  { name: 'NIFTY 50', price: '22,145.60', change: '+1.12%', tone: 'text-green-600' },
  { name: 'SENSEX', price: '73,420.18', change: '+0.94%', tone: 'text-green-600' },
  { name: 'Top Gainers', price: 'TCS', change: '+3.48%', tone: 'text-green-600' },
  { name: 'Top Losers', price: 'ITC', change: '-1.76%', tone: 'text-red-600' },
]

const watchlist = [
  { stock: 'Reliance Industries', price: '$64.80', change: '+1.84%', tone: 'text-green-600', action: 'Buy' },
  { stock: 'Infosys', price: '$18.42', change: '+0.62%', tone: 'text-green-600', action: 'Buy' },
  { stock: 'HDFC Bank', price: '$21.26', change: '-0.48%', tone: 'text-red-600', action: 'Sell' },
  { stock: 'Tata Motors', price: '$12.14', change: '+2.14%', tone: 'text-green-600', action: 'Buy' },
]

const recentActivity = [
  { label: 'Bought', stock: 'Reliance Industries', time: '10 mins ago', amount: '$2,450', tone: 'text-green-600' },
  { label: 'Sold', stock: 'ITC', time: '35 mins ago', amount: '$1,120', tone: 'text-red-600' },
  { label: 'Bought', stock: 'Infosys', time: '1 hour ago', amount: '$980', tone: 'text-green-600' },
  { label: 'Bought', stock: 'Tata Motors', time: '3 hours ago', amount: '$1,460', tone: 'text-green-600' },
]

function SmartDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useBackendAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar activeItem="Dashboard" open={sidebarOpen} setOpen={setSidebarOpen} />

        <section className="flex-1 p-4 sm:p-6">
          <Navbar currentUser={currentUser} onLogout={handleLogout} onMenuToggle={() => setSidebarOpen(true)} />

          <div className="space-y-6">
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <Card key={card.title} className="hover:scale-[1.02]">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-3 text-3xl font-bold text-gray-900">{card.value}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className={`text-sm font-semibold ${card.tone}`}>{card.change}</span>
                    <span className="text-xs text-gray-400">{card.helper}</span>
                  </div>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
              <Card title="Portfolio Performance" subtitle="6 month trend overview">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: 16, borderColor: '#e5e7eb' }} />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                        {chartData.map((entry) => (
                          <Cell key={entry.month} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Recent Activity" subtitle="Latest trades and order flow">
                <div className="space-y-4">
                  {recentActivity.map((item) => (
                    <div key={`${item.label}-${item.stock}-${item.time}`} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                      <div>
                        <p className={`text-sm font-semibold ${item.tone}`}>{item.label}</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{item.stock}</p>
                        <p className="mt-1 text-xs text-gray-500">{item.time}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{item.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-4">
              {marketCards.map((market) => (
                <Card key={market.name} className="hover:scale-[1.02]">
                  <p className="text-sm font-medium text-gray-500">{market.name}</p>
                  <p className="mt-3 text-2xl font-bold text-gray-900">{market.price}</p>
                  <p className={`mt-2 text-sm font-semibold ${market.tone}`}>{market.change}</p>
                </Card>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
              <Card title="Watchlist" subtitle="Track your high-conviction names">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 text-xs uppercase tracking-[0.24em] text-gray-400">
                        <th className="pb-4 font-medium">Stock Name</th>
                        <th className="pb-4 font-medium">Price</th>
                        <th className="pb-4 font-medium">Change %</th>
                        <th className="pb-4 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchlist.map((item) => (
                        <tr key={item.stock} className="border-b border-gray-100 transition-all duration-300 hover:bg-gray-50">
                          <td className="py-4 pr-4"><p className="font-semibold text-gray-900">{item.stock}</p></td>
                          <td className="py-4 pr-4 text-sm text-gray-700">{item.price}</td>
                          <td className={`py-4 pr-4 text-sm font-semibold ${item.tone}`}>{item.change}</td>
                          <td className="py-4 text-right">
                            <button type="button" className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 ${item.action === 'Buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                              {item.action}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card title="Portfolio Notes" subtitle="Quick insights for today">
                <div className="space-y-4">
                  <div className="rounded-xl bg-green-50 p-4">
                    <p className="text-sm font-semibold text-green-700">Profit Focus</p>
                    <p className="mt-2 text-sm text-gray-600">Tech and banking stocks are supporting portfolio momentum today.</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 ring-1 ring-gray-200">
                    <p className="text-sm font-semibold text-gray-900">Risk Monitor</p>
                    <p className="mt-2 text-sm text-gray-600">Keep an eye on FMCG names as defensive rotation softens intraday gains.</p>
                  </div>
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-700">Loss Watch</p>
                    <p className="mt-2 text-sm text-gray-600">A few consumer names are underperforming; tighten exits if volatility increases.</p>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}

export default SmartDashboardPage

