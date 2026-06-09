import { Router } from 'express'
import authRoutes from './authRoutes.js'
import commentRoutes from './commentRoutes.js'
import healthRoutes from './healthRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/comments', commentRoutes)
router.use('/health', healthRoutes)

export default router

