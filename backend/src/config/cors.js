const localOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

function parseAllowedOrigins(value = '') {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

export function getAllowedOrigins() {
  return [
    ...localOrigins,
    ...parseAllowedOrigins(process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL),
  ]
}

export function corsOptions() {
  const allowedOrigins = getAllowedOrigins()

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origem não permitida pelo CORS.'))
    },
    credentials: true,
  }
}
