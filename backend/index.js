import mongoose from 'mongoose'
import { createApp } from './app.js'
import { createAppContext } from './config/appContext.js'
import { getEnvConfig } from './config/env.js'
import { User, Watchlist } from './models/index.js'

const config = getEnvConfig()
const context = createAppContext(config, { User, Watchlist })
const app = createApp(context)

async function connectDb() {
  await mongoose.connect(config.mongoUri)
}

function startServer() {
  app.listen(config.port, () => {
    console.log(`Smart Stock API running on http://localhost:${config.port}`)
  })
}

connectDb()
  .then(() => {
    startServer()
  })
  .catch((error) => {
    context.state.useMemoryStore = true
    console.warn(`MongoDB unavailable, using in-memory storage: ${error.message}`)
    startServer()
  })
