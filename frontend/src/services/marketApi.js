const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY
const API_URL = 'https://www.alphavantage.co/query'
const DEFAULT_SYMBOLS = ['IBM', 'MSFT', 'AAPL']

const fallbackMarketData = [
  { symbol: 'NSE:RELIANCE', price: '2,945.20', change: '+1.18%', volume: '4.3M' },
  { symbol: 'BSE:TCS', price: '4,102.85', change: '+0.74%', volume: '1.2M' },
  { symbol: 'NSE:HDFCBANK', price: '1,588.40', change: '-0.21%', volume: '3.7M' },
]

const formatPercentChange = (value) => {
  const numeric = Number(value)

  if (Number.isNaN(numeric)) {
    return value || '0.00%'
  }

  return `${numeric >= 0 ? '+' : ''}${numeric.toFixed(2)}%`
}

async function fetchQuote(symbol) {
  const query = new URLSearchParams({
    function: 'GLOBAL_QUOTE',
    symbol,
    apikey: API_KEY,
  })

  const response = await fetch(`${API_URL}?${query.toString()}`)

  if (!response.ok) {
    throw new Error(`Stock API request failed for ${symbol}.`)
  }

  const data = await response.json()
  const quote = data['Global Quote']

  if (!quote || !quote['01. symbol']) {
    throw new Error('Stock API did not return a valid quote.')
  }

  return {
    symbol: quote['01. symbol'],
    price: Number(quote['05. price']).toFixed(2),
    change: formatPercentChange(quote['10. change percent']?.replace('%', '')),
    volume: quote['06. volume'],
  }
}

async function getMarketOverview() {
  if (!API_KEY) {
    return fallbackMarketData
  }

  const quotes = await Promise.all(DEFAULT_SYMBOLS.map((symbol) => fetchQuote(symbol)))
  return quotes
}

export { getMarketOverview }
