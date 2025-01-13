import express, { json, urlencoded } from 'express'
import cors from 'cors'
import https from 'https'
import http from 'http'

const app = express()

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(json())
app.use(urlencoded({ extended: true }))

// Request handler
app.use('/', (req, res) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  // Validate target URL
  const targetUrl = req.query.targetUrl
  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' })
  }

  try {
    handleProxyRequest(req, res, targetUrl)
  } catch (error) {
    console.error('Setup error:', error)
    res.status(500).json({
      error: 'Setup Error',
      message: error.message,
    })
  }
})

// Helper function to handle proxy requests
function handleProxyRequest(req, res, targetUrl) {
  try {
    const parsedUrl = new URL(targetUrl)
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: req.method,
      headers: {
        Authorization: req.headers.authorization,
        'Accept-Language': req.headers['accept-language'],
        Accept: 'application/vnd.mx.api.v1+json',
        'Content-Type': 'application/json',
        Host: parsedUrl.hostname,
      },
      timeout: 5000,
    }

    let hasResponded = false
    const sendResponse = (statusCode, data) => {
      if (!hasResponded) {
        hasResponded = true
        res.status(statusCode).json(data)
      }
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http
    const proxyReq = protocol.request(options)

    // Set timeout before any other handlers
    proxyReq.setTimeout(5000, () => {
      console.log('⏰ Request timed out')
      proxyReq.destroy()
      sendResponse(504, {
        error: 'Gateway Timeout',
        message: 'Request timed out',
      })
    })

    proxyReq.on('error', (error) => {
      console.error('❌ Request error:', error.message, error.code)

      if (error.code === 'ECONNRESET') {
        sendResponse(502, {
          error: 'Bad Gateway',
          message: 'Connection reset by peer',
          code: error.code,
        })
      } else {
        sendResponse(500, {
          error: 'Proxy Error',
          message: error.message,
          code: error.code,
        })
      }
    })

    proxyReq.on('response', (proxyRes) => {
      let responseData = ''
      proxyRes.on('data', (chunk) => {
        responseData += chunk
      })

      proxyRes.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData)
          sendResponse(proxyRes.statusCode, jsonData)
        } catch (e) {
          sendResponse(502, {
            error: 'Invalid Response',
            message: 'Received invalid JSON response from target server',
          })
        }
      })
    })

    // Write body if it exists
    if (req.body && Object.keys(req.body).length > 0) {
      const bodyData = JSON.stringify(req.body)
      proxyReq.write(bodyData)
    }

    proxyReq.end()
  } catch (error) {
    res.status(500).json({
      error: 'Setup Error',
      message: error.message,
    })
  }
}

const PORT = 3001
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`)
})
