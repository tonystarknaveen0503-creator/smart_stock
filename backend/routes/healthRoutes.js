import { Router } from 'express'

function createHealthRouter(context) {
  const router = Router()

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      app: 'Smart Stock API',
      storage: context.state.useMemoryStore ? 'memory' : 'mongodb',
    })
  })

  return router
}

export { createHealthRouter }
