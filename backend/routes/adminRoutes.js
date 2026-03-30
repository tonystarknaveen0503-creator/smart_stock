import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { mapWatchlistItem, sanitizeUser, toCsv } from '../utils/serializers.js'

function createAdminRouter(context, authMiddleware, adminMiddleware) {
  const router = Router()

  router.get('/summary', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
    const userPage = Math.max(Number(req.query.userPage || 1), 1)
    const watchlistPage = Math.max(Number(req.query.watchlistPage || 1), 1)
    const pageSize = Math.min(Math.max(Number(req.query.pageSize || 5), 1), 25)

    const [users, watchlists, userCount, watchlistCount] = context.state.useMemoryStore
      ? [
          context.state.memoryStore.users
            .slice()
            .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
            .slice((userPage - 1) * pageSize, userPage * pageSize),
          context.state.memoryStore.watchlists
            .slice()
            .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
            .slice((watchlistPage - 1) * pageSize, watchlistPage * pageSize)
            .map((item) => ({
              ...item,
              userId:
                context.state.memoryStore.users.find((user) => user.id === item.userId) || null,
            })),
          context.state.memoryStore.users.length,
          context.state.memoryStore.watchlists.length,
        ]
      : await Promise.all([
          context.models.User.find()
            .sort({ createdAt: -1 })
            .skip((userPage - 1) * pageSize)
            .limit(pageSize),
          context.models.Watchlist.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .skip((watchlistPage - 1) * pageSize)
            .limit(pageSize),
          context.models.User.countDocuments(),
          context.models.Watchlist.countDocuments(),
        ])

    return res.json({
      users: users.map((user) => sanitizeUser(user)),
      watchlists: watchlists.map((item) => mapWatchlistItem(context, item)),
      pagination: {
        pageSize,
        users: {
          page: userPage,
          total: userCount,
          totalPages: Math.max(Math.ceil(userCount / pageSize), 1),
        },
        watchlists: {
          page: watchlistPage,
          total: watchlistCount,
          totalPages: Math.max(Math.ceil(watchlistCount / pageSize), 1),
        },
      },
    })
  }))

  router.put('/watchlists/:id', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
    const { symbol } = req.body

    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required.' })
    }

    const item = context.state.useMemoryStore
      ? context.state.memoryStore.watchlists.find((entry) => entry.id === req.params.id)
      : await context.models.Watchlist.findByIdAndUpdate(
          req.params.id,
          { symbol: String(symbol).toUpperCase() },
          { new: true },
        ).populate('userId', 'name email')

    if (!item) {
      return res.status(404).json({ message: 'Watchlist item not found.' })
    }

    if (context.state.useMemoryStore) {
      item.symbol = String(symbol).toUpperCase()
      item.userId =
        context.state.memoryStore.users.find((user) => user.id === item.userId) || null
    }

    return res.json({ item: mapWatchlistItem(context, item) })
  }))

  router.delete('/watchlists/:id', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
    const item = context.state.useMemoryStore
      ? context.state.memoryStore.watchlists.find((entry) => entry.id === req.params.id)
      : await context.models.Watchlist.findByIdAndDelete(req.params.id)

    if (!item) {
      return res.status(404).json({ message: 'Watchlist item not found.' })
    }

    if (context.state.useMemoryStore) {
      context.state.memoryStore.watchlists = context.state.memoryStore.watchlists.filter(
        (entry) => entry.id !== req.params.id,
      )
    }

    return res.json({ success: true, id: req.params.id })
  }))

  router.get('/export/:type', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
    const type = String(req.params.type || '')

    if (type === 'users') {
      const users = context.state.useMemoryStore
        ? context.state.memoryStore.users
            .slice()
            .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        : await context.models.User.find().sort({ createdAt: -1 })
      const csv = toCsv(
        users.map((user) => ({
          id: user._id?.toString?.() || user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        })),
      )
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="smartstock-users.csv"')
      return res.send(csv)
    }

    if (type === 'watchlists') {
      const watchlists = context.state.useMemoryStore
        ? context.state.memoryStore.watchlists
            .slice()
            .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
            .map((item) => ({
              ...item,
              userId:
                context.state.memoryStore.users.find((user) => user.id === item.userId) || null,
            }))
        : await context.models.Watchlist.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
      const csv = toCsv(
        watchlists.map((item) => ({
          id: item._id?.toString?.() || item.id,
          symbol: item.symbol,
          userName: item.userId?.name || '',
          userEmail: item.userId?.email || '',
          createdAt: item.createdAt,
        })),
      )
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', 'attachment; filename="smartstock-watchlists.csv"')
      return res.send(csv)
    }

    return res.status(400).json({ message: 'Unsupported export type.' })
  }))

  return router
}

export { createAdminRouter }
