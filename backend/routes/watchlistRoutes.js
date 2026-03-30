import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { createMemoryId, mapWatchlistItem } from '../utils/serializers.js'

function createWatchlistRouter(context, authMiddleware) {
  const router = Router()

  router.get('/', authMiddleware, asyncHandler(async (req, res) => {
    const items = context.state.useMemoryStore
      ? context.state.memoryStore.watchlists
          .filter((item) => item.userId === req.user.id)
          .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      : await context.models.Watchlist.find({ userId: req.user._id }).sort({ createdAt: -1 })

    return res.json({
      items: items.map((item) => mapWatchlistItem(context, item)),
    })
  }))

  router.post('/', authMiddleware, asyncHandler(async (req, res) => {
    const { symbol } = req.body

    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required.' })
    }

    const item = context.state.useMemoryStore
      ? {
          id: createMemoryId('watch'),
          userId: req.user.id,
          symbol: String(symbol).toUpperCase(),
          createdAt: new Date().toISOString(),
        }
      : await context.models.Watchlist.create({
          userId: req.user._id,
          symbol: String(symbol).toUpperCase(),
        })

    if (context.state.useMemoryStore) {
      context.state.memoryStore.watchlists.unshift(item)
    }

    return res.status(201).json({
      item: mapWatchlistItem(context, item),
    })
  }))

  router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
    const { symbol } = req.body

    if (!symbol) {
      return res.status(400).json({ message: 'Symbol is required.' })
    }

    const item = context.state.useMemoryStore
      ? context.state.memoryStore.watchlists.find(
          (entry) => entry.id === req.params.id && entry.userId === req.user.id,
        )
      : await context.models.Watchlist.findOneAndUpdate(
          { _id: req.params.id, userId: req.user._id },
          { symbol: String(symbol).toUpperCase() },
          { new: true },
        )

    if (!item) {
      return res.status(404).json({ message: 'Watchlist item not found.' })
    }

    if (context.state.useMemoryStore) {
      item.symbol = String(symbol).toUpperCase()
    }

    return res.json({ item: mapWatchlistItem(context, item) })
  }))

  router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
    const item = context.state.useMemoryStore
      ? context.state.memoryStore.watchlists.find(
          (entry) => entry.id === req.params.id && entry.userId === req.user.id,
        )
      : await context.models.Watchlist.findOneAndDelete({
          _id: req.params.id,
          userId: req.user._id,
        })

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

  return router
}

export { createWatchlistRouter }
