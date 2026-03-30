import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { createToken } from '../middleware/auth.js'
import { createMemoryId, sanitizeUser } from '../utils/serializers.js'

function createAuthRouter(context, authMiddleware) {
  const router = Router()

  router.post('/signup', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    const normalizedEmail = email.toLowerCase()
    const existingUser = context.state.useMemoryStore
      ? context.state.memoryStore.users.find((user) => user.email === normalizedEmail)
      : await context.models.User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists.' })
    }

    if (String(name).trim().length < 3) {
      return res.status(400).json({ message: 'Name must be at least 3 characters.' })
    }

    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = context.state.useMemoryStore
      ? {
          id: createMemoryId('user'),
          name,
          email: normalizedEmail,
          passwordHash,
          role: normalizedEmail === context.config.adminEmail ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
        }
      : await context.models.User.create({
          name,
          email: normalizedEmail,
          passwordHash,
          role: normalizedEmail === context.config.adminEmail ? 'admin' : 'user',
        })

    if (context.state.useMemoryStore) {
      context.state.memoryStore.users.push(user)
    }

    return res.status(201).json({
      token: createToken(context, user),
      user: sanitizeUser(user),
    })
  }))

  router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const normalizedEmail = email.toLowerCase()
    const user = context.state.useMemoryStore
      ? context.state.memoryStore.users.find((entry) => entry.email === normalizedEmail)
      : await context.models.User.findOne({ email: normalizedEmail })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    return res.json({
      token: createToken(context, user),
      user: sanitizeUser(user),
    })
  }))

  router.post('/forgot-password', asyncHandler(async (req, res) => {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const normalizedEmail = email.toLowerCase()
    const user = context.state.useMemoryStore
      ? context.state.memoryStore.users.find((entry) => entry.email === normalizedEmail)
      : await context.models.User.findOne({ email: normalizedEmail })

    return res.json({
      success: true,
      message: user
        ? 'Password reset instructions have been sent to your email.'
        : 'If an account exists for this email, password reset instructions have been sent.',
    })
  }))

  router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
    return res.json({ user: sanitizeUser(req.user) })
  }))

  return router
}

export { createAuthRouter }
