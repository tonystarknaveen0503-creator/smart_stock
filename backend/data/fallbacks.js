const marketFallback = [
  {
    symbol: 'RELIANCE.BSE',
    price: '2945.20',
    change: '+1.18%',
    volume: '4.3M',
    exchange: 'BSE',
    segments: ['equity', 'ipo'],
  },
  {
    symbol: 'TCS.BSE',
    price: '4102.85',
    change: '+0.74%',
    volume: '1.2M',
    exchange: 'BSE',
    segments: ['equity'],
  },
  {
    symbol: 'INFY.NSE',
    price: '1588.40',
    change: '-0.21%',
    volume: '3.7M',
    exchange: 'NSE',
    segments: ['equity'],
  },
  {
    symbol: 'HDFCBANK.NSE',
    price: '1675.10',
    change: '+0.52%',
    volume: '2.8M',
    exchange: 'NSE',
    segments: ['equity', 'capital-market'],
  },
  {
    symbol: 'USDINR',
    price: '83.12',
    change: '+0.08%',
    volume: '1.1M',
    exchange: 'FX',
    segments: ['currency'],
  },
  {
    symbol: 'GOLD',
    price: '2167.30',
    change: '+0.44%',
    volume: '0.7M',
    exchange: 'COMEX',
    segments: ['commodity'],
  },
]

const defaultChartFallback = [
  { x: '03-11', y: [2830, 2866, 2818, 2842] },
  { x: '03-12', y: [2842, 2880, 2835, 2868] },
  { x: '03-13', y: [2868, 2876, 2832, 2851] },
  { x: '03-14', y: [2851, 2914, 2844, 2906] },
  { x: '03-15', y: [2906, 2958, 2898, 2945] },
]

const nseBseFallback = [
  { symbol: 'RELIANCE.BSE', name: 'Reliance Industries Limited', region: 'India' },
  { symbol: 'TCS.BSE', name: 'Tata Consultancy Services Limited', region: 'India' },
  { symbol: 'INFY.NSE', name: 'Infosys Limited', region: 'India' },
  { symbol: 'HDFCBANK.NSE', name: 'HDFC Bank Limited', region: 'India' },
]

const dashboardContent = {
  marketResearch: {
    exchanges: ['NSE', 'BSE'],
    segments: ['Equity', 'Commodity', 'Mutual Funds', 'Derivatives', 'Currency', 'IPO'],
    capitalMarket:
      'Capital market coverage tracks benchmark movement, sector rotation, and active themes.',
  },
  liveInsights: [
    'Live insights focus on sector momentum, breadth, and volume participation.',
    'Banking, IT, and capital market themes remain active in the current session.',
    'IPO and currency updates are grouped with market research for faster scanning.',
  ],
  news: [
    'Smart Stock backend delivers structured news cards for the dashboard.',
    'Commodity, currency, and derivatives updates are grouped in one stream.',
    'Market research summaries help users scan NSE and BSE activity quickly.',
  ],
  brokerPlace: ['Groww', 'Kite', 'Angel One', 'Upstox'],
  apiDocument: [
    'POST /api/auth/signup',
    'POST /api/auth/login',
    'GET /api/auth/me',
    'GET /api/dashboard/overview',
    'GET /api/market/chart?symbol=RELIANCE.BSE',
    'GET /api/market/symbols?q=reliance',
    'GET /api/news?exchange=NSE&segment=equity',
    'GET /api/watchlist',
    'POST /api/watchlist',
    'GET /api/admin/summary',
    'PUT /api/admin/watchlists/:id',
    'DELETE /api/admin/watchlists/:id',
  ],
}

export { dashboardContent, defaultChartFallback, marketFallback, nseBseFallback }
