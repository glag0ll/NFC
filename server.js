import 'dotenv/config'
import express from 'express'
import compression from 'compression'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { initDb, insertOrder, healthCheck } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 10002

// Middlewares
app.use(compression())
app.use(express.json({ limit: '1mb' }))

// Minimal API for orders
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}
const ordersFile = path.join(dataDir, 'orders.ndjson')

// Initialize database on startup (non-fatal if fails)
initDb()
  .then(() => console.log('Database initialized'))
  .catch((err) => console.error('Database init error:', err))

app.post('/api/order', async (req, res) => {
  const payload = { ...req.body, createdAt: new Date().toISOString(), ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress }
  try {
    const id = await insertOrder(payload)
    return res.status(200).json({ ok: true, id })
  } catch (e) {
    // Fallback to file append if DB is unavailable
    try {
      fs.appendFileSync(ordersFile, JSON.stringify(payload) + '\n', 'utf8')
      return res.status(200).json({ ok: true, fallback: 'fs' })
    } catch (err) {
      return res.status(500).json({ ok: false })
    }
  }
})

// Health check for DB connectivity
app.get('/api/health', async (req, res) => {
  try {
    await healthCheck()
    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ ok: false })
  }
})

// Static
app.use(express.static(path.join(__dirname, 'dist'), { maxAge: '1d', index: 'index.html' }))

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`)
})

