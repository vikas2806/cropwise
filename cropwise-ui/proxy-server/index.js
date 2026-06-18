require('dotenv').config()
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cors = require('cors')

const app = express()
const BACKEND_URL = process.env.BACKEND_URL
const PORT = process.env.PROXY_PORT || 4000
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173'

if (!BACKEND_URL) {
  console.error('FATAL: BACKEND_URL is not set in proxy-server/.env')
  process.exit(1)
}

app.use(helmet())
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }))

app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, slow down.' },
}))

app.use('/api', createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
  on: {
    proxyReq: (proxyReq) => {
      if (process.env.INTERNAL_API_KEY) {
        proxyReq.setHeader('X-Internal-Key', process.env.INTERNAL_API_KEY)
      }
      proxyReq.removeHeader('x-forwarded-for')
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err.message)
      res.status(502).json({ error: 'Backend unavailable' })
    },
  },
}))

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT} → ${BACKEND_URL}`)
})
