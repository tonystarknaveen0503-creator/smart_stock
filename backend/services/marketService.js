import {
  dashboardContent,
  defaultChartFallback,
  marketFallback,
  nseBseFallback,
} from '../data/fallbacks.js'
import { getFilteredFallback, normalizeExchange, normalizeSegment } from '../utils/marketFilters.js'

function createMarketService(apiKey) {
  async function fetchGlobalQuote(symbol) {
    if (!apiKey) {
      return null
    }

    const query = new URLSearchParams({
      function: 'GLOBAL_QUOTE',
      symbol,
      apikey: apiKey,
    })

    const response = await fetch(`https://www.alphavantage.co/query?${query.toString()}`)
    if (!response.ok) {
      throw new Error(`Unable to fetch quote for ${symbol}.`)
    }

    const payload = await response.json()
    const quote = payload['Global Quote']

    if (!quote || !quote['01. symbol']) {
      return null
    }

    return {
      symbol: quote['01. symbol'],
      price: Number(quote['05. price']).toFixed(2),
      change: quote['10. change percent'] || '0.00%',
      volume: quote['06. volume'] || '0',
    }
  }

  async function fetchChartSeries(symbol) {
    if (!apiKey) {
      return defaultChartFallback
    }

    const query = new URLSearchParams({
      function: 'TIME_SERIES_DAILY',
      symbol,
      outputsize: 'compact',
      apikey: apiKey,
    })

    const response = await fetch(`https://www.alphavantage.co/query?${query.toString()}`)
    if (!response.ok) {
      throw new Error(`Unable to fetch chart for ${symbol}.`)
    }

    const payload = await response.json()
    const series = payload['Time Series (Daily)']

    if (!series) {
      return defaultChartFallback
    }

    return Object.entries(series)
      .slice(0, 7)
      .reverse()
      .map(([date, values]) => ({
        x: date.slice(5),
        y: [
          Number(Number(values['1. open']).toFixed(2)),
          Number(Number(values['2. high']).toFixed(2)),
          Number(Number(values['3. low']).toFixed(2)),
          Number(Number(values['4. close']).toFixed(2)),
        ],
      }))
  }

  async function fetchNseBseSymbols(keyword) {
    if (!apiKey || !keyword) {
      return nseBseFallback.filter((item) =>
        item.symbol.toLowerCase().includes(keyword.toLowerCase()) ||
        item.name.toLowerCase().includes(keyword.toLowerCase()),
      )
    }

    const query = new URLSearchParams({
      function: 'SYMBOL_SEARCH',
      keywords: keyword,
      apikey: apiKey,
    })

    const response = await fetch(`https://www.alphavantage.co/query?${query.toString()}`)
    if (!response.ok) {
      throw new Error('Unable to search symbols.')
    }

    const payload = await response.json()
    const matches = payload.bestMatches || []

    return matches
      .map((item) => ({
        symbol: item['1. symbol'],
        name: item['2. name'],
        region: item['4. region'],
      }))
      .filter(
        (item) =>
          item.region?.toLowerCase().includes('india') ||
          item.symbol?.endsWith('.NSE') ||
          item.symbol?.endsWith('.BSE'),
      )
      .slice(0, 10)
  }

  async function fetchMarketNews(exchange, segment) {
    if (!apiKey) {
      return dashboardContent.news.map((headline, index) => ({
        id: `fallback-news-${index}`,
        title: headline,
        source: 'Smart Stock Feed',
        url: '#',
        timePublished: new Date().toISOString(),
      }))
    }

    const normalizedExchange = normalizeExchange(exchange)
    const normalizedSegment = normalizeSegment(segment)
    const tickers = getFilteredFallback(normalizedExchange, normalizedSegment)
      .slice(0, 3)
      .map((item) => item.symbol)
      .join(',')

    const query = new URLSearchParams({
      function: 'NEWS_SENTIMENT',
      apikey: apiKey,
    })

    if (tickers) {
      query.set('tickers', tickers)
    }

    const response = await fetch(`https://www.alphavantage.co/query?${query.toString()}`)
    if (!response.ok) {
      throw new Error('Unable to load market news.')
    }

    const payload = await response.json()
    const feed = payload.feed || []

    return feed.slice(0, 6).map((item, index) => ({
      id: item.url || `news-${index}`,
      title: item.title,
      source: item.source,
      url: item.url,
      timePublished: item.time_published,
    }))
  }

  async function buildDashboardOverview(exchange, segment) {
    const normalizedExchange = normalizeExchange(exchange)
    const normalizedSegment = normalizeSegment(segment)
    const filteredFallback = getFilteredFallback(normalizedExchange, normalizedSegment)
    const segmentFallback = getFilteredFallback('ALL', normalizedSegment)
    const fallbackItems = filteredFallback.length
      ? filteredFallback
      : segmentFallback.length
        ? segmentFallback
        : marketFallback.slice(0, 3)
    const symbols = fallbackItems.map((item) => item.symbol)
    const livePrices = apiKey
      ? (await Promise.all(symbols.map((symbol) => fetchGlobalQuote(symbol)))).filter(Boolean)
      : fallbackItems

    const defaultChartSymbol = symbols[0] || 'RELIANCE.BSE'
    const chartSeries = await fetchChartSeries(defaultChartSymbol)
    const news = await fetchMarketNews(normalizedExchange, normalizedSegment)

    return {
      livePrices: livePrices.length ? livePrices : fallbackItems,
      charts: chartSeries,
      defaultChartSymbol,
      activeFilters: {
        exchange: normalizedExchange,
        segment: normalizedSegment,
      },
      news,
      ...dashboardContent,
    }
  }

  async function buildSectionDetails(section, exchange, segment) {
    const overview = await buildDashboardOverview(exchange, segment)
    const livePrices = overview.livePrices || []
    const news = overview.news || []
    const marketResearch = overview.marketResearch || {}
    const normalizedSection = String(section || 'dashboard-top')

    const sectionMap = {
      'dashboard-top': {
        title: 'Dashboard Overview',
        summary:
          'This workspace combines market signals, live prices, research coverage, and watchlist tracking in one operating screen.',
        bullets: [
          `Active exchange filter: ${overview.activeFilters.exchange}`,
          `Active segment filter: ${overview.activeFilters.segment}`,
          `Visible live symbols: ${livePrices.length}`,
        ],
      },
      'live-stock-price': {
        title: 'Live Stock Price Details',
        summary:
          'Live price data highlights the most relevant symbols for your selected exchange and segment filters.',
        bullets: livePrices.slice(0, 3).map(
          (item) => `${item.symbol}: ${item.price} (${item.change}) with volume ${item.volume}`,
        ),
      },
      'candlestick-chart': {
        title: 'Chart Details',
        summary:
          'Candlestick data lets you inspect direction, momentum, and day-to-day market structure for the selected symbol.',
        bullets: [
          `Current chart symbol: ${overview.defaultChartSymbol}`,
          `Available candles loaded: ${overview.charts.length}`,
          'Use market search on the right to switch the active chart symbol.',
        ],
      },
      'market-research': {
        title: 'Market Research Details',
        summary:
          'Research coverage groups the major market segments into one view so you can move from scan to action quickly.',
        bullets: [
          `Tracked exchanges: ${(marketResearch.exchanges || []).join(', ')}`,
          `Tracked segments: ${(marketResearch.segments || []).join(', ')}`,
          'Symbol search lets you load research symbols directly into the chart.',
        ],
      },
      'currency-ipo': {
        title: 'Currency And IPO Details',
        summary:
          'Currency and IPO coverage are included inside the broader market research workflow for faster comparison.',
        bullets: [
          'Currency movement helps track broader market sentiment and rate pressure.',
          'IPO visibility helps monitor fresh listings and primary market activity.',
          'Use the segment filter to narrow the dashboard toward currency or IPO-driven views.',
        ],
      },
      'live-insights': {
        title: 'Live Insights Details',
        summary:
          'Insights summarize what is moving in the market right now and where attention should go first.',
        bullets: overview.liveInsights || [],
      },
      news: {
        title: 'News Details',
        summary:
          'The news stream is tied to active market context so you can review headlines alongside symbols and trends.',
        bullets: news.slice(0, 3).map((item) => `${item.title} - ${item.source || 'Market Feed'}`),
      },
      'broker-place': {
        title: 'Broker Place Details',
        summary:
          'Broker coverage keeps the workspace aligned with trading platforms commonly used by Smart Stock users.',
        bullets: (overview.brokerPlace || []).map((item) => `${item} available in broker coverage`),
      },
      'capital-market': {
        title: 'Capital Market Details',
        summary:
          marketResearch.capitalMarket ||
          'Capital market updates are delivered through the dashboard overview service.',
        bullets: [
          'Use this section to track broader benchmark movement and sector activity.',
          'Capital market themes help explain where volume and sentiment are concentrating.',
          'This view complements live prices, research filters, and market news.',
        ],
      },
      'api-document': {
        title: 'API Document Details',
        summary:
          'These backend endpoints power the Smart Stock login flow, dashboard loading, watchlist actions, and admin views.',
        bullets: (overview.apiDocument || []).slice(0, 6),
      },
    }

    return sectionMap[normalizedSection] || sectionMap['dashboard-top']
  }

  return {
    buildDashboardOverview,
    buildSectionDetails,
    fetchChartSeries,
    fetchMarketNews,
    fetchNseBseSymbols,
  }
}

export { createMarketService }
