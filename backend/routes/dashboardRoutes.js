import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { normalizeExchange, normalizeSegment } from '../utils/marketFilters.js'

function createDashboardRouter(marketService, authMiddleware) {
  const router = Router()

  router.get('/dashboard/overview', authMiddleware, asyncHandler(async (req, res) => {
    const overview = await marketService.buildDashboardOverview(
      req.query.exchange,
      req.query.segment,
    )

    return res.json(overview)
  }))

  router.get('/dashboard/section-details', authMiddleware, asyncHandler(async (req, res) => {
    const details = await marketService.buildSectionDetails(
      req.query.section,
      req.query.exchange,
      req.query.segment,
    )

    return res.json(details)
  }))

  router.get('/market/chart', authMiddleware, asyncHandler(async (req, res) => {
    const symbol = String(req.query.symbol || 'RELIANCE.BSE').toUpperCase()
    const series = await marketService.fetchChartSeries(symbol)
    return res.json({ symbol, series })
  }))

  router.get('/market/symbols', authMiddleware, asyncHandler(async (req, res) => {
    const keyword = String(req.query.q || '').trim()
    const exchange = normalizeExchange(req.query.exchange)
    const items = (await marketService.fetchNseBseSymbols(keyword)).filter((item) =>
      exchange === 'ALL' ? true : item.symbol.endsWith(`.${exchange}`),
    )

    return res.json({ items })
  }))

  router.get('/news', authMiddleware, asyncHandler(async (req, res) => {
    const exchange = normalizeExchange(req.query.exchange)
    const segment = normalizeSegment(req.query.segment)
    const items = await marketService.fetchMarketNews(exchange, segment)

    return res.json({ items })
  }))

  return router
}

export { createDashboardRouter }
