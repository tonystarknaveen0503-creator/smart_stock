function notFoundHandler(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
}

function errorHandler(error, _req, res, _next) {
  if (res.headersSent) {
    return
  }

  console.error(error)

  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON request body.' })
  }

  if (error?.code === 11000) {
    return res.status(409).json({ message: 'Email already exists.' })
  }

  if (error?.name === 'ValidationError') {
    return res.status(400).json({ message: error.message || 'Validation failed.' })
  }

  return res.status(error?.status || 500).json({
    message: error?.message || 'Internal server error.',
  })
}

export { errorHandler, notFoundHandler }
