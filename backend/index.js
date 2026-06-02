import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import app from './src/app.js'
import { connectDatabase } from './src/config/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config()
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const PORT = process.env.PORT || 3000

async function startServer() {
  await connectDatabase()

  app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error(`Erro ao iniciar API: ${error.message}`)
  process.exit(1)
})

