import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const serverDir = path.resolve(__dirname, '..')
const projectRoot = path.resolve(serverDir, '..')

dotenv.config({ path: path.resolve(projectRoot, '.env') })
dotenv.config({ path: path.resolve(serverDir, '.env') })

function getEnvConfig() {
  return {
    port: Number(process.env.PORT || 4000),
    jwtSecret: process.env.JWT_SECRET || 'smart-stock-dev-secret',
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartstock',
    adminEmail: (process.env.ADMIN_EMAIL || 'admin@smartstock.com').toLowerCase(),
    apiKey: process.env.ALPHA_VANTAGE_API_KEY || '',
  }
}

export { getEnvConfig }
