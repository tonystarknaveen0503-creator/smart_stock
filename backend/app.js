import cors from 'cors'
import express from 'express'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { adminMiddleware, createAuthMiddleware } from './middleware/auth.js'
import { createAdminRouter } from './routes/adminRoutes.js'
import { createAuthRouter } from './routes/authRoutes.js'
import { createDashboardRouter } from './routes/dashboardRoutes.js'
import { createHealthRouter } from './routes/healthRoutes.js'
import { createWatchlistRouter } from './routes/watchlistRoutes.js'
import { createMarketService } from './services/marketService.js'

function createApp(context) {
  const app = express()
  const authMiddleware = createAuthMiddleware(context)
  const marketService = createMarketService(context.config.apiKey)

  app.use(cors())
  app.use(express.json())

  app.use('/api', createHealthRouter(context))
  app.use('/api/auth', createAuthRouter(context, authMiddleware))
  app.use('/api', createDashboardRouter(marketService, authMiddleware))
  app.use('/api/watchlist', createWatchlistRouter(context, authMiddleware))
  app.use('/api/admin', createAdminRouter(context, authMiddleware, adminMiddleware))
  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

export { createApp }
