import { marketFallback } from '../data/fallbacks.js'

function normalizeSegment(segment) {
  return String(segment || 'all').trim().toLowerCase()
}

function normalizeExchange(exchange) {
  return String(exchange || 'all').trim().toUpperCase()
}

function getFilteredFallback(exchange, segment) {
  const normalizedExchange = normalizeExchange(exchange)
  const normalizedSegment = normalizeSegment(segment)

  return marketFallback.filter((item) => {
    const exchangeMatches =
      normalizedExchange === 'ALL' ||
      item.exchange === normalizedExchange

    const segmentMatches =
      normalizedSegment === 'all' ||
      item.segments.includes(normalizedSegment)

    return exchangeMatches && segmentMatches
  })
}

export { getFilteredFallback, normalizeExchange, normalizeSegment }
