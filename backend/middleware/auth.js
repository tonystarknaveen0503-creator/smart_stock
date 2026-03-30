import jwt from 'jsonwebtoken'
import { getUserId } from '../utils/serializers.js'

function createToken(context, user) {
  return jwt.sign(
    {
      id: getUserId(user),
      email: user.email,
      name: user.name,
      role: user.role,
    },
    context.config.jwtSecret,
    { expiresIn: '7d' },
  )
}

function createAuthMiddleware(context) {
  return async function authMiddleware(req, res, next) {
    const header = req.headers.authorization
    const token = header?.startsWith('Bearer ') ? header.slice(7) : ''

    if (!token) {
      return res.status(401).json({ message: 'Authorization token required.' })
    }

    try {
      const payload = jwt.verify(token, context.config.jwtSecret)
      const user = context.state.useMemoryStore
        ? context.state.memoryStore.users.find((entry) => entry.id === payload.id)
        : await context.models.User.findById(payload.id)

      if (!user) {
        return res.status(401).json({ message: 'User not found.' })
      }

      req.user = user
      return next()
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token.' })
    }
  }
}

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' })
  }

  return next()
}

export { adminMiddleware, createAuthMiddleware, createToken }
