import { createServer } from 'node:http'
import { randomBytes, pbkdf2Sync, timingSafeEqual, createHmac } from 'node:crypto'
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')
const DB_FILE = join(DATA_DIR, 'db.json')
const PORT = Number(process.env.PORT || 5000)
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'smartpark-dev-secret-change-me'
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

const DEFAULT_SLOTS = [
  { id: 1, status: 'available' },
  { id: 2, status: 'occupied' },
  { id: 3, status: 'available' },
  { id: 4, status: 'available' },
  { id: 5, status: 'available' },
  { id: 6, status: 'available' },
]

function ensureDatabase() {
  mkdirSync(DATA_DIR, { recursive: true })

  if (!existsSync(DB_FILE)) {
    const demoPassword = hashPassword('demo123')
    writeDatabase({
      users: [
        {
          id: 1,
          name: 'Demo User',
          email: 'demo@smartpark.com',
          passwordHash: demoPassword.hash,
          passwordSalt: demoPassword.salt,
          createdAt: new Date().toISOString(),
        },
      ],
      slots: DEFAULT_SLOTS,
      bookings: [],
      payments: [],
    })
  }
}

function readDatabase() {
  ensureDatabase()
  return JSON.parse(readFileSync(DB_FILE, 'utf8'))
}

function writeDatabase(db) {
  writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex')
  return { salt, hash }
}

function verifyPassword(password, user) {
  const attempted = Buffer.from(hashPassword(password, user.passwordSalt).hash, 'hex')
  const stored = Buffer.from(user.passwordHash, 'hex')
  return attempted.length === stored.length && timingSafeEqual(attempted, stored)
}

function base64Url(input) {
  return Buffer.from(JSON.stringify(input)).toString('base64url')
}

function sign(value) {
  return createHmac('sha256', TOKEN_SECRET).update(value).digest('base64url')
}

function createToken(user) {
  const payload = base64Url({ userId: user.id, exp: Date.now() + TOKEN_TTL_MS })
  return `${payload}.${sign(payload)}`
}

function parseToken(token) {
  if (!token || !token.includes('.')) return null

  const [payload, signature] = token.split('.')
  if (sign(payload) !== signature) return null

  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  if (!decoded.exp || decoded.exp < Date.now()) return null
  return decoded
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  }
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  })
  res.end(JSON.stringify(data))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 1_000_000) {
        req.destroy()
        reject(new Error('Request body too large'))
      }
    })
    req.on('end', () => {
      if (!body) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('Invalid JSON body'))
      }
    })
    req.on('error', reject)
  })
}

function authenticate(req, db) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const payload = parseToken(token)
  if (!payload) return null
  return db.users.find(user => user.id === payload.userId) || null
}

function nextId(records) {
  return records.reduce((max, record) => Math.max(max, Number(record.id) || 0), 0) + 1
}

function calculatePrice(duration) {
  return Math.ceil(Number(duration) * 5)
}

function routePattern(path, pattern) {
  const pathParts = path.split('/').filter(Boolean)
  const patternParts = pattern.split('/').filter(Boolean)
  if (pathParts.length !== patternParts.length) return null

  const params = {}
  for (let i = 0; i < patternParts.length; i += 1) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = pathParts[i]
    } else if (patternParts[i] !== pathParts[i]) {
      return null
    }
  }
  return params
}

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const db = readDatabase()

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, { ok: true })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/register') {
      const { email, password, name } = await readBody(req)
      const normalizedEmail = String(email || '').trim().toLowerCase()

      if (!normalizedEmail || !password || !name) {
        sendJson(res, 400, { message: 'Name, email, and password are required.' })
        return
      }

      if (String(password).length < 6) {
        sendJson(res, 400, { message: 'Password must be at least 6 characters.' })
        return
      }

      if (db.users.some(user => user.email === normalizedEmail)) {
        sendJson(res, 409, { message: 'An account with this email already exists.' })
        return
      }

      const hashed = hashPassword(String(password))
      const user = {
        id: nextId(db.users),
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash: hashed.hash,
        passwordSalt: hashed.salt,
        createdAt: new Date().toISOString(),
      }

      db.users.push(user)
      writeDatabase(db)
      sendJson(res, 201, { token: createToken(user), user: publicUser(user) })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/login') {
      const { email, password } = await readBody(req)
      const normalizedEmail = String(email || '').trim().toLowerCase()
      const user = db.users.find(candidate => candidate.email === normalizedEmail)

      if (!user || !verifyPassword(String(password || ''), user)) {
        sendJson(res, 401, { message: 'Invalid email or password.' })
        return
      }

      sendJson(res, 200, { token: createToken(user), user: publicUser(user) })
      return
    }

    const currentUser = authenticate(req, db)

    if (req.method === 'GET' && url.pathname === '/api/me') {
      if (!currentUser) {
        sendJson(res, 401, { message: 'Authentication required.' })
        return
      }
      sendJson(res, 200, { user: publicUser(currentUser) })
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/slots') {
      sendJson(res, 200, db.slots)
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/bookings') {
      if (!currentUser) {
        sendJson(res, 401, { message: 'Authentication required.' })
        return
      }

      const bookings = db.bookings.filter(booking => booking.userId === currentUser.id)
      sendJson(res, 200, bookings)
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/bookings') {
      if (!currentUser) {
        sendJson(res, 401, { message: 'Authentication required.' })
        return
      }

      const { slotId, duration, timeStart } = await readBody(req)
      const parsedSlotId = Number(slotId)
      const parsedDuration = Number(duration)
      const slot = db.slots.find(candidate => candidate.id === parsedSlotId)

      if (!slot || slot.status !== 'available') {
        sendJson(res, 409, { message: 'That parking slot is not available.' })
        return
      }

      if (!parsedDuration || parsedDuration <= 0 || !timeStart) {
        sendJson(res, 400, { message: 'Slot, duration, and start time are required.' })
        return
      }

      const booking = {
        id: nextId(db.bookings),
        userId: currentUser.id,
        slotId: parsedSlotId,
        duration: parsedDuration,
        timeStart: String(timeStart),
        status: 'active',
        price: calculatePrice(parsedDuration),
        createdAt: new Date().toISOString(),
      }

      slot.status = 'booked'
      db.bookings.push(booking)
      writeDatabase(db)
      sendJson(res, 201, booking)
      return
    }

    const cancelParams = routePattern(url.pathname, '/api/bookings/:id/cancel')
    if (req.method === 'POST' && cancelParams) {
      if (!currentUser) {
        sendJson(res, 401, { message: 'Authentication required.' })
        return
      }

      const booking = db.bookings.find(candidate => candidate.id === Number(cancelParams.id))
      if (!booking || booking.userId !== currentUser.id) {
        sendJson(res, 404, { message: 'Booking not found.' })
        return
      }

      booking.status = 'completed'
      booking.cancelledAt = new Date().toISOString()

      const slot = db.slots.find(candidate => candidate.id === booking.slotId)
      if (slot) slot.status = 'available'

      writeDatabase(db)
      sendJson(res, 200, booking)
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/payment') {
      if (!currentUser) {
        sendJson(res, 401, { message: 'Authentication required.' })
        return
      }

      const { bookingId, amount } = await readBody(req)
      const payment = {
        id: nextId(db.payments),
        bookingId: Number(bookingId) || null,
        userId: currentUser.id,
        amount: Number(amount) || 0,
        transactionId: `TXN-${Date.now()}`,
        status: 'success',
        createdAt: new Date().toISOString(),
      }

      db.payments.push(payment)
      writeDatabase(db)
      sendJson(res, 201, payment)
      return
    }

    sendJson(res, 404, { message: 'Endpoint not found.' })
  } catch (error) {
    sendJson(res, 500, { message: error.message || 'Server error.' })
  }
}

ensureDatabase()

createServer(handleRequest).listen(PORT, () => {
  if (!process.env.SILENT_SERVER_START) {
    console.log(`SmartPark backend listening on http://localhost:${PORT}`)
  }
})
